use anyhow::Result;
use battletanks_shared::{ProtoNetworkMessage, PlayerId, network_message::MessageType};
use futures_util::{SinkExt, StreamExt};
use prost::Message;
use std::collections::HashMap;
use std::sync::Arc;
use std::time::Instant;
use tokio::sync::{mpsc, Mutex};
use tokio::time::{timeout, Duration};
use tokio_tungstenite::{tungstenite::Message as WsMessage, WebSocketStream};
use tracing::{debug, error, warn};

/// Events that can be sent from client connections to the main server
#[derive(Debug)]
pub enum NetworkEvent {
    PlayerConnected { player_id: PlayerId },
    PlayerDisconnected { player_id: PlayerId },
    MessageReceived { player_id: PlayerId, message: ProtoNetworkMessage },
}

/// Rate limiter for client messages (30Hz for input messages)
pub struct RateLimiter {
    max_messages_per_second: u32,
    window_size: Duration,
    message_timestamps: Vec<Instant>,
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
        let now = Instant::now();
        
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

/// Represents a client WebSocket connection with Protocol Buffer support
#[derive(Clone)]
pub struct ClientConnection {
    player_id: PlayerId,
    sender: Arc<Mutex<mpsc::UnboundedSender<ProtoNetworkMessage>>>,
    rate_limiter: Arc<Mutex<RateLimiter>>,
}

impl ClientConnection {
    /// Create a new client connection
    pub fn new(
        player_id: PlayerId,
        ws_stream: WebSocketStream<tokio::net::TcpStream>,
        network_tx: mpsc::UnboundedSender<NetworkEvent>,
    ) -> Self {
        let (message_tx, message_rx) = mpsc::unbounded_channel::<ProtoNetworkMessage>();
        let sender = Arc::new(Mutex::new(message_tx));
        let rate_limiter = Arc::new(Mutex::new(RateLimiter::new(30))); // 30Hz rate limit

        // Split the WebSocket stream
        let (ws_sender, mut ws_receiver) = ws_stream.split();
        let ws_sender = Arc::new(Mutex::new(ws_sender));

        // Spawn task to handle outgoing messages
        let ws_sender_clone = Arc::clone(&ws_sender);
        tokio::spawn(async move {
            let mut message_rx = message_rx;
            while let Some(message) = message_rx.recv().await {
                // Serialize to Protocol Buffer binary format
                let mut buf = Vec::new();
                if let Err(e) = message.encode(&mut buf) {
                    error!("Failed to encode protobuf message for client {}: {}", player_id, e);
                    continue;
                }

                let mut sender = ws_sender_clone.lock().await;
                if let Err(e) = timeout(
                    Duration::from_secs(5),
                    sender.send(WsMessage::Binary(buf))
                ).await {
                    error!("Failed to send message to client {}: {:?}", player_id, e);
                    break;
                }
            }
        });

        // Spawn task to handle incoming messages
        let network_tx_clone = network_tx.clone();
        let rate_limiter_clone = Arc::clone(&rate_limiter);
        let ws_sender_clone = Arc::clone(&ws_sender);
        tokio::spawn(async move {
            // Notify about connection
            let _ = network_tx_clone.send(NetworkEvent::PlayerConnected { player_id });

            while let Some(msg_result) = ws_receiver.next().await {
                match msg_result {
                    Ok(WsMessage::Binary(data)) => {
                        match ProtoNetworkMessage::decode(&data[..]) {
                            Ok(message) => {
                                // Apply rate limiting for input messages
                                let should_process = if let Some(ref msg_type) = message.message_type {
                                    match msg_type {
                                        MessageType::PlayerInput(_) => {
                                            let mut limiter = rate_limiter_clone.lock().await;
                                            limiter.allow_message()
                                        }
                                        _ => true, // Don't rate limit non-input messages
                                    }
                                } else {
                                    true
                                };

                                if should_process {
                                    debug!("Received message from {}: {:?}", player_id, message);
                                    let _ = network_tx_clone.send(NetworkEvent::MessageReceived {
                                        player_id,
                                        message,
                                    });
                                } else {
                                    warn!("Rate limited message from client {}", player_id);
                                }
                            }
                            Err(e) => {
                                warn!("Failed to parse protobuf message from client {}: {}", player_id, e);
                            }
                        }
                    }
                    Ok(WsMessage::Text(text)) => {
                        // For backward compatibility, try to handle JSON messages
                        warn!("Received unexpected text message from client {}: {}", player_id, text);
                    }
                    Ok(WsMessage::Close(_)) => {
                        debug!("Client {} sent close message", player_id);
                        break;
                    }
                    Ok(WsMessage::Ping(data)) => {
                        // Send pong response
                        let mut sender = ws_sender_clone.lock().await;
                        if let Err(e) = timeout(
                            Duration::from_secs(1),
                            sender.send(WsMessage::Pong(data))
                        ).await {
                            error!("Failed to send pong to client {}: {:?}", player_id, e);
                        }
                    }
                    Ok(WsMessage::Pong(_)) => {
                        debug!("Received pong from client {}", player_id);
                    }
                    Ok(_) => {
                        debug!("Received other message type from client {}", player_id);
                    }
                    Err(e) => {
                        warn!("WebSocket error for client {}: {}", player_id, e);
                        break;
                    }
                }
            }

            // Notify about disconnection
            let _ = network_tx_clone.send(NetworkEvent::PlayerDisconnected { player_id });
            debug!("Client {} connection handler ending", player_id);
        });

        Self { player_id, sender, rate_limiter }
    }

    /// Send a message to this client
    pub async fn send_message(&self, message: ProtoNetworkMessage) -> Result<()> {
        let sender = self.sender.lock().await;
        sender.send(message).map_err(|e| anyhow::anyhow!("Failed to send message: {}", e))?;
        Ok(())
    }

    /// Get the player ID for this connection
    pub fn player_id(&self) -> PlayerId {
        self.player_id
    }
}

/// Network manager for handling multiple client connections
pub struct NetworkManager {
    connections: Arc<Mutex<HashMap<PlayerId, ClientConnection>>>,
    network_rx: mpsc::UnboundedReceiver<NetworkEvent>,
    network_tx: mpsc::UnboundedSender<NetworkEvent>,
}

impl NetworkManager {
    pub fn new() -> Self {
        let (network_tx, network_rx) = mpsc::unbounded_channel();
        
        Self {
            connections: Arc::new(Mutex::new(HashMap::new())),
            network_rx,
            network_tx,
        }
    }

    /// Get a sender for network events
    pub fn get_event_sender(&self) -> mpsc::UnboundedSender<NetworkEvent> {
        self.network_tx.clone()
    }

    /// Add a new client connection
    pub async fn add_connection(&self, connection: ClientConnection) {
        let mut connections = self.connections.lock().await;
        connections.insert(connection.player_id(), connection);
    }

    /// Remove a client connection
    pub async fn remove_connection(&self, player_id: PlayerId) {
        let mut connections = self.connections.lock().await;
        connections.remove(&player_id);
    }

    /// Broadcast a message to all connected clients
    pub async fn broadcast_message(&self, message: ProtoNetworkMessage) -> Result<()> {
        let connections = self.connections.lock().await;
        let mut failed_connections = Vec::new();

        for (player_id, connection) in connections.iter() {
            if let Err(e) = connection.send_message(message.clone()).await {
                error!("Failed to send message to client {}: {}", player_id, e);
                failed_connections.push(*player_id);
            }
        }

        // Remove failed connections
        drop(connections);
        for player_id in failed_connections {
            self.remove_connection(player_id).await;
        }

        Ok(())
    }

    /// Send a message to a specific client
    pub async fn send_to_client(&self, player_id: PlayerId, message: ProtoNetworkMessage) -> Result<()> {
        let connections = self.connections.lock().await;
        if let Some(connection) = connections.get(&player_id) {
            connection.send_message(message).await?;
        } else {
            warn!("Attempted to send message to non-existent client: {}", player_id);
        }
        Ok(())
    }

    /// Get the next network event
    pub async fn next_event(&mut self) -> Option<NetworkEvent> {
        self.network_rx.recv().await
    }

    /// Get the number of connected clients
    pub async fn connection_count(&self) -> usize {
        let connections = self.connections.lock().await;
        connections.len()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tokio::time::{sleep, Duration};

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

    #[tokio::test]
    async fn test_rate_limiter_window() {
        let mut limiter = RateLimiter::new(2);
        
        // Allow 2 messages
        assert!(limiter.allow_message());
        assert!(limiter.allow_message());
        
        // Should reject the 3rd
        assert!(!limiter.allow_message());
        
        // Wait for window to reset
        sleep(Duration::from_millis(1100)).await;
        
        // Should allow again
        assert!(limiter.allow_message());
    }

    #[tokio::test]
    async fn test_network_manager_creation() {
        let manager = NetworkManager::new();
        assert_eq!(manager.connection_count().await, 0);
    }

    #[tokio::test]
    async fn test_protobuf_message_encoding() {
        use battletanks_shared::{ProtoPlayerInput, network_message::MessageType};
        
        let input = ProtoPlayerInput {
            forward: true,
            backward: false,
            rotate_left: false,
            rotate_right: true,
            fire: true,
            turret_angle: 45.0,
            timestamp: 12345,
            sequence_number: 1,
        };

        let message = ProtoNetworkMessage {
            timestamp: 12345,
            message_type: Some(MessageType::PlayerInput(input)),
        };

        // Test encoding
        let mut buf = Vec::new();
        assert!(message.encode(&mut buf).is_ok());
        assert!(!buf.is_empty());

        // Test decoding
        let decoded = ProtoNetworkMessage::decode(&buf[..]);
        assert!(decoded.is_ok());
        
        let decoded_message = decoded.unwrap();
        assert_eq!(decoded_message.timestamp, 12345);
        
        if let Some(MessageType::PlayerInput(decoded_input)) = decoded_message.message_type {
            assert_eq!(decoded_input.forward, true);
            assert_eq!(decoded_input.turret_angle, 45.0);
        } else {
            panic!("Expected PlayerInput message type");
        }
    }
} 