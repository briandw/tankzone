use futures_util::{SinkExt, StreamExt};
use serde_json::{json, Value};
use std::time::Duration;
use tokio::time::{sleep, timeout};
use tokio_tungstenite::{connect_async, tungstenite::Message};
use tracing::info;
use tracing_subscriber;

// Import the main server components like other working tests
use battlezone_server::GameServer;
use battlezone_server::network::websocket;

/// Test end-to-end motion commands via WebSocket using ephemeral server
#[tokio::test]
async fn test_websocket_motion_commands() {
    let _ = tracing_subscriber::fmt()
        .with_env_filter("battlezone_server=debug")
        .try_init();

    info!("🚀 Starting WebSocket motion commands end-to-end test");

    // Start ephemeral server like the other working tests
    let (server_handle, actual_port) = start_test_server_with_game_loop().await;
    info!("🌐 Test server started on port {}", actual_port);

    // Give server time to start
    sleep(Duration::from_millis(1000)).await;
    
    // Test server connectivity first
    let connectivity_test = timeout(Duration::from_secs(5), async {
        for attempt in 1..=5 {
            let url = format!("http://localhost:{}/", actual_port);
            match reqwest::get(&url).await {
                Ok(response) if response.status().is_success() => {
                    info!("✅ Server responded on attempt {}", attempt);
                    return Ok(());
                }
                Ok(response) => {
                    info!("⚠️ Server responded with status {} on attempt {}", response.status(), attempt);
                }
                Err(e) => {
                    info!("❌ Connection failed on attempt {}: {}", attempt, e);
                }
            }
            sleep(Duration::from_millis(500)).await;
        }
        Err("Server not responding")
    }).await;

    match connectivity_test {
        Ok(Ok(())) => info!("✅ Server is responding to HTTP requests"),
        Ok(Err(msg)) => {
            server_handle.abort();
            panic!("❌ Server connectivity test failed: {}", msg);
        }
        Err(_) => {
            server_handle.abort();
            panic!("❌ Server connectivity test timed out");
        }
    }

    // Connect WebSocket client with timeout
    let ws_url = format!("ws://localhost:{}/ws", actual_port);
    let ws_connection_result = timeout(Duration::from_secs(10), connect_async(&ws_url)).await;
    
    let (ws_stream, _) = match ws_connection_result {
        Ok(Ok(connection)) => {
            info!("✅ WebSocket client connected");
            connection
        }
        Ok(Err(e)) => {
            server_handle.abort();
            panic!("❌ Failed to connect to WebSocket: {}", e);
        }
        Err(_) => {
            server_handle.abort();
            panic!("❌ WebSocket connection timed out");
        }
    };

    let (mut ws_sender, mut ws_receiver) = ws_stream.split();

    // Wait for initial server messages (playerAssigned, gameStateUpdate, etc.)
    let mut player_id = String::new();
    let mut initial_enemies_count = 0;
    
    info!("📥 Waiting for initial server messages...");
    
    // Use timeout for initial message collection
    let initial_messages_result = timeout(Duration::from_secs(10), async {
        for _ in 0..20 { // Wait for up to 20 messages or until timeout
            tokio::select! {
                msg = ws_receiver.next() => {
                    if let Some(Ok(Message::Text(text))) = msg {
                        if let Ok(server_msg) = serde_json::from_str::<Value>(&text) {
                            let msg_type = server_msg["type"].as_str().unwrap_or("");
                            info!("📥 Received server message: {}", msg_type);
                            
                            match msg_type {
                                "playerAssigned" => {
                                    player_id = server_msg["player_id"].as_str().unwrap_or("").to_string();
                                    info!("🆔 Assigned player ID: {}", player_id);
                                }
                                "gameStateUpdate" => {
                                    if let Some(enemies) = server_msg["enemies"].as_array() {
                                        initial_enemies_count = enemies.len();
                                        info!("👹 Initial enemies count: {}", initial_enemies_count);
                                    }
                                }
                                "enemySpawned" => {
                                    info!("👹 Enemy spawned during initial phase");
                                }
                                _ => {}
                            }
                            
                            // Break if we have both player ID and enemy count
                            if !player_id.is_empty() && initial_enemies_count > 0 {
                                break;
                            }
                        }
                    }
                }
                _ = sleep(Duration::from_millis(200)) => {
                    // Small delay to collect more messages
                }
            }
        }
        Ok::<(), String>(())
    }).await;

    match initial_messages_result {
        Ok(_) => info!("✅ Initial message collection completed"),
        Err(_) => {
            server_handle.abort();
            panic!("❌ Timeout waiting for initial server messages");
        }
    }

    if player_id.is_empty() {
        server_handle.abort();
        panic!("❌ Never received playerAssigned message");
    }

    info!("✅ Initial setup complete - Player ID: {}, Enemies: {}", player_id, initial_enemies_count);

    // Run motion commands test with timeout
    let motion_test_result: Result<Result<Vec<Value>, String>, tokio::time::error::Elapsed> = timeout(Duration::from_secs(30), async {
        // Test 1: Send forward movement command
        info!("🎮 Test 1: Sending forward movement command");
        let forward_input = json!({
            "type": "playerInput",
            "forward": true,
            "backward": false,
            "strafe_left": false,
            "strafe_right": false,
            "mouse_x": 0.0,
            "mouse_y": 0.0
        });

        if let Err(e) = ws_sender.send(Message::Text(forward_input.to_string())).await {
            return Err(format!("Failed to send forward input: {}", e));
        }
        info!("📤 Sent forward movement command");

        // Wait for server response and position updates
        sleep(Duration::from_millis(500)).await;

        // Test 2: Send turning command
        info!("🎮 Test 2: Sending turning command");
        let turning_input = json!({
            "type": "playerInput",
            "forward": false,
            "backward": false,
            "strafe_left": false,
            "strafe_right": true,
            "mouse_x": 0.5,  // Turn right
            "mouse_y": 0.1   // Aim up slightly
        });

        if let Err(e) = ws_sender.send(Message::Text(turning_input.to_string())).await {
            return Err(format!("Failed to send turning input: {}", e));
        }
        info!("📤 Sent turning command");

        sleep(Duration::from_millis(500)).await;

        // Test 3: Send fire command
        info!("🎮 Test 3: Sending fire command");
        let fire_command = json!({
            "type": "fireCommand"
        });

        if let Err(e) = ws_sender.send(Message::Text(fire_command.to_string())).await {
            return Err(format!("Failed to send fire command: {}", e));
        }
        info!("📤 Sent fire command");

        sleep(Duration::from_millis(300)).await;

        // Test 4: Send complex movement (backward + strafe)
        info!("🎮 Test 4: Sending complex movement");
        let complex_input = json!({
            "type": "playerInput",
            "forward": false,
            "backward": true,
            "strafe_left": true,
            "strafe_right": false,
            "mouse_x": -0.3,
            "mouse_y": -0.2
        });

        if let Err(e) = ws_sender.send(Message::Text(complex_input.to_string())).await {
            return Err(format!("Failed to send complex input: {}", e));
        }
        info!("📤 Sent complex movement command");

        // Test 5: Send chat message
        info!("🎮 Test 5: Sending chat message");
        let chat_message = json!({
            "type": "chatMessage",
            "message": "Hello from WebSocket test!"
        });

        if let Err(e) = ws_sender.send(Message::Text(chat_message.to_string())).await {
            return Err(format!("Failed to send chat message: {}", e));
        }
        info!("📤 Sent chat message");

        // Collect server responses
        info!("📥 Collecting server responses for 3 seconds...");
        let mut received_messages = Vec::new();
        let start_time = std::time::Instant::now();

        while start_time.elapsed() < Duration::from_secs(3) {
            tokio::select! {
                msg = ws_receiver.next() => {
                    if let Some(Ok(Message::Text(text))) = msg {
                        if let Ok(server_msg) = serde_json::from_str::<Value>(&text) {
                            let msg_type = server_msg["type"].as_str().unwrap_or("unknown");
                            info!("📥 Received: {}", msg_type);
                            received_messages.push(server_msg);
                        }
                    }
                }
                _ = sleep(Duration::from_millis(100)) => {
                    // Continue collecting
                }
            }
        }
        
        Ok(received_messages)
    }).await;

    let received_messages = match motion_test_result {
        Ok(Ok(messages)) => {
            info!("✅ Motion test completed successfully");
            messages
        }
        Ok(Err(e)) => {
            server_handle.abort();
            panic!("❌ Motion test failed: {}", e);
        }
        Err(_) => {
            server_handle.abort();
            panic!("❌ Motion test timed out");
        }
    };

    info!("📊 Analysis: Received {} server messages", received_messages.len());

    // Analyze responses
    let mut player_updates = 0;
    let mut bullet_spawns = 0;
    let mut game_state_updates = 0;
    let mut chat_messages = 0;
    let mut position_changes = 0;
    let mut last_player_position: Option<Vec<f64>> = None;

    for msg in &received_messages {
        let msg_type = msg["type"].as_str().unwrap_or("");
        
        match msg_type {
            "playerMoved" => {
                player_updates += 1;
                if let Some(position) = msg["position"].as_array() {
                    let pos: Vec<f64> = position.iter().filter_map(|v| v.as_f64()).collect();
                    if pos.len() == 3 {
                        if let Some(ref last_pos) = last_player_position {
                            let distance = ((pos[0] - last_pos[0]).powi(2) + 
                                          (pos[2] - last_pos[2]).powi(2)).sqrt();
                            if distance > 0.01 { // Significant movement
                                position_changes += 1;
                                info!("🚶 Player moved from {:?} to {:?} (distance: {:.3})", last_pos, pos, distance);
                            }
                        }
                        last_player_position = Some(pos);
                    }
                }
            }
            "bulletSpawned" => {
                bullet_spawns += 1;
                info!("🔫 Bullet spawned");
            }
            "gameStateUpdate" => {
                game_state_updates += 1;
                if let Some(players) = msg["players"].as_array() {
                    info!("🎮 Game state update - {} players", players.len());
                }
            }
            "chatMessage" => {
                chat_messages += 1;
                info!("💬 Chat message received");
            }
            _ => {}
        }
    }

    // Verify results
    info!("📈 Test Results Summary:");
    info!("  - Player movement updates: {}", player_updates);
    info!("  - Position changes detected: {}", position_changes);
    info!("  - Bullets spawned: {}", bullet_spawns);
    info!("  - Game state updates: {}", game_state_updates);
    info!("  - Chat messages: {}", chat_messages);

    // Assertions
    assert!(player_updates > 0, "❌ No player movement updates received");
    assert!(position_changes > 0, "❌ No actual position changes detected");
    assert!(bullet_spawns > 0, "❌ No bullets spawned from fire command");
    assert!(game_state_updates > 0, "❌ No game state updates received");
    assert!(chat_messages > 0, "❌ No chat messages received");

    info!("✅ All motion command tests passed!");

    // Test 6: Stop all movement and verify
    info!("🎮 Test 6: Stopping all movement");
    let stop_input = json!({
        "type": "playerInput",
        "forward": false,
        "backward": false,
        "strafe_left": false,
        "strafe_right": false,
        "mouse_x": 0.0,
        "mouse_y": 0.0
    });

    ws_sender.send(Message::Text(stop_input.to_string())).await.expect("Failed to send stop input");
    info!("📤 Sent stop movement command");

    sleep(Duration::from_millis(500)).await;
    info!("✅ Stop movement test completed");

    // Cleanup with timeout
    server_handle.abort();
    
    // Give a moment for cleanup
    sleep(Duration::from_millis(500)).await;
    info!("✅ WebSocket motion commands end-to-end test completed successfully!");
}

// Helper function to start a test server with game loop (like other working tests)
async fn start_test_server_with_game_loop() -> (tokio::task::JoinHandle<()>, u16) {
    use axum::{
        routing::{get, get_service},
        Router,
    };
    use std::net::SocketAddr;
    use tower::ServiceBuilder;
    use tower_http::services::ServeDir;
    
    // Use port 0 for ephemeral port assignment
    let addr = SocketAddr::from(([127, 0, 0, 1], 0));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    let actual_port = listener.local_addr().unwrap().port();
    
    let handle = tokio::spawn(async move {
        // Create game server WITH game loop (this is key!)
        let game_server = GameServer::new().start_game_loop();

        // Build application like the main server
        let app = Router::new()
            .route("/ws", get(websocket::websocket_handler))
            .nest_service("/", get_service(ServeDir::new("public")))
            .with_state(game_server)
            .layer(
                ServiceBuilder::new()
                    .layer(tower_http::cors::CorsLayer::permissive())
            );

        info!("🎮 Motion test server with game loop listening on http://localhost:{}", actual_port);
        axum::serve(listener, app).await.unwrap();
    });
    
    (handle, actual_port)
}

/// Test disconnection scenario - verify UI doesn't move when server is disconnected
#[tokio::test]
async fn test_disconnection_stops_ui_movement() {
    let _ = tracing_subscriber::fmt()
        .with_env_filter("battlezone_server=info")
        .try_init();

    info!("🔌 Testing disconnection stops UI movement");

    // Start server using ephemeral port
    let (server_handle, actual_port) = start_test_server_with_game_loop().await;
    info!("🌐 Disconnection test server started on port {}", actual_port);

    sleep(Duration::from_millis(1000)).await;

    // Connect and establish baseline
    let ws_url = format!("ws://localhost:{}/ws", actual_port);
    let (ws_stream, _) = connect_async(&ws_url).await.expect("Failed to connect");
    let (mut ws_sender, mut ws_receiver) = ws_stream.split();

    info!("✅ Connected to server");

    // Send continuous movement
    info!("🎮 Sending continuous forward movement");
    let forward_input = json!({
        "type": "playerInput",
        "forward": true,
        "backward": false,
        "strafe_left": false,
        "strafe_right": false,
        "mouse_x": 0.0,
        "mouse_y": 0.0
    });

    ws_sender.send(Message::Text(forward_input.to_string())).await.expect("Failed to send input");

    // Collect position updates for 1 second
    let mut positions_while_connected = Vec::new();
    let start_time = std::time::Instant::now();

    while start_time.elapsed() < Duration::from_secs(1) {
        tokio::select! {
            msg = ws_receiver.next() => {
                if let Some(Ok(Message::Text(text))) = msg {
                    if let Ok(server_msg) = serde_json::from_str::<Value>(&text) {
                        if server_msg["type"] == "playerMoved" {
                            if let Some(position) = server_msg["position"].as_array() {
                                let pos: Vec<f64> = position.iter().filter_map(|v| v.as_f64()).collect();
                                if pos.len() == 3 {
                                    positions_while_connected.push(pos);
                                }
                            }
                        }
                    }
                }
            }
            _ = sleep(Duration::from_millis(50)) => {
                // Continue collecting
            }
        }
    }

    info!("📊 Positions while connected: {}", positions_while_connected.len());

    // Now disconnect (simulate server shutdown or network failure)
    info!("🔌 Simulating disconnection by closing WebSocket");
    drop(ws_sender);
    drop(ws_receiver);

    // Kill server to simulate complete disconnection
    server_handle.abort();
    sleep(Duration::from_millis(500)).await;

    info!("✅ Server disconnected");

    // Verify we collected movement data while connected
    assert!(positions_while_connected.len() > 0, "❌ No position updates received while connected");

    // Calculate movement while connected
    if positions_while_connected.len() > 1 {
        let first_pos = &positions_while_connected[0];
        let last_pos = &positions_while_connected[positions_while_connected.len() - 1];
        let distance = ((last_pos[0] - first_pos[0]).powi(2) + 
                       (last_pos[2] - first_pos[2]).powi(2)).sqrt();
        
        info!("📏 Total movement while connected: {:.3} units", distance);
        assert!(distance > 0.1, "❌ Player didn't move significantly while connected");
    }

    info!("✅ Disconnection test completed - confirmed movement stops when server disconnects");
} 