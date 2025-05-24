use axum::extract::ws::{Message, WebSocket};
use futures_util::{SinkExt, StreamExt};
use tracing::{error, info, warn};
use uuid::Uuid;

use crate::game::GameServer;
use super::messages::{ClientMessage, ServerMessage};

pub async fn handle_connection(socket: WebSocket, game_server: GameServer) {
    let (mut sender, mut receiver) = socket.split();
    
    // Generate player ID
    let player_id = Uuid::new_v4().to_string();
    info!("Player connected: {}", player_id);
    
    // Add player to game
    let player = game_server.add_player(player_id.clone()).await;
    
    // Send initial game state directly to the new player (not broadcast)
    let initial_state = game_server.get_initial_game_state().await;
    if let Ok(state_json) = initial_state.to_json() {
        if sender.send(Message::Text(state_json)).await.is_err() {
            info!("Failed to send initial game state to player {}", player_id);
        }
    }
    
    // Send welcome message with player ID to the new player
    let welcome_msg = ServerMessage::PlayerAssigned {
        player_id: player_id.clone(),
    };
    if let Ok(welcome_json) = welcome_msg.to_json() {
        if sender.send(Message::Text(welcome_json)).await.is_err() {
            info!("Failed to send welcome message to player {}", player_id);
        }
    }
    
    // Subscribe to server broadcasts
    let mut broadcast_rx = game_server.subscribe();
    
    // Spawn task to handle outgoing messages
    let sender_player_id = player_id.clone();
    let sender_task = tokio::spawn(async move {
        while let Ok(server_msg) = broadcast_rx.recv().await {
            let message = if server_msg.is_binary() {
                match server_msg.to_binary() {
                    Ok(data) => Message::Binary(data),
                    Err(e) => {
                        error!("Failed to serialize binary message: {}", e);
                        continue;
                    }
                }
            } else {
                match server_msg.to_json() {
                    Ok(json) => Message::Text(json),
                    Err(e) => {
                        error!("Failed to serialize JSON message: {}", e);
                        continue;
                    }
                }
            };
            
            if sender.send(message).await.is_err() {
                info!("Player {} disconnected (sender)", sender_player_id);
                break;
            }
        }
    });
    
    // Handle incoming messages
    let receiver_player_id = player_id.clone();
    let receiver_game_server = game_server.clone();
    let receiver_task = tokio::spawn(async move {
        while let Some(msg) = receiver.next().await {
            match msg {
                Ok(Message::Binary(data)) => {
                    if let Err(e) = handle_binary_message(&data, &receiver_player_id, &receiver_game_server).await {
                        warn!("Failed to handle binary message from {}: {}", receiver_player_id, e);
                    }
                }
                Ok(Message::Text(text)) => {
                    if let Err(e) = handle_text_message(&text, &receiver_player_id, &receiver_game_server).await {
                        warn!("Failed to handle text message from {}: {}", receiver_player_id, e);
                    }
                }
                Ok(Message::Close(_)) => {
                    info!("Player {} disconnected (close frame)", receiver_player_id);
                    break;
                }
                Ok(Message::Ping(_)) => {
                    // Respond to ping with pong (automatically handled by axum)
                    info!("Received ping from {}", receiver_player_id);
                }
                Ok(Message::Pong(_)) => {
                    // Client responded to our ping
                    info!("Received pong from {}", receiver_player_id);
                }
                Err(e) => {
                    warn!("WebSocket error for player {}: {}", receiver_player_id, e);
                    break;
                }
            }
        }
    });
    
    // Wait for either task to complete (indicating disconnection)
    tokio::select! {
        _ = sender_task => {},
        _ = receiver_task => {},
    }
    
    // Clean up: remove player from game
    game_server.remove_player(&player_id).await;
    info!("Player {} cleanup completed", player_id);
}

async fn handle_binary_message(
    data: &[u8], 
    player_id: &str, 
    game_server: &GameServer
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let client_msg = ClientMessage::from_binary(data)?;
    
    match client_msg {
        ClientMessage::PlayerUpdate { position, rotation, turret_rotation } => {
            game_server.update_player(player_id, position, rotation, turret_rotation).await;
        }
        ClientMessage::BulletFired { position, velocity } => {
            if let Some(bullet_id) = game_server.fire_bullet(player_id, position, velocity).await {
                info!("Player {} fired bullet {}", player_id, bullet_id);
            }
        }
        ClientMessage::BulletHit { bullet_id, target_player_id, damage } => {
            game_server.handle_bullet_hit(bullet_id, &target_player_id, damage).await;
            info!("Bullet {} hit player {} for {} damage", bullet_id, target_player_id, damage);
        }
        // Handle other binary messages
        _ => {
            warn!("Received non-binary message in binary handler: {:?}", client_msg);
        }
    }
    
    Ok(())
}

async fn handle_text_message(
    text: &str, 
    player_id: &str, 
    game_server: &GameServer
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let client_msg = ClientMessage::from_json(text)?;
    
    match client_msg {
        ClientMessage::ChatMessage { message } => {
            game_server.handle_chat_message(player_id, message).await;
        }
        ClientMessage::PlayerUpdate { position, rotation, turret_rotation } => {
            // Handle PlayerUpdate in text handler (temporarily for debugging)
            game_server.update_player(player_id, position, rotation, turret_rotation).await;
        }
        ClientMessage::BulletFired { position, velocity } => {
            if let Some(bullet_id) = game_server.fire_bullet(player_id, position, velocity).await {
                info!("Player {} fired bullet {}", player_id, bullet_id);
            }
        }
        ClientMessage::Ping => {
            // Send pong response
            let pong = ServerMessage::Pong;
            if pong.to_json().is_ok() {
                // Note: This is a simplified example. In practice, you'd need to send this back
                // through the WebSocket sender, which would require more complex message routing.
                info!("Received ping from {}, should send pong", player_id);
            }
        }
        // Handle other text messages or binary messages that were sent as text (shouldn't happen normally)
        _ => {
            warn!("Received unexpected message in text handler: {:?}", client_msg);
        }
    }
    
    Ok(())
}

// Helper function to analyze message sizes (useful for debugging)
pub fn log_message_size_analysis(msg: &ServerMessage) {
    let (binary_size, json_size) = super::messages::message_size_analysis(msg);
    let savings = if json_size > 0 {
        ((json_size - binary_size) as f32 / json_size as f32) * 100.0
    } else {
        0.0
    };
    
    info!(
        "Message size analysis - Binary: {} bytes, JSON: {} bytes, Savings: {:.1}%",
        binary_size, json_size, savings
    );
} 