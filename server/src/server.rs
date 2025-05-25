use anyhow::Result;
use battletanks_shared::{Config, NetworkMessage, PlayerId};
use dashmap::DashMap;
use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::mpsc;
use tokio::time::{interval, timeout, Duration};
use tokio_tungstenite::accept_async;
use tracing::{debug, error, info, warn};
use uuid::Uuid;
use hyper::{Body, Response, Server, Method, StatusCode};
use hyper::service::{make_service_fn, service_fn};
use std::convert::Infallible;

use crate::game_state::GameState;
use crate::network::{ClientConnection, NetworkEvent};
use crate::physics::PhysicsWorld;

/// Main game server that manages the game loop, physics, and client connections
pub struct GameServer {
    config: Config,
    game_state: Arc<Mutex<GameState>>,
    physics_world: Arc<Mutex<PhysicsWorld>>,
    clients: Arc<DashMap<PlayerId, ClientConnection>>,
    network_rx: mpsc::UnboundedReceiver<NetworkEvent>,
    network_tx: mpsc::UnboundedSender<NetworkEvent>,
}

impl GameServer {
    /// Create a new game server with the given configuration
    pub async fn new(config: Config) -> Result<Self> {
        let (network_tx, network_rx) = mpsc::unbounded_channel();
        
        let game_state = Arc::new(Mutex::new(GameState::new(&config)));
        let physics_world = Arc::new(Mutex::new(PhysicsWorld::new(&config)?));
        let clients = Arc::new(DashMap::new());

        Ok(Self {
            config,
            game_state,
            physics_world,
            clients,
            network_rx,
            network_tx,
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

    /// Start health check HTTP server
    async fn start_health_server(
        config: Config,
        game_state: Arc<Mutex<GameState>>,
        physics_world: Arc<Mutex<PhysicsWorld>>,
        clients: Arc<DashMap<PlayerId, ClientConnection>>,
    ) -> Result<()> {
        let health_port = config.server.port + 1; // Health check on port + 1
        let health_addr = ([127, 0, 0, 1], health_port).into();

        let make_svc = make_service_fn(move |_conn| {
            let game_state = game_state.clone();
            let physics_world = physics_world.clone();
            let clients = Arc::clone(&clients);
            
            async move {
                Ok::<_, Infallible>(service_fn(move |req| {
                    let game_state = game_state.clone();
                    let physics_world = physics_world.clone();
                    let clients = Arc::clone(&clients);
                    
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
                                
                                Ok::<Response<Body>, Infallible>(Response::builder()
                                    .status(StatusCode::OK)
                                    .header("content-type", "application/json")
                                    .body(Body::from(health_info.to_string()))
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
                                
                                Ok::<Response<Body>, Infallible>(Response::builder()
                                    .status(StatusCode::OK)
                                    .header("content-type", "text/plain")
                                    .body(Body::from(metrics))
                                    .unwrap())
                            }
                            _ => {
                                Ok::<Response<Body>, Infallible>(Response::builder()
                                    .status(StatusCode::NOT_FOUND)
                                    .body(Body::from("Not Found"))
                                    .unwrap())
                            }
                        }
                    }
                }))
            }
        });

        let server = Server::bind(&health_addr).serve(make_svc);
        info!("Health check server listening on http://{}", health_addr);
        
        if let Err(e) = server.await {
            error!("Health server error: {}", e);
        }
        
        Ok(())
    }

    /// Run the server main loop
    pub async fn run(&mut self) -> Result<()> {
        // Start the WebSocket listener
        let listener = TcpListener::bind(&self.config.server_address()).await?;
        info!("WebSocket server listening on {}", self.config.server_address());

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
                result = listener.accept() => {
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
                {
                    let physics_world_lock = physics_world.lock().await;
                    let mut game_state_lock = game_state.lock().await;
                    game_state_lock.update(&physics_world_lock);
                }
                
                // Broadcast state to all clients
                {
                    let state_message = {
                        let game_state_lock = game_state.lock().await;
                        let message = game_state_lock.create_state_message();
                        
                        // Log tick information periodically
                        if game_state_lock.tick() % 300 == 0 { // Every 10 seconds at 30Hz
                            debug!("Game tick: {}, Players: {}", game_state_lock.tick(), clients.len());
                        }
                        
                        message
                    };
                    
                    // Broadcast without holding the lock
                    for client in clients.iter() {
                        if let Err(e) = client.send_message(state_message.clone()).await {
                            warn!("Failed to send state to client {}: {}", client.key(), e);
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
        
        // Handle the connection
        if let Err(e) = connection.handle().await {
            warn!("Client {} disconnected: {}", player_id, e);
        }
        
        // Clean up
        clients.remove(&player_id);
        
        // Notify about disconnection
        let _ = network_tx.send(NetworkEvent::PlayerDisconnected { player_id });
        
        Ok(())
    }

    /// Handle network events from clients
    async fn handle_network_event(&mut self, event: NetworkEvent) {
        match event {
            NetworkEvent::PlayerConnected { player_id } => {
                info!("Player {} connected", player_id);
                // Send initial game state to the new player
                if let Some(client) = self.clients.get(&player_id) {
                    let game_state_lock = self.game_state.lock().await;
                    let state_message = game_state_lock.create_state_message();
                    let _ = client.send_message(state_message).await;
                }
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
    async fn handle_client_message(&mut self, player_id: PlayerId, message: NetworkMessage) {
        match message {
            NetworkMessage::JoinGame { player_name } => {
                info!("Player {} joining game with name: {}", player_id, player_name);
                
                if self.clients.len() >= self.config.server.max_players {
                    // Send error message
                    if let Some(client) = self.clients.get(&player_id) {
                        let error_msg = NetworkMessage::Error {
                            message: "Server is full".to_string(),
                        };
                        let _ = client.send_message(error_msg).await;
                    }
                    return;
                }
                
                // Add player to game state
                let entity_id = {
                    let mut game_state_lock = self.game_state.lock().await;
                    game_state_lock.add_player(player_id, player_name)
                };
                
                // Send confirmation
                if let Some(client) = self.clients.get(&player_id) {
                    let confirm_msg = NetworkMessage::JoinConfirmed {
                        player_id,
                        entity_id,
                    };
                    let _ = client.send_message(confirm_msg).await;
                }
            }
            
            NetworkMessage::PlayerInput(input) => {
                // Update player input in game state
                let mut game_state_lock = self.game_state.lock().await;
                game_state_lock.update_player_input(player_id, input);
            }
            
            NetworkMessage::ChatMessage { message } => {
                // Broadcast chat message to all clients
                let chat_event = battletanks_shared::GameEvent::ChatMessage {
                    player_id,
                    message,
                    timestamp: std::time::SystemTime::now()
                        .duration_since(std::time::UNIX_EPOCH)
                        .unwrap_or_default()
                        .as_secs(),
                };
                
                self.broadcast_event(chat_event).await;
            }
            
            _ => {
                warn!("Received unexpected message from client {}: {:?}", player_id, message);
            }
        }
    }

    /// Broadcast game state to all connected clients
    async fn broadcast_game_state(
        game_state: &GameState,
        clients: &Arc<DashMap<PlayerId, ClientConnection>>,
    ) {
        let state_message = game_state.create_state_message();
        
        for client in clients.iter() {
            if let Err(e) = client.send_message(state_message.clone()).await {
                warn!("Failed to send state to client {}: {}", client.key(), e);
            }
        }
    }

    /// Broadcast a game event to all clients
    async fn broadcast_event(&self, event: battletanks_shared::GameEvent) {
        let game_state_lock = self.game_state.lock().await;
        let message = NetworkMessage::GameStateUpdate {
            tick: game_state_lock.tick(),
            entities: vec![], // Only events, no entity updates
            events: vec![event],
        };
        
        for client in self.clients.iter() {
            if let Err(e) = client.send_message(message.clone()).await {
                warn!("Failed to send event to client {}: {}", client.key(), e);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tokio::time::timeout;

    #[tokio::test]
    async fn test_server_creation() -> Result<()> {
        let config = Config::default();
        let server = GameServer::new(config).await?;
        assert_eq!(server.address(), "127.0.0.1:8080");
        Ok(())
    }

    #[tokio::test]
    async fn test_health_info() -> Result<()> {
        let config = Config::default();
        let server = GameServer::new(config).await?;
        
        let health = server.health_info().await;
        assert_eq!(health["status"], "healthy");
        assert_eq!(health["tick"], 0);
        assert_eq!(health["players"], 0);
        
        Ok(())
    }

    #[tokio::test]
    async fn test_server_startup_with_timeout() -> Result<()> {
        let mut config = Config::default();
        config.server.port = 0; // Use any available port
        
        let mut server = GameServer::new(config).await?;
        
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