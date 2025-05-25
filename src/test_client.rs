use tokio_tungstenite::{connect_async, tungstenite::Message};
use futures_util::{SinkExt, StreamExt};
use serde_json;
use std::time::Duration;
use tokio::time;
use uuid::Uuid;

use crate::network::messages::{ClientMessage, ServerMessage};
use crate::game::{Player, Enemy, Bullet};

#[derive(Debug, Clone)]
pub struct TestClient {
    pub id: String,
    pub position: [f32; 3],
    pub rotation: [f32; 3],
    pub turret_rotation: [f32; 3],
    pub health: u32,
    pub mouse_x: f32,
    pub mouse_y: f32,
    pub other_players: std::collections::HashMap<String, Player>,
    pub enemies: std::collections::HashMap<Uuid, Enemy>,
    pub bullets: std::collections::HashMap<Uuid, Bullet>,
}

impl TestClient {
    pub fn new(id: String) -> Self {
        Self {
            id,
            position: [0.0, 0.5, 0.0],
            rotation: [0.0, 0.0, 0.0],
            turret_rotation: [0.0, 0.0, 0.0],
            health: 100,
            mouse_x: 0.0,
            mouse_y: 0.0,
            other_players: std::collections::HashMap::new(),
            enemies: std::collections::HashMap::new(),
            bullets: std::collections::HashMap::new(),
        }
    }

    pub async fn connect_and_run(&mut self, server_url: &str, test_duration: Duration) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let url = url::Url::parse(server_url)?;
        let (ws_stream, _) = connect_async(url).await?;
        let (mut write, mut read) = ws_stream.split();

        println!("🔌 Test client {} connected to server", self.id);

        // Start test behavior in background
        let mut client_clone = self.clone();
        let behavior_task = tokio::spawn(async move {
            client_clone.run_test_behavior().await;
        });

        // Message handling loop
        let start_time = tokio::time::Instant::now();
        while start_time.elapsed() < test_duration {
            tokio::select! {
                // Handle incoming messages
                msg = read.next() => {
                    if let Some(msg) = msg {
                        match msg? {
                            Message::Text(text) => {
                                if let Ok(server_msg) = serde_json::from_str::<ServerMessage>(&text) {
                                    self.handle_server_message(server_msg).await;
                                }
                            }
                            Message::Binary(data) => {
                                if let Ok(server_msg) = rmp_serde::from_slice::<ServerMessage>(&data) {
                                    self.handle_server_message(server_msg).await;
                                }
                            }
                            _ => {}
                        }
                    }
                }
                
                // Send periodic input
                _ = time::sleep(Duration::from_millis(50)) => {
                    let input_msg = ClientMessage::PlayerInput {
                        forward: true,  // Always moving forward for testing
                        backward: false,
                        strafe_left: false,
                        strafe_right: false,
                        mouse_x: self.mouse_x,
                        mouse_y: self.mouse_y,
                    };
                    
                    let json = serde_json::to_string(&input_msg)?;
                    write.send(Message::Text(json)).await?;
                }
                
                // Fire periodically
                _ = time::sleep(Duration::from_millis(1000)) => {
                    let fire_msg = ClientMessage::FireCommand {};
                    let json = serde_json::to_string(&fire_msg)?;
                    write.send(Message::Text(json)).await?;
                    println!("🔫 Client {} fired!", self.id);
                }
            }
        }

        behavior_task.abort();
        println!("🏁 Test client {} finished", self.id);
        Ok(())
    }

    async fn run_test_behavior(&mut self) {
        let mut direction_change_timer = time::interval(Duration::from_secs(3));
        let mut mouse_x = 0.0f32;
        
        loop {
            direction_change_timer.tick().await;
            
            // Change direction periodically
            mouse_x += 0.5; // Turn right slowly
            if mouse_x > std::f32::consts::PI * 2.0 {
                mouse_x = 0.0;
            }
            self.mouse_x = mouse_x;
            
            println!("🔄 Client {} changing direction to {:.2}", self.id, mouse_x);
        }
    }

    async fn handle_server_message(&mut self, message: ServerMessage) {
        match message {
            ServerMessage::PlayerAssigned { player_id } => {
                println!("🆔 Client assigned ID: {}", player_id);
            }
            
            ServerMessage::PlayerJoined { player } => {
                if player.id != self.id {
                    println!("👋 Other player joined: {}", player.id);
                    self.other_players.insert(player.id.clone(), player);
                }
            }
            
            ServerMessage::PlayerLeft { player_id } => {
                println!("👋 Player left: {}", player_id);
                self.other_players.remove(&player_id);
            }
            
            ServerMessage::PlayerMoved { player_id, position, rotation, turret_rotation } => {
                if player_id == self.id {
                    self.position = position;
                    self.rotation = rotation;
                    self.turret_rotation = turret_rotation;
                } else if let Some(player) = self.other_players.get_mut(&player_id) {
                    player.position = position;
                    player.rotation = rotation;
                    player.turret_rotation = turret_rotation;
                }
            }
            
            ServerMessage::EnemySpawned { enemy } => {
                println!("👹 Enemy spawned: {} at {:?}", enemy.id, enemy.position);
                self.enemies.insert(enemy.id, enemy);
            }
            
            ServerMessage::EnemyMoved { enemy_id, position, rotation } => {
                if let Some(enemy) = self.enemies.get_mut(&enemy_id) {
                    enemy.position = position;
                    enemy.rotation = rotation;
                }
            }
            
            ServerMessage::EnemyHit { enemy_id, bullet_id, damage, new_health } => {
                println!("💥 Enemy {} hit by bullet {} for {} damage, health: {}", 
                        enemy_id, bullet_id, damage, new_health);
                if let Some(enemy) = self.enemies.get_mut(&enemy_id) {
                    enemy.health = new_health;
                }
            }
            
            ServerMessage::EnemyDestroyed { enemy_id, position } => {
                println!("💀 Enemy destroyed: {} at {:?}", enemy_id, position);
                self.enemies.remove(&enemy_id);
            }
            
            ServerMessage::BulletSpawned { bullet } => {
                println!("💥 Bullet spawned: {} from player {}", bullet.id, bullet.player_id);
                self.bullets.insert(bullet.id, bullet);
            }
            
            ServerMessage::BulletDestroyed { bullet_id } => {
                self.bullets.remove(&bullet_id);
            }
            
            ServerMessage::GameStateUpdate { players, enemies } => {
                println!("📊 Game state update: {} players, {} enemies", players.len(), enemies.len());
                
                for player in &players {
                    println!("  👤 Player at {:?}", player.position);
                }
                
                for enemy in &enemies {
                    println!("  👹 Enemy at {:?}", enemy.position);
                }
            }
            
            _ => {
                // Handle other messages
            }
        }
    }

    pub fn print_status(&self) {
        println!("📊 Client {} Status:", self.id);
        println!("  Position: {:?}", self.position);
        println!("  Health: {}", self.health);
        println!("  Other players: {}", self.other_players.len());
        println!("  Enemies: {}", self.enemies.len());
        println!("  Bullets: {}", self.bullets.len());
    }
} 