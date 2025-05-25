#![allow(dead_code)]

use anyhow::Result;
use battletanks_shared::Config;
use tracing::{info, error};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use std::env;

mod server;
mod physics;
mod ecs;
mod game_state;
mod network;
mod state_sync;

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
    let mut config = Config::load().unwrap_or_else(|e| {
        error!("Failed to load config, using defaults: {}", e);
        Config::default()
    });

    // Parse command line arguments
    let args: Vec<String> = env::args().collect();
    for i in 0..args.len() {
        if args[i] == "--port" && i + 1 < args.len() {
            if let Ok(port) = args[i + 1].parse::<u16>() {
                config.server.port = port;
                info!("Using port from command line: {}", port);
            } else {
                error!("Invalid port number: {}", args[i + 1]);
                return Err(anyhow::anyhow!("Invalid port number"));
            }
        }
    }

    info!("Server configuration: {:?}", config.server);
    info!("Game configuration: {:?}", config.game);

    // Create and start the game server
    let mut server = GameServer::from_config(config).await?;
    
    info!("Server starting on {}", server.address());
    
    // Run the server
    if let Err(e) = server.run().await {
        error!("Server error: {}", e);
        return Err(e);
    }

    info!("Server shutdown complete");
    Ok(())
} 