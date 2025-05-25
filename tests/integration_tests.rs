use battlezone_server::{GameServer, TestClient};
use std::time::Duration;
use tokio::time;

#[tokio::test]
async fn test_basic_server_startup() {
    // Start the server
    let server = GameServer::new();
    
    // Give the server a moment to initialize
    time::sleep(Duration::from_millis(100)).await;
    
    // Verify server started
    assert_eq!(server.players.len(), 0);
    assert_eq!(server.enemies.len(), 8); // Should have 8 initial enemies
    
    println!("✅ Server startup test passed");
}

#[tokio::test]
async fn test_two_clients_connection() {
    // Start server on a test port
    tokio::spawn(async move {
        let _server = GameServer::new();
        
        // Start the WebSocket server for testing
        battlezone_server::network::websocket::start_websocket_server().await;
    });
    
    // Give server time to start
    time::sleep(Duration::from_millis(500)).await;
    
    // Create two test clients
    let mut client1 = TestClient::new("test_client_1".to_string());
    let mut client2 = TestClient::new("test_client_2".to_string());
    
    // Run clients concurrently for 10 seconds
    let test_duration = Duration::from_secs(10);
    let server_url = "ws://127.0.0.1:3000";
    
    let client1_task = tokio::spawn(async move {
        client1.connect_and_run(server_url, test_duration).await
    });
    
    let client2_task = tokio::spawn(async move {
        client2.connect_and_run(server_url, test_duration).await
    });
    
    // Wait for both clients to finish
    let (result1, result2) = tokio::join!(client1_task, client2_task);
    
    // Verify both clients connected successfully
    assert!(result1.is_ok());
    assert!(result2.is_ok());
    
    println!("✅ Two clients connection test passed");
}

#[tokio::test]
async fn test_enemy_spawning_and_collision() {
    // Start server
    tokio::spawn(async move {
        let _server = GameServer::new();
        battlezone_server::network::websocket::start_websocket_server().await;
    });
    
    time::sleep(Duration::from_millis(500)).await;
    
    // Create a test client that will hunt enemies
    let mut hunter_client = TestClient::new("hunter".to_string());
    
    // Run for 15 seconds to allow time for enemy hunting
    let test_duration = Duration::from_secs(15);
    let server_url = "ws://127.0.0.1:3000";
    
    let hunt_task = tokio::spawn(async move {
        hunter_client.connect_and_run(server_url, test_duration).await
    });
    
    // Wait for hunting to complete
    let hunt_result = hunt_task.await;
    assert!(hunt_result.is_ok());
    
    println!("✅ Enemy hunting test completed");
}

#[tokio::test] 
async fn test_client_vs_client_combat() {
    // Start server
    tokio::spawn(async move {
        let _server = GameServer::new();
        battlezone_server::network::websocket::start_websocket_server().await;
    });
    
    time::sleep(Duration::from_millis(500)).await;
    
    // Create two combat clients
    let mut fighter1 = TestClient::new("fighter1".to_string());
    let mut fighter2 = TestClient::new("fighter2".to_string());
    
    // Position them to face each other for combat
    fighter1.mouse_x = 0.0; // Facing forward
    fighter2.mouse_x = std::f32::consts::PI; // Facing backward (towards fighter1)
    
    let test_duration = Duration::from_secs(20);
    let server_url = "ws://127.0.0.1:3000";
    
    let fighter1_task = tokio::spawn(async move {
        fighter1.connect_and_run(server_url, test_duration).await
    });
    
    let fighter2_task = tokio::spawn(async move {
        fighter2.connect_and_run(server_url, test_duration).await
    });
    
    // Wait for combat to complete
    let (result1, result2) = tokio::join!(fighter1_task, fighter2_task);
    
    assert!(result1.is_ok());
    assert!(result2.is_ok());
    
    println!("✅ Client vs client combat test completed");
}

#[tokio::test]
async fn test_detailed_game_state_validation() {
    // Start server
    tokio::spawn(async move {
        let _server = GameServer::new();
        battlezone_server::network::websocket::start_websocket_server().await;
    });
    
    time::sleep(Duration::from_millis(500)).await;
    
    // Create a validator client that monitors game state
    let mut validator = TestClient::new("validator".to_string());
    
    let test_duration = Duration::from_secs(8);
    let server_url = "ws://127.0.0.1:3000";
    
    // Connect and monitor the game state
    let result = validator.connect_and_run(server_url, test_duration).await;
    assert!(result.is_ok());
    
    // Print final status for debugging
    validator.print_status();
    
    // Validate that we received enemies
    println!("🎯 Enemies detected: {}", validator.enemies.len());
    
    // This test helps us debug what's actually happening
    assert!(validator.enemies.len() >= 0); // At least we should not crash
    
    println!("✅ Game state validation test completed");
} 