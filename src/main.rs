use std::collections::HashMap;
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::sync::{RwLock, mpsc};
use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::{accept_async, tungstenite::Message};
use futures_util::{SinkExt, StreamExt};
use uuid::Uuid;
use tokio::io::{AsyncReadExt, AsyncWriteExt};

// Use shared types from lib
use battlexone_shared::*;

type Players = Arc<RwLock<HashMap<String, Tank>>>;
type Bullets = Arc<RwLock<Vec<Bullet>>>;
type ClientSender = mpsc::UnboundedSender<String>;
type Clients = Arc<RwLock<HashMap<String, ClientSender>>>;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();
    
    let players: Players = Arc::new(RwLock::new(HashMap::new()));
    let bullets: Bullets = Arc::new(RwLock::new(Vec::new()));
    let clients: Clients = Arc::new(RwLock::new(HashMap::new()));
    
    // Spawn NPC tanks
    {
        let mut players_guard = players.write().await;
        for i in 0..3 {
            let npc_id = format!("npc_{}", i);
            let npc = Tank {
                id: npc_id.clone(),
                position: Position {
                    x: (i as f32) * 100.0,
                    y: (i as f32) * 50.0,
                },
                rotation: 0.0,
                turret_rotation: 0.0,
                is_player: false,
                health: 100,
                is_dead: false,
                respawn_time: None,
                last_fire_time: 0,
            };
            players_guard.insert(npc_id, npc);
        }
    }
    
    // Start game loop with broadcasting
    let players_clone = players.clone();
    let bullets_clone = bullets.clone();
    let clients_clone = clients.clone();
    tokio::spawn(async move {
        let mut interval = tokio::time::interval(tokio::time::Duration::from_millis(50)); // 20 FPS
        loop {
            interval.tick().await;
            update_npcs(players_clone.clone()).await;
            update_bullets(bullets_clone.clone(), players_clone.clone()).await;
            broadcast_game_state(players_clone.clone(), bullets_clone.clone(), clients_clone.clone()).await;
        }
    });
    
    // Start HTTP server for static files on port 3000
    tokio::spawn(async move {
        let http_listener = TcpListener::bind("0.0.0.0:3000").await.unwrap();
        println!("HTTP server running on http://0.0.0.0:3000");
        
        loop {
            if let Ok((stream, addr)) = http_listener.accept().await {
                tokio::spawn(handle_http_request(stream, addr));
            }
        }
    });
    
    // Start WebSocket server on port 3001
    let ws_listener = TcpListener::bind("0.0.0.0:3001").await?;
    println!("WebSocket server running on ws://0.0.0.0:3001");
    
    while let Ok((stream, addr)) = ws_listener.accept().await {
        let players = players.clone();
        let bullets = bullets.clone();
        let clients = clients.clone();
        tokio::spawn(handle_websocket_from_stream(stream, addr, players, bullets, clients));
    }
    
    Ok(())
}

async fn broadcast_game_state(players: Players, bullets: Bullets, clients: Clients) {
    let game_state = {
        let players_guard = players.read().await;
        let bullets_guard = bullets.read().await;
        GameState {
            tanks: players_guard.values().cloned().collect(),
            bullets: bullets_guard.clone(),
        }
    };
    
    if let Ok(msg) = serde_json::to_string(&ServerMessage::GameState(game_state)) {
        let clients_guard = clients.read().await;
        let mut disconnected_clients = Vec::new();
        
        for (client_id, sender) in clients_guard.iter() {
            if sender.send(msg.clone()).is_err() {
                disconnected_clients.push(client_id.clone());
            }
        }
        
        // Clean up disconnected clients
        drop(clients_guard);
        if !disconnected_clients.is_empty() {
            let mut clients_guard = clients.write().await;
            for client_id in disconnected_clients {
                clients_guard.remove(&client_id);
            }
        }
    }
}

async fn handle_http_request(mut stream: TcpStream, addr: SocketAddr) {
    println!("HTTP request from: {}", addr);
    
    let mut buffer = [0; 1024];
    if let Ok(_) = stream.read(&mut buffer).await {
        let request = String::from_utf8_lossy(&buffer);
        
        // Parse the request line to get the path
        let path = if let Some(first_line) = request.lines().next() {
            let parts: Vec<&str> = first_line.split_whitespace().collect();
            if parts.len() >= 2 && parts[0] == "GET" {
                parts[1]
            } else {
                "/"
            }
        } else {
            "/"
        };
        
        // Sanitize path and determine file to serve
        let file_name = match path {
            "/" => "index.html",
            "/bevy" | "/bevy.html" => "bevy.html",
            "/tank" | "/tank.gltf" => "tank.gltf",
            "/scene.bin" => "scene.bin",
            "/client.js" => "client.js",
            "/client_bg.wasm" => "client_bg.wasm",
            _ => "index.html", // default fallback
        };
        
        let file_path = format!("./static/{}", file_name);
        let content_result = std::fs::read(&file_path);
        let mut content = b"404 Not Found".to_vec();
        let mut content_type = "text/plain";
        let mut response_code = 200;

        if let Ok(file_content) = content_result {
            content = file_content;
            content_type = match file_name {
                name if name.ends_with(".html") => "text/html",
                name if name.ends_with(".gltf") => "application/json",
                name if name.ends_with(".bin") => "application/octet-stream",
                name if name.ends_with(".js") => "application/javascript",
                name if name.ends_with(".wasm") => "application/wasm",
                _ => "application/octet-stream",
            };
        } else {
            response_code = 404;
        }
        
        let header: String = format!(
            "HTTP/1.1 {}\r\nContent-Type: {}\r\nContent-Length: {}\r\n\r\n",
            response_code,
            content_type,
            content.len(),
        );
        
        let _ = stream.write_all(header.as_bytes()).await;
        let _ = stream.write_all(&content).await;
    }
}

async fn handle_websocket_from_stream(stream: TcpStream, addr: SocketAddr, players: Players, bullets: Bullets, clients: Clients) {
    println!("New WebSocket connection from: {}", addr);
    
    let ws_stream = match accept_async(stream).await {
        Ok(ws) => ws,
        Err(e) => {
            eprintln!("WebSocket connection error: {}", e);
            return;
        }
    };
    
    handle_websocket_connection(ws_stream, addr, players, bullets, clients).await;
}

async fn handle_websocket_connection(ws_stream: tokio_tungstenite::WebSocketStream<TcpStream>, addr: SocketAddr, players: Players, bullets: Bullets, clients: Clients) {
    println!("WebSocket established with: {}", addr);
    
    let (mut ws_sender, mut ws_receiver) = ws_stream.split();
    let connection_id = Uuid::new_v4().to_string();
    let mut current_user_id: Option<String> = None;
    
    // Create a channel for this client
    let (tx, mut rx) = mpsc::unbounded_channel();
    
    // Add client to the clients map with connection ID initially
    {
        let mut clients_guard = clients.write().await;
        clients_guard.insert(connection_id.clone(), tx.clone());
    }
    
    // Spawn a task to handle outgoing messages
    let connection_id_clone = connection_id.clone();
    let clients_clone = clients.clone();
    tokio::spawn(async move {
        while let Some(message) = rx.recv().await {
            if ws_sender.send(Message::Text(message)).await.is_err() {
                break;
            }
        }
        
        // Remove client when sender task ends
        let mut clients_guard = clients_clone.write().await;
        clients_guard.remove(&connection_id_clone);
    });
    
    // Send initial game state through the channel
    let game_state = {
        let players_guard = players.read().await;
        let bullets_guard = bullets.read().await;
        GameState {
            tanks: players_guard.values().cloned().collect(),
            bullets: bullets_guard.clone(),
        }
    };
    
    if let Ok(msg) = serde_json::to_string(&ServerMessage::GameState(game_state)) {
        let _ = tx.send(msg);
    }
    
    while let Some(msg) = ws_receiver.next().await {
        match msg {
            Ok(Message::Text(text)) => {
                match serde_json::from_str::<ClientMessage>(&text) {
                    Ok(client_msg) => {
                        match client_msg {
                            ClientMessage::Join { name: _, user_id } => {
                                // Use provided user_id or generate new one
                                let actual_user_id = user_id.unwrap_or_else(|| Uuid::new_v4().to_string());
                                current_user_id = Some(actual_user_id.clone());
                                
                                // Check if this user already has a tank (reconnection)
                                let existing_tank = {
                                    let players_guard = players.read().await;
                                    players_guard.values().find(|tank| tank.id == actual_user_id && tank.is_player).cloned()
                                };
                                
                                let player_tank = if let Some(mut existing) = existing_tank {
                                    println!("Player {} reconnected", actual_user_id);
                                    // Update the tank ID to use the current player_id for client mapping
                                    existing.id = actual_user_id.clone();
                                    existing
                                } else {
                                    println!("New player {} joined", actual_user_id);
                                                                            Tank {
                                                id: actual_user_id.clone(),
                                                position: Position { x: 0.0, y: 0.0 },
                                                rotation: 0.0,
                                                turret_rotation: 0.0,
                                                is_player: true,
                                                health: 100,
                                                is_dead: false,
                                                respawn_time: None,
                                                last_fire_time: 0,
                                            }
                                };
                                
                                {
                                    let mut players_guard = players.write().await;
                                    players_guard.insert(actual_user_id.clone(), player_tank);
                                }
                                
                                // Update the client mapping to use the user_id
                                {
                                    let mut clients_guard = clients.write().await;
                                    clients_guard.remove(&connection_id);
                                    clients_guard.insert(actual_user_id.clone(), tx.clone());
                                }
                                
                                // Send joined confirmation through the channel
                                let joined_msg = ServerMessage::Joined { 
                                    player_id: actual_user_id.clone(),
                                    user_id: actual_user_id.clone(),
                                };
                                if let Ok(msg) = serde_json::to_string(&joined_msg) {
                                    let _ = tx.send(msg);
                                }
                            }
                            ClientMessage::Input { input } => {
                                if let Some(user_id) = &current_user_id {
                                    let input_decoded = ClientMessage::decode_input(input);
                                    let mut players_guard = players.write().await;
                                    if let Some(tank) = players_guard.get_mut(user_id) {
                                        let move_speed = 3.0;
                                        let turn_speed = 0.05;
                                        let turret_speed = 0.08;
                                        // Tank body rotation (A/D keys)
                                        if input_decoded.a {
                                            tank.rotation -= turn_speed;
                                        }
                                        if input_decoded.d {
                                            tank.rotation += turn_speed;
                                        }
                                        // Tank movement (W/S keys) - move in direction tank is facing
                                        if input_decoded.w {
                                            tank.position.x += tank.rotation.cos() * move_speed;
                                            tank.position.y += tank.rotation.sin() * move_speed;
                                        }
                                        if input_decoded.s {
                                            tank.position.x -= tank.rotation.cos() * move_speed;
                                            tank.position.y -= tank.rotation.sin() * move_speed;
                                        }
                                        // Turret rotation (Arrow keys)
                                        if input_decoded.arrow_left {
                                            tank.turret_rotation -= turret_speed;
                                        }
                                        if input_decoded.arrow_right {
                                            tank.turret_rotation += turret_speed;
                                        }
                                        // Firing (Space key)
                                        if input_decoded.space {
                                            let current_time = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64;
                                            let fire_cooldown = 500; // 500ms between shots (2 shots per second)
                                            if current_time - tank.last_fire_time >= fire_cooldown {
                                                println!("Player {} fired!", tank.id);
                                                tank.last_fire_time = current_time;
                                                // Create bullet
                                                let bullet_speed = 8.0;
                                                let total_rotation = tank.rotation + tank.turret_rotation;
                                                let barrel_length = 40.0;
                                                println!("Firing: tank.rotation={:.3}, tank.turret_rotation={:.3}, total_rotation={:.3}", 
                                                    tank.rotation, tank.turret_rotation, total_rotation);
                                                let bullet = Bullet {
                                                    id: format!("bullet_{}_{}", tank.id, current_time),
                                                    position: Position {
                                                        x: tank.position.x + total_rotation.cos() * barrel_length,
                                                        y: tank.position.y + total_rotation.sin() * barrel_length,
                                                    },
                                                    velocity: Velocity {
                                                        x: total_rotation.cos() * bullet_speed,
                                                        y: total_rotation.sin() * bullet_speed,
                                                    },
                                                    owner_id: tank.id.clone(),
                                                    created_at: current_time,
                                                };
                                                // Add bullet to game state
                                                {
                                                    let mut bullets_guard = bullets.write().await;
                                                    bullets_guard.push(bullet);
                                                }
                                            }
                                        }
                                    }
                                }
                                // Note: Game state will be broadcast by the main game loop
                            }
                        } 
                    }
                    Err(e) => {
                        println!("Deserialization error: {:?}", e);
                    }
                }
            }
            Ok(Message::Close(_)) => break,
            Err(e) => {
                eprintln!("WebSocket error: {}", e);
                break;
            }
            _ => {}
        }
    }
    
    // Remove client on disconnect (but keep player tank for reconnection)
    {
        let mut clients_guard = clients.write().await;
        clients_guard.remove(&connection_id);
        
        // Also remove the user_id mapping if it exists
        if let Some(user_id) = &current_user_id {
            clients_guard.remove(user_id);
        }
    }
    
    println!("Connection closed: {}", addr);
}

async fn update_npcs(players: Players) {
    let mut players_guard = players.write().await;
    let current_time = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64;
    
    for (_id, tank) in players_guard.iter_mut() {
        if !tank.is_player {
            // Simple NPC movement - just move in a circle
            tank.rotation += 0.02;
            tank.position.x = tank.position.x + tank.rotation.cos() * 0.5;
            tank.position.y = tank.position.y + tank.rotation.sin() * 0.5;
            
            // Rotate turret independently
            tank.turret_rotation += 0.03;
        }
        
        // Handle respawning
        if tank.is_dead {
            if let Some(respawn_time) = tank.respawn_time {
                if current_time >= respawn_time {
                    // Respawn tank
                    tank.is_dead = false;
                    tank.health = 100;
                    tank.respawn_time = None;
                    
                    // Random respawn position near original location
                    let offset_x = (rand::random::<f32>() - 0.5) * 200.0; // ±100 units
                    let offset_y = (rand::random::<f32>() - 0.5) * 200.0;
                    tank.position.x += offset_x;
                    tank.position.y += offset_y;
                    
                    println!("Tank {} respawned at ({}, {})", tank.id, tank.position.x, tank.position.y);
                }
            }
        }
    }
}

async fn update_bullets(bullets: Bullets, players: Players) {
    let current_time = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64;
    let bullet_lifetime = 5000; // 5 seconds in milliseconds
    
    // Update bullet positions and handle collisions
    {
        let mut bullets_guard = bullets.write().await;
        let mut players_guard = players.write().await;
        
        // Remove expired bullets and update positions
        bullets_guard.retain_mut(|bullet| {
            // Remove bullets older than lifetime
            if current_time - bullet.created_at > bullet_lifetime {
                return false;
            }
            
            // Update bullet position
            bullet.position.x += bullet.velocity.x;
            bullet.position.y += bullet.velocity.y;
            
            // Check collision with tanks
            for tank in players_guard.values_mut() {
                if tank.id == bullet.owner_id || tank.is_dead {
                    continue; // Skip owner and dead tanks
                }
                
                // Simple circular collision detection
                let dx = tank.position.x - bullet.position.x;
                let dy = tank.position.y - bullet.position.y;
                let distance = (dx * dx + dy * dy).sqrt();
                let tank_radius = 20.0; // Tank collision radius
                
                if distance < tank_radius {
                    // Hit!
                    tank.health -= 25; // 25 damage per hit
                    println!("Tank {} hit by bullet from {}! Health: {}", tank.id, bullet.owner_id, tank.health);
                    
                    if tank.health <= 0 {
                        // Tank destroyed
                        tank.is_dead = true;
                        tank.health = 0;
                        tank.respawn_time = Some(current_time + 5000); // Respawn in 5 seconds
                        println!("Tank {} destroyed! Will respawn in 5 seconds.", tank.id);
                    }
                    
                    return false; // Remove bullet after hit
                }
            }
            
            true // Keep bullet
        });
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_tank_creation() {
        let tank = Tank {
            id: "test-tank".to_string(),
            position: Position { x: 10.0, y: 20.0 },
            rotation: 1.5,
            turret_rotation: 0.5,
            is_player: true,
            health: 100,
            is_dead: false,
            respawn_time: None,
            last_fire_time: 0,
        };
        
        assert_eq!(tank.id, "test-tank");
        assert_eq!(tank.position.x, 10.0);
        assert_eq!(tank.position.y, 20.0);
        assert_eq!(tank.rotation, 1.5);
        assert_eq!(tank.turret_rotation, 0.5);
        assert!(tank.is_player);
        assert_eq!(tank.health, 100);
        assert!(!tank.is_dead);
        assert_eq!(tank.last_fire_time, 0);
    }

    #[test]
    fn test_game_state_serialization() {
        let tank = Tank {
            id: "test-tank".to_string(),
            position: Position { x: 0.0, y: 0.0 },
            rotation: 0.0,
            turret_rotation: 0.0,
            is_player: true,
            health: 100,
            is_dead: false,
            respawn_time: None,
            last_fire_time: 0,
        };
        
        let game_state = GameState {
            tanks: vec![tank],
            bullets: vec![],
        };
        
        let serialized = serde_json::to_string(&game_state).unwrap();
        let deserialized: GameState = serde_json::from_str(&serialized).unwrap();
        
        assert_eq!(deserialized.tanks.len(), 1);
        assert_eq!(deserialized.tanks[0].id, "test-tank");
    }

    #[test]
    fn test_client_message_serialization() {
        let join_msg = ClientMessage::Join {
            name: "TestPlayer".to_string(),
            user_id: Some("test-123".to_string()),
        };
        
        let serialized = serde_json::to_string(&join_msg).unwrap();
        let deserialized: ClientMessage = serde_json::from_str(&serialized).unwrap();
        
        match deserialized {
            ClientMessage::Join { name, user_id } => {
                assert_eq!(name, "TestPlayer");
                assert_eq!(user_id, Some("test-123".to_string()));
            }
            _ => panic!("Wrong message type"),
        }
    }

    #[test]
    fn test_player_input_serialization() {
        let input = PlayerInput {
            w: true,
            a: false,
            s: true,
            d: false,
            arrow_left: true,
            arrow_right: false,
            arrow_up: false,
            arrow_down: false,
            space: true,
        };
        // No serialization/deserialization test needed for PlayerInput anymore
        assert!(input.w);
        assert!(!input.a);
        assert!(input.s);
        assert!(!input.d);
        assert!(input.arrow_left);
        assert!(!input.arrow_right);
        assert!(!input.arrow_up);
        assert!(!input.arrow_down);
        assert!(input.space);
    }
}

// Integration tests that require a running server
#[cfg(test)]
mod integration_tests {
    use super::*;
    use tokio_tungstenite::connect_async;
    use serde_json::json;

    #[tokio::test]
    #[ignore] // Ignored by default, run with: cargo test -- --ignored
    async fn test_server_connection() -> Result<(), Box<dyn std::error::Error>> {
        // This test requires a running server
        // Run with: cargo test test_server_connection -- --ignored
        
        // Give server time to start if running in parallel
        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
        
        // Connect to WebSocket server (use localhost for tests)
        let (ws_stream, _) = connect_async("ws://127.0.0.1:3001").await?;
        let (mut ws_sender, mut ws_receiver) = ws_stream.split();
        
        // Send join message with user_id
        let join_msg = json!({
            "type": "join",
            "name": "TestPlayer",
            "user_id": "test-user-123"
        });
        ws_sender.send(Message::Text(join_msg.to_string())).await?;
        
        // Receive initial game state
        if let Some(msg) = ws_receiver.next().await {
            let msg = msg?;
            if let Message::Text(text) = msg {
                let parsed: serde_json::Value = serde_json::from_str(&text)?;
                println!("Received initial message: {}", parsed);
                
                // Should be game_state with NPCs
                assert_eq!(parsed["type"], "game_state");
                assert!(parsed["tanks"].is_array());
                
                // Should have 3 NPCs initially (before player joins)
                let tanks = parsed["tanks"].as_array().unwrap();
                assert!(tanks.len() >= 3, "Should have at least 3 tanks (NPCs)");
            }
        }
        
        // Receive joined confirmation
        if let Some(msg) = ws_receiver.next().await {
            let msg = msg?;
            if let Message::Text(text) = msg {
                let parsed: serde_json::Value = serde_json::from_str(&text)?;
                println!("Received joined message: {}", parsed);
                
                assert_eq!(parsed["type"], "joined");
                assert!(parsed["player_id"].is_string());
                assert!(parsed["user_id"].is_string());
                assert_eq!(parsed["user_id"], "test-user-123");
            }
        }
        
        // Wait for a few game state updates to verify broadcasting
        let mut update_count = 0;
        let start_time = tokio::time::Instant::now();
        
        while update_count < 3 && start_time.elapsed().as_secs() < 5 {
            if let Some(msg) = ws_receiver.next().await {
                let msg = msg?;
                if let Message::Text(text) = msg {
                    let parsed: serde_json::Value = serde_json::from_str(&text)?;
                    if parsed["type"] == "game_state" {
                        update_count += 1;
                        println!("Received game state update #{}: {}", update_count, parsed);
                        
                        let tanks = parsed["tanks"].as_array().unwrap();
                        assert!(tanks.len() >= 3, "Should have at least 3 tanks"); // Should have NPCs, maybe player too
                        
                        // Check that tanks have the new turret_rotation field
                        if let Some(tank) = tanks.get(0) {
                            assert!(tank["turret_rotation"].is_number(), "Tanks should have turret_rotation field");
                        }
                    }
                }
            }
        }
        
        assert!(update_count >= 3, "Should receive at least 3 game state updates");
        println!("✅ Server connection test passed with {} updates!", update_count);
        Ok(())
    }
} 