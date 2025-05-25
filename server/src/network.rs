use anyhow::Result;
use battletanks_shared::{NetworkMessage, PlayerId};
use futures_util::{SinkExt, StreamExt};
use std::sync::Arc;
use tokio::sync::{mpsc, Mutex};
use tokio::time::{timeout, Duration};
use tokio_tungstenite::{tungstenite::Message, WebSocketStream};
use tracing::{debug, error, warn};

/// Events that can be sent from client connections to the main server
#[derive(Debug)]
pub enum NetworkEvent {
    PlayerConnected { player_id: PlayerId },
    PlayerDisconnected { player_id: PlayerId },
    MessageReceived { player_id: PlayerId, message: NetworkMessage },
}

/// Represents a client WebSocket connection
#[derive(Clone)]
pub struct ClientConnection {
    player_id: PlayerId,
    sender: Arc<Mutex<mpsc::UnboundedSender<NetworkMessage>>>,
}

impl ClientConnection {
    /// Create a new client connection
    pub fn new(
        player_id: PlayerId,
        ws_stream: WebSocketStream<tokio::net::TcpStream>,
        network_tx: mpsc::UnboundedSender<NetworkEvent>,
    ) -> Self {
        let (message_tx, message_rx) = mpsc::unbounded_channel();
        let sender = Arc::new(Mutex::new(message_tx));

        // Split the WebSocket stream
        let (mut ws_sender, mut ws_receiver) = ws_stream.split();

        // Spawn task to handle outgoing messages
        let _sender_clone = Arc::clone(&sender);
        tokio::spawn(async move {
            let mut message_rx = message_rx;
            while let Some(message) = message_rx.recv().await {
                match serde_json::to_string(&message) {
                    Ok(json) => {
                        if let Err(e) = timeout(
                            Duration::from_secs(5),
                            ws_sender.send(Message::Text(json))
                        ).await {
                            error!("Failed to send message to client {}: {:?}", player_id, e);
                            break;
                        }
                    }
                    Err(e) => {
                        error!("Failed to serialize message for client {}: {}", player_id, e);
                    }
                }
            }
        });

        // Spawn task to handle incoming messages
        let network_tx_clone = network_tx.clone();
        tokio::spawn(async move {
            // Notify about connection
            let _ = network_tx_clone.send(NetworkEvent::PlayerConnected { player_id });

            while let Some(msg_result) = ws_receiver.next().await {
                match msg_result {
                    Ok(Message::Text(text)) => {
                        match serde_json::from_str::<NetworkMessage>(&text) {
                            Ok(message) => {
                                debug!("Received message from {}: {:?}", player_id, message);
                                let _ = network_tx_clone.send(NetworkEvent::MessageReceived {
                                    player_id,
                                    message,
                                });
                            }
                            Err(e) => {
                                warn!("Failed to parse message from client {}: {}", player_id, e);
                            }
                        }
                    }
                    Ok(Message::Close(_)) => {
                        debug!("Client {} sent close message", player_id);
                        break;
                    }
                    Ok(Message::Ping(_data)) => {
                        // Echo pong back (handled automatically by tungstenite)
                        debug!("Received ping from client {}", player_id);
                    }
                    Ok(Message::Pong(_)) => {
                        debug!("Received pong from client {}", player_id);
                    }
                    Ok(Message::Binary(_)) => {
                        warn!("Received unexpected binary message from client {}", player_id);
                    }
                    Ok(_) => {
                        // Handle any other message types
                        debug!("Received other message type from client {}", player_id);
                    }
                    Err(e) => {
                        warn!("WebSocket error for client {}: {}", player_id, e);
                        break;
                    }
                }
            }

            debug!("Client {} connection handler ending", player_id);
        });

        Self { player_id, sender }
    }

    /// Handle the client connection (this method completes when the connection is closed)
    pub async fn handle(&self) -> Result<()> {
        // This is a placeholder - the actual handling is done in the spawned tasks
        // We could add connection monitoring, heartbeat, etc. here
        
        // For now, we'll just wait indefinitely
        // In a real implementation, you might want to:
        // - Send periodic heartbeats
        // - Monitor connection health
        // - Handle reconnection logic
        
        tokio::time::sleep(Duration::from_secs(u64::MAX)).await;
        Ok(())
    }

    /// Send a message to this client
    pub async fn send_message(&self, message: NetworkMessage) -> Result<()> {
        let sender = self.sender.lock().await;
        sender.send(message).map_err(|e| anyhow::anyhow!("Failed to send message: {}", e))?;
        Ok(())
    }

    /// Get the player ID for this connection
    pub fn player_id(&self) -> PlayerId {
        self.player_id
    }
}

/// Rate limiter for client messages
pub struct RateLimiter {
    max_messages_per_second: u32,
    window_size: Duration,
    message_timestamps: Vec<std::time::Instant>,
}

impl RateLimiter {
    pub fn new(max_messages_per_second: u32) -> Self {
        Self {
            max_messages_per_second,
            window_size: Duration::from_secs(1),
            message_timestamps: Vec::new(),
        }
    }

    /// Check if a message should be allowed (rate limiting)
    pub fn allow_message(&mut self) -> bool {
        let now = std::time::Instant::now();
        
        // Remove old timestamps outside the window
        self.message_timestamps.retain(|&timestamp| {
            now.duration_since(timestamp) < self.window_size
        });

        // Check if we're under the limit
        if self.message_timestamps.len() < self.max_messages_per_second as usize {
            self.message_timestamps.push(now);
            true
        } else {
            false
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    

    #[test]
    fn test_rate_limiter() {
        let mut limiter = RateLimiter::new(5); // 5 messages per second

        // Should allow first 5 messages
        for _ in 0..5 {
            assert!(limiter.allow_message());
        }

        // Should reject the 6th message
        assert!(!limiter.allow_message());
    }

    #[test]
    fn test_rate_limiter_window() {
        let mut limiter = RateLimiter::new(2);
        
        // Allow 2 messages
        assert!(limiter.allow_message());
        assert!(limiter.allow_message());
        
        // Should reject the 3rd
        assert!(!limiter.allow_message());
        
        // Simulate time passing (in real test, we'd need to wait or mock time)
        // For now, just test the structure
    }

    #[tokio::test]
    async fn test_network_event_creation() {
        use uuid::Uuid;
        
        let player_id = Uuid::new_v4();
        let event = NetworkEvent::PlayerConnected { player_id };
        
        match event {
            NetworkEvent::PlayerConnected { player_id: id } => {
                assert_eq!(id, player_id);
            }
            _ => panic!("Wrong event type"),
        }
    }
} 