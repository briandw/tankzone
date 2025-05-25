use std::time::Duration;
use tokio::time::sleep;

// Import the main server components
use battlezone_server::game::GameServer;
use battlezone_server::network::websocket;

#[tokio::test]
async fn test_simple_server_startup() {
    println!("🏥 Testing simple server startup...");
    
    // Test just creating a GameServer
    let game_server = GameServer::new();
    println!("✅ GameServer created successfully");
    
    // Wait a moment to see if any async tasks complete
    sleep(Duration::from_millis(500)).await;
    println!("✅ Simple server test completed");
}

#[tokio::test]
async fn test_health_endpoint_only() {
    use axum::{routing::get, Router};
    use serde_json::json;
    use std::net::SocketAddr;
    
    println!("🌐 Testing health endpoint only...");
    
    // Simple health check handler
    async fn simple_health() -> axum::Json<serde_json::Value> {
        axum::Json(json!({
            "status": "ok",
            "service": "battlezone-server"
        }))
    }
    
    let addr = SocketAddr::from(([127, 0, 0, 1], 0));
    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind to localhost");
    let actual_port = listener.local_addr()
        .expect("Failed to get bound address")
        .port();
    
    let app = Router::new().route("/health", get(simple_health));
    
    let server_handle = tokio::spawn(async move {
        println!("🚀 Simple test server starting on port {}", actual_port);
        if let Err(e) = axum::serve(listener, app).await {
            eprintln!("❌ Simple test server failed: {}", e);
        }
    });
    
    // Give the server time to start
    sleep(Duration::from_millis(1000)).await;
    
    // Test the health endpoint
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(5))
        .build()
        .expect("Failed to create HTTP client");
    
    let url = format!("http://localhost:{}/health", actual_port);
    println!("🌐 Testing simple health endpoint: {}", url);
    
    let response = client.get(&url).send().await
        .expect("Failed to connect to simple test server");
    
    assert!(response.status().is_success(), "Simple health check should pass");
    
    let health_data: serde_json::Value = response.json().await
        .expect("Health response should be valid JSON");
    
    assert_eq!(health_data["status"], "ok");
    assert_eq!(health_data["service"], "battlezone-server");
    
    println!("✅ Simple health endpoint test passed");
    
    // Cleanup
    server_handle.abort();
} 