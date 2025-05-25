use anyhow::Result;
use battletanks_shared::Config;
use battletanks_server::server::GameServer;
use serde_json::Value;
use std::time::Duration;
use tokio::time::{timeout, sleep};

#[tokio::test]
async fn test_server_health_check_simple() -> Result<()> {
    // Use a unique port to avoid conflicts
    let mut config = Config::default();
    config.server.port = 9000; // Use port 9000 for this test
    
    let mut server = GameServer::from_config(config.clone()).await?;
    
    // Start server in background
    let server_handle = tokio::spawn(async move {
        let _ = server.run().await;
    });
    
    // Wait for server to start
    sleep(Duration::from_millis(1000)).await;
    
    let health_check = async {
        let health_url = format!("http://127.0.0.1:{}/health", config.server.port + 1);
        
        // Test health endpoint
        let client = reqwest::Client::new();
        let response = client.get(&health_url).send().await?;
        
        assert_eq!(response.status(), 200);
        
        let health_data: Value = response.json().await?;
        assert_eq!(health_data["status"], "healthy");
        assert!(health_data["tick"].is_number());
        assert!(health_data["players"].is_number());
        
        Ok::<(), anyhow::Error>(())
    };
    
    // Health check should complete within 10 seconds
    let result = timeout(Duration::from_secs(10), health_check).await;
    
    // Cleanup
    server_handle.abort();
    
    // Check result
    result??;
    
    Ok(())
}

#[tokio::test]
async fn test_server_creation_and_health_info() -> Result<()> {
    let config = Config::default();
    let server = GameServer::from_config(config.clone()).await?;
    
    // Test server creation
    assert_eq!(server.address(), "127.0.0.1:8080");
    
    // Test health info method
    let health = server.health_info().await;
    assert_eq!(health["status"], "healthy");
    assert_eq!(health["tick"], 0);
    assert_eq!(health["players"], 0);
    assert_eq!(health["entities"], 0);
    
    Ok(())
} 