use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::tungstenite::Message;
use futures_util::{StreamExt, SinkExt};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use uuid::Uuid;
use battlexone_shared::*;
use std::time::{SystemTime, UNIX_EPOCH};
use rand::Rng;

const NUM_NPCS: usize = 5;
const NPC_SPAWN_RADIUS: f32 = 500.0;
const BULLET_LIFETIME: u64 = 5000; // 5 seconds
const WORLD_BOUNDS: f32 = 1000.0;

struct GameServer {
    players: Arc<Mutex<HashMap<String, Player>>>,
    tanks: Arc<Mutex<Vec<Tank>>>,
    bullets: Arc<Mutex<Vec<Bullet>>>,
    connections: Arc<Mutex<HashMap<String, tokio::sync::mpsc::UnboundedSender<Message>>>>,
    npc_targets: Arc<Mutex<HashMap<String, (f32, f32)>>>,
}

struct Player {
    name: String,
    user_id: String,
    tank_id: Option<String>,
}

impl GameServer {
    fn new() -> Self {
        let mut rng = rand::thread_rng();
        let mut tanks = Vec::new();
        let mut npc_targets = HashMap::new();
        
        // Spawn NPCs
        for _ in 0..NUM_NPCS {
            let angle = rng.gen_range(0.0..std::f32::consts::PI * 2.0);
            let distance = rng.gen_range(100.0..NPC_SPAWN_RADIUS);
            let x = angle.cos() * distance;
            let y = angle.sin() * distance;
            
            let npc_id = Uuid::new_v4().to_string();
            let tank = Tank {
                id: npc_id.clone(),
                position: Position { x, y },
                rotation: rng.gen_range(0.0..std::f32::consts::PI * 2.0),
                turret_rotation: 0.0,
                is_player: false,
                health: 100,
                is_dead: false,
                respawn_time: None,
                last_fire_time: 0,
            };
            
            tanks.push(tank);
            npc_targets.insert(npc_id, (x, y));
        }
        
        Self {
            players: Arc::new(Mutex::new(HashMap::new())),
            tanks: Arc::new(Mutex::new(tanks)),
            bullets: Arc::new(Mutex::new(Vec::new())),
            connections: Arc::new(Mutex::new(HashMap::new())),
            npc_targets: Arc::new(Mutex::new(npc_targets)),
        }
    }

    fn update_bullets(&self) {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis() as u64;
        
        let mut bullets = self.bullets.lock().unwrap();
        
        // Update bullet positions and remove old bullets
        bullets.retain_mut(|bullet| {
            // Check if bullet is too old
            if now - bullet.created_at > BULLET_LIFETIME {
                return false;
            }
            
            // Update position
            bullet.position.x += bullet.velocity.x;
            bullet.position.y += bullet.velocity.y;
            
            // Check if bullet is out of bounds
            if bullet.position.x.abs() > WORLD_BOUNDS || bullet.position.y.abs() > WORLD_BOUNDS {
                return false;
            }
            
            // Check for collisions with tanks
            let tanks = self.tanks.lock().unwrap();
            for tank in tanks.iter() {
                if tank.id != bullet.owner_id { // Don't hit yourself
                    let dx = bullet.position.x - tank.position.x;
                    let dy = bullet.position.y - tank.position.y;
                    let distance = (dx * dx + dy * dy).sqrt();
                    
                    if distance < 30.0 { // Tank hitbox radius
                        // TODO: Handle tank damage
                        return false;
                    }
                }
            }
            
            true
        });
    }

    fn update_npcs(&self) {
        let mut rng = rand::thread_rng();
        let mut tanks = self.tanks.lock().unwrap();
        let mut npc_targets = self.npc_targets.lock().unwrap();
        
        for tank in tanks.iter_mut() {
            if !tank.is_player {
                let (target_x, target_y) = npc_targets.get(&tank.id).unwrap_or(&(0.0, 0.0));
                
                // Calculate direction to target
                let dx = target_x - tank.position.x;
                let dy = target_y - tank.position.y;
                let distance = (dx * dx + dy * dy).sqrt();
                
                // If we're close to target, pick a new one
                if distance < 50.0 {
                    let angle = rng.gen_range(0.0..std::f32::consts::PI * 2.0);
                    let distance = rng.gen_range(100.0..NPC_SPAWN_RADIUS);
                    let new_x = angle.cos() * distance;
                    let new_y = angle.sin() * distance;
                    npc_targets.insert(tank.id.clone(), (new_x, new_y));
                } else {
                    // Move towards target
                    let speed = 2.0;
                    let target_angle = dy.atan2(dx);
                    tank.rotation = target_angle;
                    tank.position.x += target_angle.cos() * speed;
                    tank.position.y += target_angle.sin() * speed;
                    
                    // Keep tanks within bounds
                    tank.position.x = tank.position.x.clamp(-WORLD_BOUNDS, WORLD_BOUNDS);
                    tank.position.y = tank.position.y.clamp(-WORLD_BOUNDS, WORLD_BOUNDS);
                    
                    // Randomly rotate turret
                    if rng.gen_bool(0.1) {
                        tank.turret_rotation += rng.gen_range(-0.1..0.1);
                    }
                    
                    // Randomly fire
                    if rng.gen_bool(0.01) {
                        let now = SystemTime::now()
                            .duration_since(UNIX_EPOCH)
                            .unwrap()
                            .as_millis() as u64;
                        
                        if now - tank.last_fire_time > 1000 { // 1 second cooldown
                            tank.last_fire_time = now;
                            
                            let bullet = Bullet {
                                id: Uuid::new_v4().to_string(),
                                position: Position {
                                    x: tank.position.x + tank.turret_rotation.cos() * 30.0,
                                    y: tank.position.y + tank.turret_rotation.sin() * 30.0,
                                },
                                velocity: Velocity {
                                    x: tank.turret_rotation.cos() * 10.0,
                                    y: tank.turret_rotation.sin() * 10.0,
                                },
                                owner_id: tank.id.clone(),
                                created_at: now,
                            };
                            
                            self.bullets.lock().unwrap().push(bullet);
                        }
                    }
                }
            }
        }
    }

    async fn broadcast_game_state(&self) {
        // Clone the current state FIRST
        let game_state = {
            let tanks = self.tanks.lock().unwrap();
            let bullets = self.bullets.lock().unwrap();
            GameState {
                tanks: tanks.clone(),
                bullets: bullets.clone(),
            }
        };

        // Then, update the canonical game state for the next tick
        self.update_bullets();
        self.update_npcs();
        
        if let Ok(msg_str) = serde_json::to_string(&ServerMessage::GameState(game_state)) {
            let connections = self.connections.lock().unwrap();
            for sender in connections.values() {
                let _ = sender.send(Message::Text(msg_str.clone()));
            }
        }
    }

    fn handle_input(&self, player_id: &str, input: u16) {
        let mut tanks = self.tanks.lock().unwrap();
        if let Some(tank) = tanks.iter_mut().find(|t| t.id == player_id) {
            // Update tank position based on input
            let speed = 5.0;
            let rotation_speed = 0.1;
            
            // Movement
            if input & (1 << 0) != 0 { // W
                tank.position.x += tank.rotation.cos() * speed;
                tank.position.y += tank.rotation.sin() * speed;
            }
            if input & (1 << 1) != 0 { // A
                tank.rotation -= rotation_speed;
            }
            if input & (1 << 2) != 0 { // S
                tank.position.x -= tank.rotation.cos() * speed;
                tank.position.y -= tank.rotation.sin() * speed;
            }
            if input & (1 << 3) != 0 { // D
                tank.rotation += rotation_speed;
            }
            
            // Turret rotation
            if input & (1 << 4) != 0 { // Left arrow
                tank.turret_rotation -= rotation_speed;
            }
            if input & (1 << 5) != 0 { // Right arrow
                tank.turret_rotation += rotation_speed;
            }
            
            // Fire
            if input & (1 << 8) != 0 { // Space
                let now = SystemTime::now()
                    .duration_since(UNIX_EPOCH)
                    .unwrap()
                    .as_millis() as u64;
                
                if now - tank.last_fire_time > 500 { // 500ms cooldown
                    tank.last_fire_time = now;
                    
                    let bullet = Bullet {
                        id: Uuid::new_v4().to_string(),
                        position: Position {
                            x: tank.position.x + tank.turret_rotation.cos() * 30.0,
                            y: tank.position.y + tank.turret_rotation.sin() * 30.0,
                        },
                        velocity: Velocity {
                            x: tank.turret_rotation.cos() * 10.0,
                            y: tank.turret_rotation.sin() * 10.0,
                        },
                        owner_id: player_id.to_string(),
                        created_at: now,
                    };
                    
                    self.bullets.lock().unwrap().push(bullet);
                }
            }
        }
    }

    async fn handle_connection(&self, stream: TcpStream, addr: std::net::SocketAddr) {
        let ws_stream = tokio_tungstenite::accept_async(stream)
            .await
            .expect("Error during WebSocket handshake");
        
        let (ws_sender, mut ws_receiver) = ws_stream.split();
        
        // Create a channel for sending messages to this client
        let (tx, mut rx) = tokio::sync::mpsc::unbounded_channel();
        
        // Spawn a task to forward messages from the channel to the WebSocket
        let mut ws_sender = ws_sender;
        tokio::spawn(async move {
            while let Some(msg) = rx.recv().await {
                if ws_sender.send(msg).await.is_err() {
                    break;
                }
            }
        });
        
        let mut player_id = None;
        
        // Handle incoming messages
        while let Some(msg) = ws_receiver.next().await {
            match msg {
                Ok(Message::Text(text)) => {
                    if let Ok(client_msg) = serde_json::from_str::<ClientMessage>(&text) {
                        match client_msg {
                            ClientMessage::Join { name, user_id } => {
                                let new_player_id = Uuid::new_v4().to_string();
                                let user_id = user_id.unwrap_or_else(|| Uuid::new_v4().to_string());
                                
                                // Create a new tank for the player
                                let tank = Tank {
                                    id: new_player_id.clone(),
                                    position: Position { x: 0.0, y: 0.0 },
                                    rotation: 0.0,
                                    turret_rotation: 0.0,
                                    is_player: true,
                                    health: 100,
                                    is_dead: false,
                                    respawn_time: None,
                                    last_fire_time: 0,
                                };
                                
                                // Add player and tank
                                {
                                    let mut players = self.players.lock().unwrap();
                                    players.insert(new_player_id.clone(), Player {
                                        name,
                                        user_id: user_id.clone(),
                                        tank_id: Some(new_player_id.clone()),
                                    });
                                }
                                
                                {
                                    let mut tanks = self.tanks.lock().unwrap();
                                    tanks.push(tank);
                                }
                                
                                // Store the connection
                                {
                                    let mut connections = self.connections.lock().unwrap();
                                    connections.insert(new_player_id.clone(), tx.clone());
                                }
                                
                                player_id = Some(new_player_id.clone());
                                
                                // Send join confirmation
                                let join_msg = ServerMessage::Joined {
                                    player_id: new_player_id,
                                    user_id,
                                };
                                
                                if let Ok(msg_str) = serde_json::to_string(&join_msg) {
                                    let _ = tx.send(Message::Text(msg_str));
                                }
                            }
                            ClientMessage::Input { input } => {
                                if let Some(pid) = &player_id {
                                    self.handle_input(pid, input);
                                }
                            }
                        }
                    }
                }
                Ok(Message::Close(_)) => {
                    println!("Client disconnected: {}", addr);
                    break;
                }
                Err(e) => {
                    eprintln!("Error receiving message: {}", e);
                    break;
                }
                _ => {}
            }
        }
        
        // Cleanup when connection is closed
        if let Some(pid) = player_id {
            let mut players = self.players.lock().unwrap();
            players.remove(&pid);
            
            let mut tanks = self.tanks.lock().unwrap();
            tanks.retain(|t| t.id != pid);
            
            let mut connections = self.connections.lock().unwrap();
            connections.remove(&pid);
        }
        
        println!("Connection closed: {}", addr);
    }
}

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::fmt::init();
    
    let server = Arc::new(GameServer::new());
    
    // Start WebSocket server
    let addr = "127.0.0.1:3001";
    let listener = TcpListener::bind(addr).await.expect("Failed to bind");
    println!("WebSocket server listening on: {}", addr);
    
    // Spawn game state broadcast task
    let server_clone = server.clone();
    tokio::spawn(async move {
        let mut interval = tokio::time::interval(tokio::time::Duration::from_millis(50));
        loop {
            interval.tick().await;
            server_clone.broadcast_game_state().await;
        }
    });
    
    // Accept connections
    while let Ok((stream, addr)) = listener.accept().await {
        println!("New connection: {}", addr);
        let server = server.clone();
        tokio::spawn(async move {
            server.handle_connection(stream, addr).await;
        });
    }
} 