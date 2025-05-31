use bevy::prelude::*;
use futures_util::{SinkExt, StreamExt};
use tokio_tungstenite::{connect_async, tungstenite::Message};
use tokio::sync::mpsc;
use std::sync::{Arc, Mutex};
use std::thread;
use serde_json;

use battlexone_shared::*;
use crate::game_state::{GameStateResource, PlayerInfo};

#[derive(Resource)]
pub struct ConnectionState {
    pub connected: Arc<Mutex<bool>>,
}

#[derive(Resource)]
pub struct WebSocketSender {
    pub sender: Arc<Mutex<Option<mpsc::UnboundedSender<String>>>>,
}

pub fn setup_network(
    game_state: Res<GameStateResource>,
    player_info: Res<PlayerInfo>,
    connected: Arc<Mutex<bool>>,
    sender_resource: Arc<Mutex<Option<mpsc::UnboundedSender<String>>>>,
) {
    let game_data = game_state.data.clone();
    let player_id = player_info.player_id.clone();
    let user_id = player_info.user_id.clone();
    
    thread::spawn(move || {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            println!("Connecting to WebSocket server...");
            
            match connect_async("ws://127.0.0.1:3001").await {
                Ok((ws_stream, _)) => {
                    println!("Connected to server!");
                    *connected.lock().unwrap() = true;
                    let (mut ws_sender, mut ws_receiver) = ws_stream.split();
                    
                    // Create a channel for sending messages from the main thread
                    let (tx, mut rx) = mpsc::unbounded_channel();
                    *sender_resource.lock().unwrap() = Some(tx);
                    
                    // Send join message
                    let join_msg = ClientMessage::Join {
                        name: "Bevy Player".to_string(),
                        user_id: Some(user_id),
                    };
                    
                    if let Ok(msg_str) = serde_json::to_string(&join_msg) {
                        let _ = ws_sender.send(Message::Text(msg_str)).await;
                    }
                    
                    // Spawn task to handle outgoing messages
                    tokio::spawn(async move {
                        while let Some(message) = rx.recv().await {
                            if ws_sender.send(Message::Text(message)).await.is_err() {
                                break;
                            }
                        }
                    });
                    
                    // Listen for messages from server
                    while let Some(msg) = ws_receiver.next().await {
                        match msg {
                            Ok(Message::Text(text)) => {
                                if let Ok(server_msg) = serde_json::from_str::<ServerMessage>(&text) {
                                    match server_msg {
                                        ServerMessage::Joined { player_id: p_id, user_id: _ } => {
                                            println!("Joined game with player_id: {}", p_id);
                                            *player_id.lock().unwrap() = Some(p_id);
                                        }
                                        ServerMessage::GameState(state) => {
                                            let mut data = game_data.lock().unwrap();
                                            *data = (state.tanks, state.bullets);
                                        }
                                    }
                                }
                            }
                            Ok(Message::Close(_)) => {
                                println!("Server closed connection");
                                *connected.lock().unwrap() = false;
                                break;
                            }
                            Err(e) => {
                                eprintln!("WebSocket error: {}", e);
                                *connected.lock().unwrap() = false;
                                break;
                            }
                            _ => {}
                        }
                    }
                }
                Err(e) => {
                    eprintln!("Failed to connect to server: {}", e);
                }
            }
        });
    });
} 