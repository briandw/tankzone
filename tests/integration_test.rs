use std::time::Duration;
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, AtomicU16, Ordering};
use tokio::time::sleep;
use fantoccini::{ClientBuilder, Locator};
use axum::{
    extract::{ws::WebSocket, WebSocketUpgrade, State},
    response::Response,
    routing::{get, get_service},
    Router,
};

// Import the main server components
use battlezone_server::game::GameServer;
use battlezone_server::network::messages::ClientMessage;
use battlezone_server::network::websocket;

#[tokio::test]
async fn test_end_to_end_browser_connection() {
    // Initialize tracing for the test
    tracing_subscriber::fmt::try_init().ok();

    // Shared state to track connections
    let connection_received = Arc::new(AtomicBool::new(false));
    let server_port = Arc::new(AtomicU16::new(0));
    
    // Start the server in the background with ephemeral port
    let (server_handle, actual_port) = start_test_server_ephemeral(connection_received.clone()).await;
    server_port.store(actual_port, Ordering::SeqCst);
    
    println!("🚀 Test server started on port {}", actual_port);
    
    // Give the server a moment to start
    sleep(Duration::from_millis(500)).await;

    // Test server health
    test_server_health_on_port(actual_port).await;

    // Test frontend with headless browser - this should trigger a backend connection
    test_browser_websocket_connection(actual_port, connection_received.clone()).await;

    // Verify that the backend actually received the connection
    assert!(
        connection_received.load(Ordering::SeqCst),
        "Backend should have received a WebSocket connection from the browser"
    );
    
    println!("✅ End-to-end test passed: Browser successfully connected to backend");

    // Cleanup
    server_handle.abort();
}

async fn start_test_server_ephemeral(
    connection_received: Arc<AtomicBool>
) -> (tokio::task::JoinHandle<()>, u16) {
    use std::net::SocketAddr;
    use tower::ServiceBuilder;
    use tower_http::services::ServeDir;
    
    // Use port 0 for ephemeral port assignment
    let addr = SocketAddr::from(([127, 0, 0, 1], 0));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    let actual_port = listener.local_addr().unwrap().port();
    
    let handle = tokio::spawn(async move {
        // Create game server
        let game_server = GameServer::new();

        // Build application with connection tracking
        let app = Router::new()
            .route("/ws", get(move |ws, state| {
                websocket_handler_with_tracking(ws, state, connection_received)
            }))
            .nest_service("/", get_service(ServeDir::new("public")))
            .with_state(game_server)
            .layer(
                ServiceBuilder::new()
                    .layer(tower_http::cors::CorsLayer::permissive())
            );

        println!("🎮 Test server listening on http://localhost:{}", actual_port);
        axum::serve(listener, app).await.unwrap();
    });
    
    (handle, actual_port)
}

async fn websocket_handler_with_tracking(
    ws: WebSocketUpgrade,
    State(game_server): State<GameServer>,
    connection_received: Arc<AtomicBool>,
) -> Response {
    ws.on_upgrade(move |socket| {
        handle_websocket_with_tracking(socket, game_server, connection_received)
    })
}

async fn handle_websocket_with_tracking(
    socket: WebSocket, 
    game_server: GameServer,
    connection_received: Arc<AtomicBool>
) {
    println!("🔌 WebSocket connection established in test backend!");
    connection_received.store(true, Ordering::SeqCst);
    
    // Handle the connection normally
    websocket::handle_connection(socket, game_server).await;
}

async fn test_server_health_on_port(port: u16) {
    let client = reqwest::Client::new();
    let url = format!("http://localhost:{}/", port);
    
    // Test that the server responds to HTTP requests
    let response = client
        .get(&url)
        .send()
        .await
        .expect("Failed to connect to test server");
    
    assert!(response.status().is_success(), "Server health check failed");
    println!("✅ Server health check passed on port {}", port);
}

async fn test_browser_websocket_connection(port: u16, connection_received: Arc<AtomicBool>) {
    // Setup headless browser
    let mut caps = serde_json::map::Map::new();
    let opts = serde_json::json!({
        "args": [
            "--headless",
            "--no-sandbox", 
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-web-security",
            "--allow-running-insecure-content"
        ]
    });
    caps.insert("goog:chromeOptions".to_string(), opts);

    let client = ClientBuilder::native()
        .capabilities(caps)
        .connect("http://localhost:9515") // ChromeDriver default port
        .await;

    let client = match client {
        Ok(c) => c,
        Err(_) => {
            println!("⚠️  Skipping browser test - ChromeDriver not available");
            println!("   To run browser tests, install ChromeDriver and run: chromedriver --port=9515");
            return;
        }
    };

    let game_url = format!("http://localhost:{}", port);
    println!("🌐 Navigating browser to {}", game_url);

    // Navigate to the game page
    client.goto(&game_url).await.expect("Failed to navigate to game");
    
    // Wait for page to load
    sleep(Duration::from_secs(2)).await;

    // Check that the page title is correct
    let title = client.title().await.expect("Failed to get page title");
    assert!(title.contains("Tank Battle"), "Page title should contain 'Tank Battle'");
    println!("✅ Page loaded successfully: {}", title);

    // Test WebSocket connection with a more robust approach
    let websocket_test_script = format!(r#"
        return new Promise((resolve) => {{
            const wsUrl = 'ws://localhost:{}/ws';
            console.log('Attempting WebSocket connection to:', wsUrl);
            
            const socket = new WebSocket(wsUrl);
            
            socket.onopen = () => {{
                console.log('✅ WebSocket connected successfully');
                
                // Send a test message to make sure the connection is real
                const testMessage = {{
                    type: 'PlayerUpdate',
                    position: [0, 0, 0],
                    rotation: [0, 0, 0],
                    turret_rotation: [0, 0, 0]
                }};
                
                try {{
                    if (typeof MessagePack !== 'undefined') {{
                        const binaryData = MessagePack.encode(testMessage);
                        socket.send(binaryData);
                        console.log('📦 Sent MessagePack test message');
                    }} else {{
                        socket.send(JSON.stringify(testMessage));
                        console.log('📝 Sent JSON test message');
                    }}
                }} catch (e) {{
                    console.log('⚠️ Error sending test message:', e);
                }}
                
                // Wait a bit, then close
                setTimeout(() => {{
                    socket.close();
                    resolve({{ connected: true, error: null }});
                }}, 500);
            }};
            
            socket.onerror = (error) => {{
                console.log('❌ WebSocket connection failed:', error);
                resolve({{ connected: false, error: error.toString() }});
            }};
            
            socket.onclose = (event) => {{
                console.log('🔌 WebSocket closed:', event.code, event.reason);
            }};
            
            // Timeout after 10 seconds
            setTimeout(() => {{
                if (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN) {{
                    socket.close();
                }}
                resolve({{ connected: false, error: 'Connection timeout' }});
            }}, 10000);
        }});
    "#, port);

    println!("🔌 Testing WebSocket connection from browser...");
    
    let result = client.execute(&websocket_test_script, vec![]).await
        .expect("Failed to execute WebSocket test");
    
    let result_obj = result.as_object().expect("Result should be an object");
    let connected = result_obj.get("connected").and_then(|v| v.as_bool()).unwrap_or(false);
    
    if let Some(error) = result_obj.get("error") {
        if !error.is_null() {
            println!("❌ WebSocket error: {}", error);
        }
    }
    
    assert!(connected, "WebSocket connection from browser should succeed");
    println!("✅ Browser WebSocket connection successful");

    // Give the backend a moment to process the connection
    sleep(Duration::from_millis(1000)).await;

    // Check that required libraries are available
    test_frontend_libraries(&client).await;

    // Close the browser
    client.close().await.expect("Failed to close browser");
    println!("✅ Browser test completed successfully");
}

async fn test_frontend_libraries(client: &fantoccini::Client) {
    // Test that the MessagePack library is available (soft check)
    let msgpack_test = r#"
        return typeof MessagePack !== 'undefined' && typeof MessagePack.encode !== 'undefined';
    "#;

    let msgpack_available = client.execute(msgpack_test, vec![]).await
        .expect("Failed to check MessagePack availability")
        .as_bool()
        .unwrap_or(false);

    if msgpack_available {
        println!("✅ MessagePack library available");
    } else {
        println!("⚠️  MessagePack library not available (CDN might be blocked in headless mode)");
        println!("   This is expected in some test environments and doesn't affect WebSocket connectivity");
    }

    // Test that Three.js is loaded
    let threejs_test = r#"
        return typeof THREE !== 'undefined';
    "#;

    let threejs_available = client.execute(threejs_test, vec![]).await
        .expect("Failed to check Three.js availability")
        .as_bool()
        .unwrap_or(false);

    if threejs_available {
        println!("✅ Three.js library available");
    } else {
        println!("⚠️  Three.js library not available (CDN might be blocked in headless mode)");
        println!("   This is expected in some test environments");
    }
}

#[tokio::test]
async fn test_websocket_message_serialization() {
    // Test MessagePack serialization/deserialization
    let player_update = ClientMessage::PlayerUpdate {
        position: [1.0, 2.0, 3.0],
        rotation: [0.0, 1.57, 0.0],
        turret_rotation: [0.0, 0.0, 0.5],
    };

    // Test binary serialization
    let binary_data = player_update.to_binary().expect("Should serialize to binary");
    let decoded = ClientMessage::from_binary(&binary_data).expect("Should deserialize from binary");
    
    match decoded {
        ClientMessage::PlayerUpdate { position, rotation, turret_rotation } => {
            assert_eq!(position, [1.0, 2.0, 3.0]);
            assert_eq!(rotation, [0.0, 1.57, 0.0]);
            assert_eq!(turret_rotation, [0.0, 0.0, 0.5]);
        }
        _ => panic!("Should deserialize to PlayerUpdate"),
    }

    println!("✅ MessagePack serialization test passed");

    // Test JSON serialization for comparison
    let json_data = player_update.to_json().expect("Should serialize to JSON");
    let json_decoded = ClientMessage::from_json(&json_data).expect("Should deserialize from JSON");
    
    // Verify they're equivalent
    match json_decoded {
        ClientMessage::PlayerUpdate { position, rotation, turret_rotation } => {
            assert_eq!(position, [1.0, 2.0, 3.0]);
            assert_eq!(rotation, [0.0, 1.57, 0.0]);
            assert_eq!(turret_rotation, [0.0, 0.0, 0.5]);
        }
        _ => panic!("Should deserialize to PlayerUpdate"),
    }

    // Compare sizes
    println!("📦 MessagePack size: {} bytes", binary_data.len());
    println!("📝 JSON size: {} bytes", json_data.len());
    let savings = ((json_data.len() - binary_data.len()) as f32 / json_data.len() as f32) * 100.0;
    println!("💰 Size savings: {:.1}%", savings);
    
    assert!(binary_data.len() < json_data.len(), "MessagePack should be smaller than JSON");
    println!("✅ MessagePack size optimization confirmed");
} 