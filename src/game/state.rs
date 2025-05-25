use dashmap::DashMap;
use std::sync::Arc;
use std::time::{Duration, Instant};
use tokio::sync::broadcast;
use uuid::Uuid;
use tracing::info;
use rapier3d::prelude::RigidBodyHandle;

use super::{Player, Bullet, Enemy};
use super::physics::{PhysicsWorld, TankInput, calculate_bullet_trajectory};
use crate::network::messages::{ServerMessage, PlayerInput};

#[derive(Clone)]
pub struct GameServer {
    pub players: Arc<DashMap<String, Player>>,
    pub bullets: Arc<DashMap<Uuid, Bullet>>,
    pub enemies: Arc<DashMap<Uuid, Enemy>>,
    pub player_inputs: Arc<DashMap<String, TankInput>>,
    pub physics_world: Arc<tokio::sync::Mutex<PhysicsWorld>>,
    pub broadcaster: broadcast::Sender<ServerMessage>,
}

impl GameServer {
    pub fn new() -> Self {
        let (broadcaster, _) = broadcast::channel(1000);
        
        GameServer {
            players: Arc::new(DashMap::new()),
            bullets: Arc::new(DashMap::new()),
            enemies: Arc::new(DashMap::new()),
            player_inputs: Arc::new(DashMap::new()),
            physics_world: Arc::new(tokio::sync::Mutex::new(PhysicsWorld::new())),
            broadcaster,
        }
    }

    /// Start the game server with physics loop and enemy spawning
    pub fn start_game_loop(self) -> Self {
        // Start the physics game loop
        let game_server = self.clone();
        tokio::spawn(async move {
            game_server.physics_loop().await;
        });

        // Spawn some enemies for testing
        let enemy_server = self.clone();
        tokio::spawn(async move {
            enemy_server.spawn_initial_enemies().await;
        });

        self
    }

    /// Spawn enemies manually (useful for testing)
    pub async fn spawn_enemies(&self) {
        self.spawn_initial_enemies().await;
    }

    pub async fn add_player(&self, player_id: String) {
        let player = Player::new(player_id.clone());
        let initial_position = player.position;
        
        // Add player to physics world
        {
            let mut physics = self.physics_world.lock().await;
            physics.add_tank(player_id.clone(), initial_position);
        }
        
        self.players.insert(player_id.clone(), player.clone());
        self.player_inputs.insert(player_id.clone(), TankInput::default());

        // Broadcast player joined
        let _ = self.broadcaster.send(ServerMessage::PlayerJoined { player });
    }

    pub async fn remove_player(&self, player_id: &str) {
        if self.players.remove(player_id).is_some() {
            self.player_inputs.remove(player_id);
            
            // Remove from physics world
            {
                let mut physics = self.physics_world.lock().await;
                physics.remove_player(player_id);
            }
            
            let _ = self.broadcaster.send(ServerMessage::PlayerLeft {
                player_id: player_id.to_string(),
            });
        }
    }

    /// Handle player input (replaces the old update_player method)
    pub async fn handle_player_input(&self, player_id: &str, input: PlayerInput) {
        // Convert and store input for physics processing
        let tank_input = TankInput::from(input);
        self.player_inputs.insert(player_id.to_string(), tank_input);
    }

    /// Fire a bullet using physics calculation
    pub async fn handle_fire_command(&self, player_id: &str) -> Option<Uuid> {
        if let Some(player) = self.players.get(player_id) {
            // Get current player input for turret direction
            let tank_input = self.player_inputs.get(player_id)?.clone();
            
            // Get current player position and rotation from physics world
            let (position, rotation) = {
                let physics = self.physics_world.lock().await;
                if let Some(&tank_handle) = physics.player_bodies.get(player_id) {
                    physics.get_body_transform(tank_handle)?
                } else {
                    return None;
                }
            };
            
            // Calculate bullet trajectory
            let (bullet_position, bullet_velocity) = calculate_bullet_trajectory(
                position,
                rotation,
                tank_input.turret_yaw,
                tank_input.turret_pitch
            );
            
            // Create bullet
            let bullet = Bullet::new(player_id.to_string(), bullet_position, bullet_velocity);
            let bullet_id = bullet.id;
            
            // Add bullet to physics world
            {
                let mut physics = self.physics_world.lock().await;
                physics.add_bullet(bullet_id, bullet_position, bullet_velocity);
            }
            
            self.bullets.insert(bullet_id, bullet.clone());
            
            // Broadcast bullet spawn
            let _ = self.broadcaster.send(ServerMessage::BulletSpawned { bullet });
            
            // Schedule bullet removal after 5 seconds
            let server = self.clone();
            tokio::spawn(async move {
                tokio::time::sleep(Duration::from_secs(5)).await;
                server.remove_bullet(bullet_id).await;
            });

            Some(bullet_id)
        } else {
            None
        }
    }

    pub async fn remove_bullet(&self, bullet_id: Uuid) {
        if self.bullets.remove(&bullet_id).is_some() {
            // Remove from physics world
            {
                let mut physics = self.physics_world.lock().await;
                physics.remove_bullet(bullet_id);
            }
            
            let _ = self.broadcaster.send(ServerMessage::BulletDestroyed { bullet_id });
        }
    }

    pub async fn handle_chat_message(&self, player_id: &str, message: String) {
        let _ = self.broadcaster.send(ServerMessage::ChatMessage {
            player_id: player_id.to_string(),
            message,
            timestamp: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_millis() as u64,
        });
    }

    /// Main physics loop - runs at 60 FPS
    async fn physics_loop(&self) {
        let mut interval = tokio::time::interval(Duration::from_millis(16)); // ~60 FPS
        let mut bullets_to_remove = Vec::new();
        let mut iteration = 0u64;
        
        loop {
            interval.tick().await;
            bullets_to_remove.clear();
            
            // Step the physics simulation
            {
                let mut physics = self.physics_world.lock().await;
                
                // Apply player inputs to tanks
                for player_input_ref in self.player_inputs.iter() {
                    let player_id = player_input_ref.key().clone();
                    let input = player_input_ref.value().clone();
                    physics.apply_tank_input(&player_id, &input);
                }
                
                // Step physics forward
                physics.step();
                
                // Update player positions from physics
                for player_ref in self.players.iter() {
                    let player_id = player_ref.key().clone();
                    
                    if let Some(&tank_handle) = physics.player_bodies.get(&player_id) {
                        if let Some((position, rotation)) = physics.get_body_transform(tank_handle) {
                            // Update player position in game state
                            if let Some(mut player_ref) = self.players.get_mut(&player_id) {
                                let player = player_ref.value_mut();
                                player.position = position;
                                player.rotation = rotation;
                                
                                // Update turret rotation from input
                                if let Some(input) = self.player_inputs.get(&player_id) {
                                    player.turret_rotation = [0.0, input.turret_yaw, input.turret_pitch];
                                }
                                
                                player.last_update = Instant::now();
                            }
                        }
                    }
                }
                
                // Update bullet positions from physics
                for bullet_ref in self.bullets.iter() {
                    let bullet_id = *bullet_ref.key();
                    
                    if let Some(&bullet_handle) = physics.bullet_bodies.get(&bullet_id) {
                        if let Some((position, _rotation)) = physics.get_body_transform(bullet_handle) {
                            // Update bullet position
                            if let Some(mut bullet_ref) = self.bullets.get_mut(&bullet_id) {
                                let bullet = bullet_ref.value_mut();
                                bullet.position = position;
                            }
                        } else {
                            // Bullet physics body was removed (collision), remove from game
                            bullets_to_remove.push(bullet_id);
                        }
                    }
                }
                
                // Update enemy positions and AI
                for enemy_ref in self.enemies.iter() {
                    let enemy_id = *enemy_ref.key();
                    
                    if let Some(&enemy_handle) = physics.enemy_bodies.get(&enemy_id) {
                        if let Some((position, rotation)) = physics.get_body_transform(enemy_handle) {
                            // Update enemy position
                            if let Some(mut enemy_ref) = self.enemies.get_mut(&enemy_id) {
                                let enemy = enemy_ref.value_mut();
                                enemy.position = position;
                                enemy.rotation = rotation;
                                enemy.last_update = Instant::now();
                            }
                        }
                    }
                }
            }
            
            // Remove bullets that no longer have physics bodies
            for bullet_id in bullets_to_remove.drain(..) {
                self.remove_bullet(bullet_id).await;
            }
            
            // Broadcast updates to all players (less frequently to save bandwidth)
            // Use a simple counter since interval.period() is always the same value
            if iteration % 3 == 0 { // Every 3 frames (~50ms at 60fps)
                self.broadcast_game_state().await;
            }
            
            iteration += 1;
        }
    }

    /// Broadcast current game state to all clients
    async fn broadcast_game_state(&self) {
        let players: Vec<Player> = self.players.iter().map(|entry| entry.value().clone()).collect();
        let enemies: Vec<Enemy> = self.enemies.iter().map(|entry| entry.value().clone()).collect();
        
        let _ = self.broadcaster.send(ServerMessage::GameStateUpdate {
            players,
            enemies,
        });
    }

    async fn spawn_initial_enemies(&self) {
        let enemy_positions = [
            [15.0, 0.5, 20.0], [-20.0, 0.5, 15.0], [25.0, 0.5, -10.0], [-15.0, 0.5, -25.0],
            [30.0, 0.5, 5.0], [-25.0, 0.5, -5.0], [10.0, 0.5, -30.0], [35.0, 0.5, 25.0]
        ];

        for (i, position) in enemy_positions.iter().enumerate() {
            let enemy_id = Uuid::new_v4();
            let mut enemy = Enemy::new(*position);
            enemy.id = enemy_id;
            
            // Add enemy to physics world
            {
                let mut physics = self.physics_world.lock().await;
                physics.add_enemy(enemy_id, *position);
            }
            
            self.enemies.insert(enemy_id, enemy.clone());
            
            info!("👹 Spawned enemy {} at position {:?}", i + 1, position);
            
            // Broadcast enemy spawn
            let _ = self.broadcaster.send(ServerMessage::EnemySpawned { enemy });
            
            // Small delay between spawns
            tokio::time::sleep(Duration::from_millis(100)).await;
        }
        
        info!("🎯 Finished spawning {} enemies", enemy_positions.len());
    }

    pub fn get_broadcaster(&self) -> broadcast::Sender<ServerMessage> {
        self.broadcaster.clone()
    }

    // Methods needed by websocket handler
    pub fn subscribe(&self) -> broadcast::Receiver<ServerMessage> {
        self.broadcaster.subscribe()
    }

    pub async fn get_initial_game_state(&self) -> ServerMessage {
        let players: Vec<Player> = self.players.iter().map(|p| p.value().clone()).collect();
        let enemies: Vec<Enemy> = self.enemies.iter().map(|e| e.value().clone()).collect();
        
        ServerMessage::GameStateUpdate {
            players,
            enemies,
        }
    }
} 