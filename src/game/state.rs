use dashmap::DashMap;
use std::sync::Arc;
use std::time::{Duration, Instant};
use tokio::sync::broadcast;
use uuid::Uuid;

use super::{Player, Bullet};
use crate::network::messages::ServerMessage;

#[derive(Clone)]
pub struct GameServer {
    pub players: Arc<DashMap<String, Player>>,
    pub bullets: Arc<DashMap<Uuid, Bullet>>,
    pub broadcaster: broadcast::Sender<ServerMessage>,
    last_update: Arc<tokio::sync::Mutex<Instant>>,
}

impl GameServer {
    pub fn new() -> Self {
        let (broadcaster, _) = broadcast::channel(1000);
        let server = Self {
            players: Arc::new(DashMap::new()),
            bullets: Arc::new(DashMap::new()),
            broadcaster,
            last_update: Arc::new(tokio::sync::Mutex::new(Instant::now())),
        };

        // Start game loop
        let server_clone = server.clone();
        tokio::spawn(async move {
            server_clone.game_loop().await;
        });

        server
    }

    pub async fn add_player(&self, player_id: String) -> Player {
        let player = Player::new(player_id.clone());
        self.players.insert(player_id.clone(), player.clone());
        
        // Broadcast player joined to ALL existing players (including the new one)
        let _ = self.broadcaster.send(ServerMessage::PlayerJoined {
            player: player.clone(),
        });

        player
    }

    pub async fn remove_player(&self, player_id: &str) {
        if self.players.remove(player_id).is_some() {
            let _ = self.broadcaster.send(ServerMessage::PlayerLeft {
                player_id: player_id.to_string(),
            });
        }
    }

    pub async fn update_player(&self, player_id: &str, position: [f32; 3], rotation: [f32; 3], turret_rotation: [f32; 3]) {
        if let Some(mut player) = self.players.get_mut(player_id) {
            player.position = position;
            player.rotation = rotation;
            player.turret_rotation = turret_rotation;
            player.last_update = Instant::now();

            // Broadcast to other players
            let _ = self.broadcaster.send(ServerMessage::PlayerMoved {
                player_id: player_id.to_string(),
                position,
                rotation,
                turret_rotation,
            });
        }
    }

    pub async fn fire_bullet(&self, player_id: &str, position: [f32; 3], velocity: [f32; 3]) -> Option<Uuid> {
        if self.players.contains_key(player_id) {
            let bullet = Bullet::new(player_id.to_string(), position, velocity);
            let bullet_id = bullet.id;
            
            self.bullets.insert(bullet_id, bullet.clone());
            
            // Broadcast bullet spawn
            let _ = self.broadcaster.send(ServerMessage::BulletSpawned { bullet });
            
            // Schedule bullet removal
            let server = self.clone();
            let id = bullet_id;
            tokio::spawn(async move {
                tokio::time::sleep(Duration::from_secs(5)).await;
                server.remove_bullet(id).await;
            });

            Some(bullet_id)
        } else {
            None
        }
    }

    pub async fn remove_bullet(&self, bullet_id: Uuid) {
        if self.bullets.remove(&bullet_id).is_some() {
            let _ = self.broadcaster.send(ServerMessage::BulletDestroyed { bullet_id });
        }
    }

    pub async fn handle_bullet_hit(&self, bullet_id: Uuid, target_player_id: &str, damage: u32) {
        // Remove bullet
        self.remove_bullet(bullet_id).await;

        // Apply damage
        if let Some(mut player) = self.players.get_mut(target_player_id) {
            player.health = player.health.saturating_sub(damage);
            
            let _ = self.broadcaster.send(ServerMessage::BulletHitConfirmed {
                bullet_id,
                target_player_id: target_player_id.to_string(),
                damage,
                new_health: player.health,
            });

            if player.health == 0 {
                // Player destroyed
                let _ = self.broadcaster.send(ServerMessage::PlayerDestroyed {
                    player_id: target_player_id.to_string(),
                });

                // Schedule respawn
                let server = self.clone();
                let player_id = target_player_id.to_string();
                tokio::spawn(async move {
                    tokio::time::sleep(Duration::from_secs(3)).await;
                    server.respawn_player(&player_id).await;
                });
            }
        }
    }

    async fn respawn_player(&self, player_id: &str) {
        if let Some(mut player) = self.players.get_mut(player_id) {
            player.health = 100;
            player.position = [
                (rand::random::<f32>() - 0.5) * 80.0,
                0.5,
                (rand::random::<f32>() - 0.5) * 80.0,
            ];
            player.rotation = [0.0, 0.0, 0.0];
            player.turret_rotation = [0.0, 0.0, 0.0];

            let _ = self.broadcaster.send(ServerMessage::PlayerRespawned {
                player: player.clone(),
            });
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

    async fn game_loop(&self) {
        let mut interval = tokio::time::interval(Duration::from_millis(100)); // 10 FPS
        
        loop {
            interval.tick().await;
            
            // Update bullets
            let mut bullets_to_remove = Vec::new();
            let now = Instant::now();
            
            for mut bullet_ref in self.bullets.iter_mut() {
                let bullet = bullet_ref.value_mut();
                
                // Update position
                bullet.position[0] += bullet.velocity[0] * 0.1;
                bullet.position[1] += bullet.velocity[1] * 0.1;
                bullet.position[2] += bullet.velocity[2] * 0.1;
                
                // Check if bullet is too old or out of bounds
                if now.duration_since(bullet.created_at) > Duration::from_secs(5) ||
                   bullet.position[0].abs() > 100.0 ||
                   bullet.position[2].abs() > 100.0 {
                    bullets_to_remove.push(bullet.id);
                }
            }
            
            // Remove old bullets
            for bullet_id in bullets_to_remove {
                self.remove_bullet(bullet_id).await;
            }

            // Broadcast updated bullets if any exist
            if !self.bullets.is_empty() {
                let bullets: Vec<Bullet> = self.bullets.iter().map(|b| b.value().clone()).collect();
                let _ = self.broadcaster.send(ServerMessage::BulletsUpdate { bullets });
            }
        }
    }

    pub fn subscribe(&self) -> broadcast::Receiver<ServerMessage> {
        self.broadcaster.subscribe()
    }

    // New method to get current game state for a new player
    pub async fn get_initial_game_state(&self) -> ServerMessage {
        let players: Vec<Player> = self.players.iter().map(|p| p.value().clone()).collect();
        let bullets: Vec<Bullet> = self.bullets.iter().map(|b| b.value().clone()).collect();
        
        ServerMessage::GameStateUpdate {
            players,
            bullets,
        }
    }
} 