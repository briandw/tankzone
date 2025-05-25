#![allow(dead_code)]

use anyhow::Result;
use battletanks_shared::Config;
use tracing::{info, error};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod server;
mod physics;
mod ecs;
mod game_state;
mod network;

use server::GameServer;

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize logging
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "battletanks_server=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    info!("Starting Battle Tanks Server");

    // Load configuration
    let config = Config::load().unwrap_or_else(|e| {
        error!("Failed to load config, using defaults: {}", e);
        Config::default()
    });

    info!("Server configuration: {:?}", config.server);
    info!("Game configuration: {:?}", config.game);

    // Create and start the game server
    let mut server = GameServer::new(config).await?;
    
    info!("Server starting on {}", server.address());
    
    // Run the server
    if let Err(e) = server.run().await {
        error!("Server error: {}", e);
        return Err(e);
    }

    info!("Server shutdown complete");
    Ok(())
} 