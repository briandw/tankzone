use std::time::Duration;
use tokio::time::sleep;
use tracing::{info, error};
use tracing_subscriber;

#[tokio::test]
async fn test_basic_connectivity() {
    let _ = tracing_subscriber::fmt()
        .with_env_filter("battlezone_server=info")
        .try_init();

    info!("🌐 Testing basic server connectivity");

    // First, let's try starting our own simple HTTP server to verify the port is free
    let addr = std::net::SocketAddr::from(([127, 0, 0, 1], 3001)); // Different port
    
    match tokio::net::TcpListener::bind(addr).await {
        Ok(_) => {
            info!("✅ Port 3001 is available");
        }
        Err(e) => {
            error!("❌ Port 3001 unavailable: {}", e);
        }
    }

    // Test reqwest client functionality
    let client = reqwest::Client::new();
    
    // Test external HTTP request first
    match client.get("https://httpbin.org/status/200").send().await {
        Ok(response) => {
            info!("✅ External HTTP request works: status={}", response.status());
        }
        Err(e) => {
            error!("❌ External HTTP request failed: {}", e);
        }
    }

    // Test connection to non-existent local server (should fail quickly)
    match client.get("http://localhost:9999/").send().await {
        Ok(response) => {
            info!("🤔 Unexpected success connecting to localhost:9999: {}", response.status());
        }
        Err(e) => {
            info!("✅ Expected failure connecting to localhost:9999: {}", e);
        }
    }

    info!("🏁 Basic connectivity test completed");
}

#[tokio::test]
async fn test_game_server_creation() {
    let _ = tracing_subscriber::fmt()
        .with_env_filter("battlezone_server=info")
        .try_init();

    info!("🎮 Testing GameServer creation");

    // Test that we can create a GameServer without hanging
    let game_server = battlezone_server::GameServer::new();
    info!("✅ GameServer created successfully");

    // Test that we can start the game loop
    let game_server_with_loop = game_server.start_game_loop();
    info!("✅ GameServer with game loop started");

    // Let it run for a brief moment
    sleep(Duration::from_millis(100)).await;
    info!("✅ GameServer ran for 100ms without crashing");

    info!("🏁 GameServer creation test completed");
} 