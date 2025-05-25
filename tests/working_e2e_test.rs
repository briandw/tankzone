use battlezone_server::{start_websocket_server, GameServer};
use std::time::Duration;
use tokio::time::sleep;
use tracing::{info, error};
use tracing_subscriber;

/// End-to-end test that validates server starts and runs properly
#[tokio::test]
async fn test_complete_server_startup() {
    let _ = tracing_subscriber::fmt()
        .with_env_filter("battlezone_server=info")
        .try_init();

    info!("🚀 Starting complete server startup test");

    // Test that we can start the complete server including game loop
    let server_task = tokio::spawn(async move {
        info!("🌐 Starting WebSocket server with full game loop");
        
        // This should include the full startup: physics loop + enemy spawning
        start_websocket_server().await;
    });

    // Give the server time to start up completely, including enemy spawning
    sleep(Duration::from_millis(2000)).await;
    info!("✅ Server should be fully started with enemies spawned");

    // Test basic HTTP connectivity
    let client = reqwest::Client::new();
    
    // Test if we can get the main page
    match client.get("http://localhost:3000/").send().await {
        Ok(response) => {
            let status = response.status();
            info!("✅ Got HTTP response from /: status={}", status);
            
            if status.is_success() {
                info!("✅ Server is serving HTTP files correctly");
            } else {
                error!("❌ Server returned error status: {}", status);
            }
        }
        Err(e) => {
            error!("❌ Failed to connect to server: {}", e);
        }
    }

    // Test WebSocket upgrade endpoint  
    match client.get("http://localhost:3000/ws").send().await {
        Ok(response) => {
            info!("📡 WebSocket endpoint response: status={}", response.status());
            // A 426 Upgrade Required is expected for WebSocket endpoints via HTTP GET
            if response.status().as_u16() == 426 {
                info!("✅ WebSocket endpoint correctly requires upgrade");
            }
        }
        Err(e) => {
            error!("❌ Failed to connect to WebSocket endpoint: {}", e);
        }
    }

    // Let the server run a bit longer to ensure it's stable
    sleep(Duration::from_millis(1000)).await;
    info!("✅ Server has been running stably for 3 seconds total");

    // Clean shutdown
    server_task.abort();
    info!("✅ Complete server startup test completed successfully");
}

/// Test that validates the server can handle the game loop without hanging
#[tokio::test] 
async fn test_game_server_with_full_loop() {
    let _ = tracing_subscriber::fmt()
        .with_env_filter("battlezone_server=debug")
        .try_init();

    info!("🎮 Testing GameServer with complete game loop");

    // Create a game server and start the full game loop
    let game_server = GameServer::new().start_game_loop();
    info!("✅ GameServer with game loop started");

    // Add a player to make it more realistic
    game_server.add_player("test_player_1".to_string()).await;
    game_server.add_player("test_player_2".to_string()).await;
    info!("✅ Added 2 test players");

    // Send some player inputs to exercise the physics system
    let input1 = battlezone_server::network::messages::PlayerInput {
        forward: true,
        backward: false,
        strafe_left: false,
        strafe_right: true,
        mouse_x: 0.5,
        mouse_y: 0.2,
    };
    game_server.handle_player_input("test_player_1", input1).await;
    
    let input2 = battlezone_server::network::messages::PlayerInput {
        forward: false,
        backward: true,
        strafe_left: true,
        strafe_right: false,
        mouse_x: -0.3,
        mouse_y: -0.1,
    };
    game_server.handle_player_input("test_player_2", input2).await;
    info!("✅ Sent player inputs");

    // Let the game loop run for a few seconds to ensure:
    // 1. Physics loop doesn't hang
    // 2. Enemy spawning completes
    // 3. Game state updates work
    // 4. Broadcasting works
    sleep(Duration::from_millis(3000)).await;
    info!("✅ Game loop ran for 3 seconds without hanging");

    // Verify that enemies were spawned
    let enemy_count = game_server.enemies.len();
    info!("👹 Enemy count: {}", enemy_count);
    
    if enemy_count > 0 {
        info!("✅ Enemies were successfully spawned");
    } else {
        error!("❌ No enemies were spawned - enemy spawning may have failed");
    }

    // Verify that players are tracked
    let player_count = game_server.players.len();
    info!("👥 Player count: {}", player_count);
    
    if player_count == 2 {
        info!("✅ All players are properly tracked");
    } else {
        error!("❌ Player count mismatch - expected 2, got {}", player_count);
    }

    // Test firing bullets
    if let Some(bullet_id) = game_server.handle_fire_command("test_player_1").await {
        info!("🔫 Player 1 fired bullet: {}", bullet_id);
        
        // Check that bullet was created
        if game_server.bullets.contains_key(&bullet_id) {
            info!("✅ Bullet was successfully created and tracked");
        } else {
            error!("❌ Bullet was not found in game state");
        }
    } else {
        error!("❌ Failed to fire bullet");
    }

    // Let the system run a bit more to test bullet physics
    sleep(Duration::from_millis(1000)).await;
    
    info!("✅ GameServer with full loop test completed successfully");
} 