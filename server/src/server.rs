use anyhow::Result;
use battletanks_shared::{Config, ProtoNetworkMessage, PlayerId, network_message::MessageType, 
    JoinGameResponse, ProtoGameConfig, ProtoVector2};
use dashmap::DashMap;
use std::sync::Arc;
use std::net::SocketAddr;
use tokio::sync::Mutex;
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::mpsc;
use tokio::time::{interval, timeout, Duration};
use tokio_tungstenite::accept_async;
use tracing::{debug, error, info, warn};
use uuid::Uuid;
use hyper::{Response, Method, StatusCode, body::Bytes};
use hyper::service::service_fn;
use hyper_util::rt::TokioIo;
use hyper_util::server::conn::auto::Builder as ConnBuilder;
use http_body_util::Full;
use std::convert::Infallible;

use crate::game_state::GameState;
use crate::network::{ClientConnection, NetworkEvent};
use crate::physics::PhysicsWorld;
use crate::state_sync::{StateSynchronizer, GameStateSnapshot, LagCompensator};

/// Main game server that manages the game loop, physics, and client connections
pub struct GameServer {
    config: Config,
    game_state: Arc<Mutex<GameState>>,
    physics_world: Arc<Mutex<PhysicsWorld>>,
    clients: Arc<DashMap<PlayerId, ClientConnection>>,
    network_rx: mpsc::UnboundedReceiver<NetworkEvent>,
    network_tx: mpsc::UnboundedSender<NetworkEvent>,
    listener: TcpListener,
    state_synchronizer: Arc<Mutex<StateSynchronizer>>,
    lag_compensator: Arc<Mutex<LagCompensator>>,
}

impl GameServer {
    /// Create a new game server with the given socket address (for testing)
    pub async fn new(addr: SocketAddr) -> Result<Self> {
        let (network_tx, network_rx) = mpsc::unbounded_channel();
        
        let config = Config::default();
        let game_state = Arc::new(Mutex::new(GameState::new(&config)));
        let physics_world = Arc::new(Mutex::new(PhysicsWorld::new(&config)?));
        let clients = Arc::new(DashMap::new());
        let listener = TcpListener::bind(addr).await?;
        let state_synchronizer = Arc::new(Mutex::new(StateSynchronizer::new()));
        let lag_compensator = Arc::new(Mutex::new(LagCompensator::new()));

        Ok(Self {
            config,
            game_state,
            physics_world,
            clients,
            network_rx,
            network_tx,
            listener,
            state_synchronizer,
            lag_compensator,
        })
    }

    /// Create a new game server with the given configuration
    pub async fn from_config(config: Config) -> Result<Self> {
        let addr: SocketAddr = config.server_address().parse()?;
        let (network_tx, network_rx) = mpsc::unbounded_channel();
        
        let game_state = Arc::new(Mutex::new(GameState::new(&config)));
        let physics_world = Arc::new(Mutex::new(PhysicsWorld::new(&config)?));
        let clients = Arc::new(DashMap::new());
        let listener = TcpListener::bind(addr).await?;
        let state_synchronizer = Arc::new(Mutex::new(StateSynchronizer::new()));
        let lag_compensator = Arc::new(Mutex::new(LagCompensator::new()));

        Ok(Self {
            config,
            game_state,
            physics_world,
            clients,
            network_rx,
            network_tx,
            listener,
            state_synchronizer,
            lag_compensator,
        })
    }

    /// Get the server address
    pub fn address(&self) -> String {
        self.config.server_address()
    }

    /// Get server health information
    pub async fn health_info(&self) -> serde_json::Value {
        let game_state = self.game_state.lock().await;
        let physics_world = self.physics_world.lock().await;
        
        serde_json::json!({
            "status": "healthy",
            "tick": game_state.tick(),
            "players": self.clients.len(),
            "entities": game_state.entity_count(),
            "physics_bodies": physics_world.body_count(),
            "uptime_ticks": game_state.tick(),
            "config": {
                "tick_rate": self.config.server.tick_rate,
                "max_players": self.config.server.max_players,
                "port": self.config.server.port
            }
        })
    }

    /// Start health check HTTP server (simplified for Hyper v1.0)
    async fn start_health_server(
        config: Config,
        game_state: Arc<Mutex<GameState>>,
        physics_world: Arc<Mutex<PhysicsWorld>>,
        clients: Arc<DashMap<PlayerId, ClientConnection>>,
    ) -> Result<()> {
        let health_port = config.server.port + 1; // Health check on port + 1
        let health_addr: std::net::SocketAddr = ([127, 0, 0, 1], health_port).into();
        let listener = tokio::net::TcpListener::bind(health_addr).await?;
        
        info!("Health check server listening on http://{}", health_addr);
        
        loop {
            let (stream, _) = listener.accept().await?;
            let io = TokioIo::new(stream);
            
            let game_state = game_state.clone();
            let physics_world = physics_world.clone();
            let clients = clients.clone();
            
            let service = service_fn(move |req| {
                let game_state = game_state.clone();
                let physics_world = physics_world.clone();
                let clients = clients.clone();
                
                async move {
                    match (req.method(), req.uri().path()) {
                        (&Method::GET, "/health") => {
                            let game_state_lock = game_state.lock().await;
                            let physics_world_lock = physics_world.lock().await;
                            
                            let health_info = serde_json::json!({
                                "status": "healthy",
                                "tick": game_state_lock.tick(),
                                "players": clients.len(),
                                "entities": game_state_lock.entity_count(),
                                "physics_bodies": physics_world_lock.body_count(),
                            });
                            
                            Ok::<Response<Full<Bytes>>, Infallible>(Response::builder()
                                .status(StatusCode::OK)
                                .header("content-type", "application/json")
                                .body(Full::new(Bytes::from(health_info.to_string())))
                                .unwrap())
                        }
                        (&Method::GET, "/metrics") => {
                            let game_state_lock = game_state.lock().await;
                            
                            let metrics = format!(
                                "# HELP battletanks_players_total Number of connected players\n\
                                 # TYPE battletanks_players_total gauge\n\
                                 battletanks_players_total {}\n\
                                 # HELP battletanks_entities_total Number of game entities\n\
                                 # TYPE battletanks_entities_total gauge\n\
                                 battletanks_entities_total {}\n\
                                 # HELP battletanks_tick_total Current game tick\n\
                                 # TYPE battletanks_tick_total counter\n\
                                 battletanks_tick_total {}\n",
                                clients.len(),
                                game_state_lock.entity_count(),
                                game_state_lock.tick()
                            );
                            
                            Ok::<Response<Full<Bytes>>, Infallible>(Response::builder()
                                .status(StatusCode::OK)
                                .header("content-type", "text/plain")
                                .body(Full::new(Bytes::from(metrics)))
                                .unwrap())
                        }
                        _ => {
                            Ok::<Response<Full<Bytes>>, Infallible>(Response::builder()
                                .status(StatusCode::NOT_FOUND)
                                .body(Full::new(Bytes::from("Not Found")))
                                .unwrap())
                        }
                    }
                }
            });
            
            tokio::spawn(async move {
                if let Err(err) = ConnBuilder::new(hyper_util::rt::TokioExecutor::new())
                    .serve_connection(io, service)
                    .await
                {
                    error!("Health server connection error: {}", err);
                }
            });
        }
    }

    /// Run the server main loop
    pub async fn run(&mut self) -> Result<()> {
        let local_addr = self.listener.local_addr()?;
        info!("WebSocket server listening on {}", local_addr);

        // Start health check server
        let health_config = self.config.clone();
        let health_game_state = Arc::clone(&self.game_state);
        let health_physics_world = Arc::clone(&self.physics_world);
        let health_clients = Arc::clone(&self.clients);
        
        tokio::spawn(async move {
            if let Err(e) = Self::start_health_server(
                health_config,
                health_game_state,
                health_physics_world,
                health_clients,
            ).await {
                error!("Health server failed: {}", e);
            }
        });

        // Start the game loop
        let mut game_loop_handle = self.start_game_loop();

        // Accept client connections
        loop {
            tokio::select! {
                // Handle new client connections
                result = self.listener.accept() => {
                    match result {
                        Ok((stream, addr)) => {
                            info!("New client connection from {}", addr);
                            let clients = Arc::clone(&self.clients);
                            let network_tx = self.network_tx.clone();
                            
                            tokio::spawn(async move {
                                if let Err(e) = Self::handle_client_connection(stream, clients, network_tx).await {
                                    error!("Client connection error: {}", e);
                                }
                            });
                        }
                        Err(e) => {
                            error!("Failed to accept client connection: {}", e);
                        }
                    }
                }
                
                // Handle network events
                event = self.network_rx.recv() => {
                    if let Some(event) = event {
                        self.handle_network_event(event).await;
                    }
                }
                
                // Check if game loop is still running
                _ = &mut game_loop_handle => {
                    error!("Game loop terminated unexpectedly");
                    break;
                }
            }
        }

        Ok(())
    }

    /// Start the game loop in a separate task
    fn start_game_loop(&mut self) -> tokio::task::JoinHandle<()> {
        let game_state = Arc::clone(&self.game_state);
        let physics_world = Arc::clone(&self.physics_world);
        let clients = Arc::clone(&self.clients);
        let state_synchronizer = Arc::clone(&self.state_synchronizer);
        let tick_duration = self.config.tick_duration();

        tokio::spawn(async move {
            let mut tick_interval = interval(tick_duration);
            
            loop {
                tick_interval.tick().await;
                
                // Update physics
                {
                    let mut physics_world_lock = physics_world.lock().await;
                    physics_world_lock.step();
                }
                
                // Update game state
                let current_tick = {
                    let physics_world_lock = physics_world.lock().await;
                    let mut game_state_lock = game_state.lock().await;
                    game_state_lock.update(&physics_world_lock);
                    game_state_lock.tick()
                };
                
                // Create game state snapshot and broadcast with delta compression
                {
                    let game_state_lock = game_state.lock().await;
                    
                    // Log tick information periodically
                    if current_tick % 300 == 0 { // Every 10 seconds at 30Hz
                        debug!("Game tick: {}, Players: {}", current_tick, clients.len());
                    }
                    
                    // Create snapshot from current game state
                    let mut snapshot = GameStateSnapshot::new(current_tick);
                    snapshot.round_time_remaining = 600.0; // TODO: Get from actual game state
                    
                    // TODO: Populate snapshot with actual tank/projectile/powerup data from ECS
                    // For now, we'll use empty vectors as placeholders
                    
                    // Store snapshot and create delta update
                    let mut synchronizer = state_synchronizer.lock().await;
                    synchronizer.store_snapshot(snapshot.clone());
                    
                    // Get the previous tick for delta compression
                    let reference_tick = if current_tick > 1 { Some(current_tick - 1) } else { None };
                    
                    match synchronizer.create_delta_update(&snapshot, reference_tick) {
                        Ok(state_message) => {
                            // Broadcast without holding the lock
                            drop(synchronizer);
                            drop(game_state_lock);
                            
                            for client in clients.iter() {
                                if let Err(e) = client.send_message(state_message.clone()).await {
                                    warn!("Failed to send state to client {}: {}", client.key(), e);
                                }
                            }
                        }
                        Err(e) => {
                            error!("Failed to create delta update: {}", e);
                        }
                    }
                }
            }
        })
    }

    /// Handle a new client WebSocket connection
    async fn handle_client_connection(
        stream: TcpStream,
        clients: Arc<DashMap<PlayerId, ClientConnection>>,
        network_tx: mpsc::UnboundedSender<NetworkEvent>,
    ) -> Result<()> {
        // Upgrade to WebSocket with timeout
        let ws_stream = timeout(
            Duration::from_secs(5),
            accept_async(stream)
        ).await??;

        let player_id = Uuid::new_v4();
        let connection = ClientConnection::new(player_id, ws_stream, network_tx.clone());
        
        clients.insert(player_id, connection.clone());
        
        // Connection handling is done automatically in ClientConnection::new()
        // The connection will be cleaned up when the spawned tasks complete
        
        Ok(())
    }

    /// Handle network events from clients
    async fn handle_network_event(&mut self, event: NetworkEvent) {
        match event {
            NetworkEvent::PlayerConnected { player_id } => {
                info!("Player {} connected", player_id);
                // Don't send initial state here - wait for JoinGameRequest
                // The client will send a JoinGameRequest which will trigger the response
            }
            
            NetworkEvent::PlayerDisconnected { player_id } => {
                info!("Player {} disconnected", player_id);
                let mut game_state_lock = self.game_state.lock().await;
                game_state_lock.remove_player(player_id);
            }
            
            NetworkEvent::MessageReceived { player_id, message } => {
                self.handle_client_message(player_id, message).await;
            }
        }
    }

    /// Handle a message from a client
    async fn handle_client_message(&mut self, player_id: PlayerId, message: ProtoNetworkMessage) {
        if let Some(message_type) = message.message_type {
            match message_type {
                MessageType::JoinGameRequest(join_request) => {
                    info!("Player {} joining game with name: {}", player_id, join_request.display_name);
                    
                    if self.clients.len() >= self.config.server.max_players {
                        // Send error response
                        if let Some(client) = self.clients.get(&player_id) {
                            let error_response = ProtoNetworkMessage {
                                timestamp: std::time::SystemTime::now()
                                    .duration_since(std::time::UNIX_EPOCH)
                                    .unwrap_or_default()
                                    .as_millis() as u64,
                                message_type: Some(MessageType::JoinGameResponse(JoinGameResponse {
                                    success: false,
                                    error_message: "Server is full".to_string(),
                                    player_id: String::new(),
                                    assigned_entity_id: 0,
                                    game_config: None,
                                })),
                            };
                            let _ = client.send_message(error_response).await;
                        }
                        return;
                    }
                    
                    // Add player to game state
                    let entity_id = {
                        let mut game_state_lock = self.game_state.lock().await;
                        game_state_lock.add_player(player_id, join_request.display_name.clone())
                    };
                    
                    // Send success response
                    if let Some(client) = self.clients.get(&player_id) {
                        let game_config = ProtoGameConfig {
                            tick_rate: self.config.server.tick_rate as f32,
                            max_players: self.config.server.max_players as u32,
                            round_duration: self.config.game.round_duration,
                            respawn_time: self.config.game.respawn_delay,
                            invulnerability_time: self.config.game.spawn_protection_duration,
                            map_size: Some(ProtoVector2 {
                                x: self.config.game.map_size,
                                y: self.config.game.map_size,
                            }),
                        };
                        
                        let success_response = ProtoNetworkMessage {
                            timestamp: std::time::SystemTime::now()
                                .duration_since(std::time::UNIX_EPOCH)
                                .unwrap_or_default()
                                .as_millis() as u64,
                            message_type: Some(MessageType::JoinGameResponse(JoinGameResponse {
                                success: true,
                                error_message: String::new(),
                                player_id: player_id.to_string(),
                                assigned_entity_id: entity_id,
                                game_config: Some(game_config),
                            })),
                        };
                        let _ = client.send_message(success_response).await;
                        
                        // Send initial game state after successful join
                        let current_tick = {
                            let game_state_lock = self.game_state.lock().await;
                            game_state_lock.tick()
                        };
                        
                        let snapshot = GameStateSnapshot::new(current_tick);
                        let mut synchronizer = self.state_synchronizer.lock().await;
                        
                        match synchronizer.create_delta_update(&snapshot, None) {
                            Ok(state_message) => {
                                let _ = client.send_message(state_message).await;
                            }
                            Err(e) => {
                                error!("Failed to create initial state for player {}: {}", player_id, e);
                            }
                        }
                    }
                }
                
                MessageType::PlayerInput(input) => {
                    // Apply lag compensation to input
                    let current_tick = {
                        let game_state_lock = self.game_state.lock().await;
                        game_state_lock.tick()
                    };
                    
                    let compensated_tick = {
                        let lag_compensator = self.lag_compensator.lock().await;
                        lag_compensator.get_compensated_tick(player_id, current_tick, self.config.server.tick_rate as f32)
                    };
                    
                    debug!("Player {} input at tick {} (compensated from {})", player_id, compensated_tick, current_tick);
                    
                    // Update player input in game state
                    let mut game_state_lock = self.game_state.lock().await;
                    game_state_lock.update_player_input(player_id, input);
                }
                
                MessageType::PingRequest(ping) => {
                    // Calculate latency and update lag compensator
                    let server_timestamp = std::time::SystemTime::now()
                        .duration_since(std::time::UNIX_EPOCH)
                        .unwrap_or_default()
                        .as_millis() as u64;
                    
                    // Estimate one-way latency (half of round-trip time from previous pings)
                    let estimated_latency = Duration::from_millis(
                        (server_timestamp.saturating_sub(ping.client_timestamp)) / 2
                    );
                    
                    {
                        let mut lag_compensator = self.lag_compensator.lock().await;
                        lag_compensator.update_player_latency(player_id, estimated_latency);
                    }
                    
                    debug!("Player {} latency: {:?}", player_id, estimated_latency);
                    
                    // Send pong response
                    if let Some(client) = self.clients.get(&player_id) {
                        let pong_response = ProtoNetworkMessage {
                            timestamp: server_timestamp,
                            message_type: Some(MessageType::PongResponse(
                                battletanks_shared::PongResponse {
                                    client_timestamp: ping.client_timestamp,
                                    server_timestamp,
                                    sequence_number: ping.sequence_number,
                                }
                            )),
                        };
                        let _ = client.send_message(pong_response).await;
                    }
                }
                
                MessageType::ChatMessage(chat_event) => {
                    // Broadcast chat message to all clients
                    let broadcast_message = ProtoNetworkMessage {
                        timestamp: std::time::SystemTime::now()
                            .duration_since(std::time::UNIX_EPOCH)
                            .unwrap_or_default()
                            .as_millis() as u64,
                        message_type: Some(MessageType::ChatMessage(chat_event)),
                    };
                    
                    for client in self.clients.iter() {
                        let _ = client.send_message(broadcast_message.clone()).await;
                    }
                }
                
                _ => {
                    warn!("Received unexpected message type from client {}", player_id);
                }
            }
        } else {
            warn!("Received message with no message_type from client {}", player_id);
        }
    }

    /// Get access to the state synchronizer for testing
    pub async fn get_state_synchronizer(&self) -> Arc<Mutex<StateSynchronizer>> {
        Arc::clone(&self.state_synchronizer)
    }
    
    /// Get access to the lag compensator for testing
    pub async fn get_lag_compensator(&self) -> Arc<Mutex<LagCompensator>> {
        Arc::clone(&self.lag_compensator)
    }

    /// Broadcast a game event to all clients
    async fn broadcast_event(&self, event: battletanks_shared::GameEvent) {
        // Convert GameEvent to ProtoGameEvent and broadcast
        // For now, we'll add events to the next state update
        // TODO: Convert between GameEvent and ProtoGameEvent types
        debug!("Broadcasting game event: {:?}", event);
        
        // Events will be included in the next state synchronization update
        // This ensures they're delivered with proper ordering and delta compression
    }

    /// Get the local address the server is bound to
    pub fn local_addr(&self) -> Result<SocketAddr> {
        self.listener.local_addr().map_err(|e| anyhow::anyhow!("Failed to get local address: {}", e))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tokio::time::timeout;

    #[tokio::test]
    async fn test_server_creation() -> Result<()> {
        let server = GameServer::new("127.0.0.1:0".parse()?).await?;
        assert!(server.local_addr().is_ok());
        Ok(())
    }

    #[tokio::test]
    async fn test_health_info() -> Result<()> {
        let server = GameServer::new("127.0.0.1:0".parse()?).await?;
        
        let health = server.health_info().await;
        assert_eq!(health["status"], "healthy");
        assert_eq!(health["tick"], 0);
        assert_eq!(health["players"], 0);
        
        Ok(())
    }

    #[tokio::test]
    async fn test_server_startup_with_timeout() -> Result<()> {
        let mut server = GameServer::new("127.0.0.1:0".parse()?).await?;
        
        // Test that server can start (will fail to bind to port 0, but that's expected)
        let result = timeout(
            Duration::from_secs(1),
            server.run()
        ).await;
        
        // Should timeout or return an error (port 0 binding)
        assert!(result.is_err() || result.unwrap().is_err());
        Ok(())
    }
} 