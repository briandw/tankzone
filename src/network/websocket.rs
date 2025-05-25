use axum::{
    extract::{ws::{Message, WebSocket}, State, WebSocketUpgrade},
    response::Response,
};
use futures_util::{SinkExt, StreamExt};
use tracing::{error, info, warn};
use uuid::Uuid;

use crate::game::GameServer;
use crate::network::messages::{ClientMessage, ServerMessage, PlayerInput};

pub async fn websocket_handler(
    ws: WebSocketUpgrade,
    State(game_server): State<GameServer>,
) -> Response {
    ws.on_upgrade(|socket| handle_socket(socket, game_server))
}

async fn handle_socket(socket: WebSocket, game_server: GameServer) {
    let (mut sender, mut receiver) = socket.split();
    
    // Generate unique player ID
    let player_id = Uuid::new_v4().to_string();
    info!("Player connected: {}", player_id);
    
    // Add player to the game
    game_server.add_player(player_id.clone()).await;
    
    // Send initial state to the new player
    let initial_state = game_server.get_initial_game_state().await;
    if let Ok(data) = serde_json::to_string(&initial_state) {
        if sender.send(Message::Text(data)).await.is_err() {
            warn!("Failed to send initial state to player {}", player_id);
        }
    }

    // Send player assignment message
    let assignment_msg = ServerMessage::PlayerAssigned {
        player_id: player_id.clone(),
    };
    if let Ok(data) = serde_json::to_string(&assignment_msg) {
        if sender.send(Message::Text(data)).await.is_err() {
            warn!("Failed to send player assignment to player {}", player_id);
        }
    }
    
    // Subscribe to broadcast messages
    let mut broadcast_rx = game_server.broadcaster.subscribe();
    
    // Spawn task to handle broadcast messages
    let sender_task = {
        let player_id = player_id.clone();
        tokio::spawn(async move {
            while let Ok(msg) = broadcast_rx.recv().await {
                let message_data = if msg.is_binary() {
                    match msg.to_binary() {
                        Ok(data) => Message::Binary(data),
                        Err(e) => {
                            error!("Failed to serialize message to binary: {}", e);
                            continue;
                        }
                    }
                } else {
                    match msg.to_json() {
                        Ok(data) => Message::Text(data),
                        Err(e) => {
                            error!("Failed to serialize message to JSON: {}", e);
                            continue;
                        }
                    }
                };
                
                if sender.send(message_data).await.is_err() {
                    info!("Player {} disconnected (sender)", player_id);
                    break;
                }
            }
        })
    };
    
    // Handle incoming messages
    while let Some(msg) = receiver.next().await {
        match msg {
            Ok(Message::Text(text)) => {
                if let Err(e) = handle_text_message(&game_server, &player_id, &text).await {
                    error!("Error handling text message: {}", e);
                }
            }
            Ok(Message::Binary(data)) => {
                if let Err(e) = handle_binary_message(&game_server, &player_id, &data).await {
                    error!("Error handling binary message: {}", e);
                }
            }
            Ok(Message::Close(_)) => {
                info!("Player {} disconnected (close frame)", player_id);
                break;
            }
            Err(e) => {
                error!("WebSocket error for player {}: {}", player_id, e);
                break;
            }
            _ => {} // Ignore other message types
        }
    }
    
    // Clean up when player disconnects
    game_server.remove_player(&player_id).await;
    sender_task.abort();
    info!("Player {} cleanup completed", player_id);
}

async fn handle_text_message(
    game_server: &GameServer,
    player_id: &str,
    text: &str,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let message: ClientMessage = serde_json::from_str(text)?;
    
    match message {
        ClientMessage::PlayerInput { forward, backward, strafe_left, strafe_right, mouse_x, mouse_y } => {
            let input = PlayerInput {
                forward,
                backward,
                strafe_left,
                strafe_right,
                mouse_x,
                mouse_y,
            };
            game_server.handle_player_input(player_id, input).await;
        }
        ClientMessage::FireCommand {} => {
            if let Some(bullet_id) = game_server.handle_fire_command(player_id).await {
                info!("Player {} fired bullet {} via command", player_id, bullet_id);
            }
        }
        ClientMessage::ChatMessage { message } => {
            game_server.handle_chat_message(player_id, message).await;
        }
        // Handle legacy messages during transition period
        ClientMessage::PlayerUpdate { position, rotation, turret_rotation: _ } => {
            // Convert legacy update to input (approximation)
            // This is a temporary bridge during migration
            let input = PlayerInput {
                forward: false, // Can't determine from position update
                backward: false,
                strafe_left: false,
                strafe_right: false,
                mouse_x: rotation[1], // Use tank rotation as mouse approximation
                mouse_y: 0.0,
            };
            game_server.handle_player_input(player_id, input).await;
        }
        ClientMessage::BulletFired { position: _, velocity: _ } => {
            // Legacy bullet firing - use new command system instead
            if let Some(bullet_id) = game_server.handle_fire_command(player_id).await {
                info!("Player {} fired bullet {} via legacy command", player_id, bullet_id);
            }
        }
        ClientMessage::Ping => {
            // Echo back pong
            let pong = ServerMessage::Pong;
            if let Ok(data) = serde_json::to_string(&pong) {
                // Would send here if we had access to sender
            }
        }
        _ => {
            warn!("Unhandled message type from player {}", player_id);
        }
    }
    
    Ok(())
}

async fn handle_binary_message(
    game_server: &GameServer,
    player_id: &str,
    data: &[u8],
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let message: ClientMessage = rmp_serde::from_slice(data)?;
    
    match message {
        ClientMessage::PlayerInput { forward, backward, strafe_left, strafe_right, mouse_x, mouse_y } => {
            let input = PlayerInput {
                forward,
                backward,
                strafe_left,
                strafe_right,
                mouse_x,
                mouse_y,
            };
            game_server.handle_player_input(player_id, input).await;
        }
        ClientMessage::FireCommand {} => {
            if let Some(bullet_id) = game_server.handle_fire_command(player_id).await {
                info!("Player {} fired bullet {} via command", player_id, bullet_id);
            }
        }
        _ => {
            // Handle other binary messages as text messages
            let text = serde_json::to_string(&message)?;
            handle_text_message(game_server, player_id, &text).await?;
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

/// Start the websocket server for testing (public function)
pub async fn start_websocket_server() {
    use axum::{
        routing::{get, get_service},
        Router,
    };
    use std::net::SocketAddr;
    use tower::ServiceBuilder;
    use tower_http::services::ServeDir;
    
    // Create shared game server with game loop for testing
    let game_server = crate::game::GameServer::new().start_game_loop();

    // Build test application with WebSocket route and static file serving
    let app = Router::new()
        .route("/ws", get(crate::network::websocket::websocket_handler))
        .nest_service("/", get_service(ServeDir::new("public")))
        .with_state(game_server)
        .layer(
            ServiceBuilder::new()
                .layer(tower_http::cors::CorsLayer::permissive())
        );

    // Run on test port
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

 