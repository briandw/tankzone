use std::time::Duration;
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, AtomicU16, Ordering};
use tokio::time::sleep;
use fantoccini::{ClientBuilder, Locator};
use futures_util::{SinkExt, StreamExt};
use axum::{
    extract::{ws::WebSocket, WebSocketUpgrade, State},
    response::Response,
    routing::{get, get_service},
    Router,
};

// Import the main server components
use battlezone_server::game::GameServer;
use battlezone_server::network::websocket;

#[tokio::test]
async fn test_mouse_controls_and_tank_rotation() {
    // Initialize tracing for the test
    tracing_subscriber::fmt::try_init().ok();

    // Shared state to track connections
    let connection_received = Arc::new(AtomicBool::new(false));
    let server_port = Arc::new(AtomicU16::new(0));
    
    // Start the server in the background with ephemeral port
    let (server_handle, actual_port) = start_test_server_ephemeral(connection_received.clone()).await;
    server_port.store(actual_port, Ordering::SeqCst);
    
    println!("🚀 Mouse control test server started on port {}", actual_port);
    
    // Give the server a moment to start
    sleep(Duration::from_millis(500)).await;

    // Test mouse controls with headless browser
    test_mouse_rotation_controls(actual_port).await;

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

        println!("🎮 Mouse test server listening on http://localhost:{}", actual_port);
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
    println!("🔌 WebSocket connection established in mouse test backend!");
    connection_received.store(true, Ordering::SeqCst);
    
    // Create a basic websocket handler for the test (simplified)
    let (mut sender, mut receiver) = socket.split();
    
    // Send a simple acknowledgment
    let ack = serde_json::json!({"type": "connected"});
    if sender.send(axum::extract::ws::Message::Text(ack.to_string())).await.is_ok() {
        println!("Sent acknowledgment to test client");
    }
    
    // Handle basic message loop for the test
    while let Some(msg) = receiver.next().await {
        match msg {
            Ok(axum::extract::ws::Message::Close(_)) => break,
            Err(_) => break,
            _ => {} // Ignore other messages for the test
        }
    }
    
    println!("Test WebSocket connection closed");
}

async fn test_mouse_rotation_controls(port: u16) {
    // Setup headless browser with mouse support
    let mut caps = serde_json::map::Map::new();
    let opts = serde_json::json!({
        "args": [
            "--headless",
            "--no-sandbox", 
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-web-security",
            "--allow-running-insecure-content",
            "--enable-automation", // Better automation support
            "--no-first-run"
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
            println!("⚠️  Skipping mouse control test - ChromeDriver not available");
            println!("   To run mouse tests, start ChromeDriver: chromedriver --port=9515");
            return;
        }
    };

    let game_url = format!("http://localhost:{}", port);
    println!("🌐 Navigating browser to {}", game_url);

    // Navigate to the game page
    client.goto(&game_url).await.expect("Failed to navigate to game");
    
    // Wait for page to load and Three.js to initialize
    sleep(Duration::from_secs(3)).await;

    // Check that the page title is correct
    let title = client.title().await.expect("Failed to get page title");
    assert!(title.contains("Tank Battle"), "Page title should contain 'Tank Battle'");
    println!("✅ Page loaded successfully: {}", title);

    // Test mouse control setup and rotation
    test_tank_turret_rotation(&client).await;
    test_mouse_movement_simulation(&client).await;
    test_tank_body_vs_turret_rotation(&client).await;

    client.close().await.expect("Failed to close browser");
}

async fn test_tank_turret_rotation(client: &fantoccini::Client) {
    println!("🎯 Testing tank turret rotation controls...");

    // First, enable pointer lock (simulate clicking on the canvas)
    let pointer_lock_script = r#"
        // Click on the canvas to enable pointer lock
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.click();
            console.log('🖱️ Clicked canvas to request pointer lock');
        }
        return !!canvas;
    "#;
    
    let canvas_found: bool = client.execute(pointer_lock_script, vec![])
        .await
        .expect("Failed to execute pointer lock script")
        .as_bool()
        .unwrap_or(false);
    
    assert!(canvas_found, "Canvas element should be present");
    println!("✅ Canvas found and clicked for pointer lock");

    // Wait for pointer lock to be established
    sleep(Duration::from_millis(500)).await;

    // Test initial turret rotation values
    let initial_rotation_script = r#"
        return new Promise((resolve) => {
            // Wait for game to be fully initialized
            setTimeout(() => {
                if (window.game && window.game.turret) {
                    const rotation = {
                        turret_y: window.game.turret.rotation.y,
                        mouse_x: window.game.mouseX,
                        is_pointer_locked: window.game.isPointerLocked
                    };
                    console.log('🎯 Initial turret rotation:', rotation);
                    resolve(rotation);
                } else {
                    console.log('⚠️ Game or turret not initialized yet');
                    resolve({ error: 'Game not initialized' });
                }
            }, 1000);
        });
    "#;

    let initial_state: serde_json::Value = client.execute(initial_rotation_script, vec![])
        .await
        .expect("Failed to get initial rotation");
    
    println!("🎯 Initial tank state: {:?}", initial_state);

    // Test simulated mouse movement and rotation
    let mouse_simulation_script = r#"
        return new Promise((resolve) => {
            let results = [];
            
            // Function to simulate mouse movement
            function simulateMouseMovement(deltaX, deltaY, description) {
                if (window.game) {
                    const beforeMouseX = window.game.mouseX;
                    const beforeTurretY = window.game.turret ? window.game.turret.rotation.y : 0;
                    
                    // Simulate the mouse movement event
                    const event = new MouseEvent('mousemove', {
                        movementX: deltaX,
                        movementY: deltaY,
                        bubbles: true
                    });
                    
                    // Dispatch the event
                    document.dispatchEvent(event);
                    
                    const afterMouseX = window.game.mouseX;
                    const afterTurretY = window.game.turret ? window.game.turret.rotation.y : 0;
                    
                    const result = {
                        description: description,
                        deltaX: deltaX,
                        deltaY: deltaY,
                        beforeMouseX: beforeMouseX,
                        afterMouseX: afterMouseX,
                        beforeTurretY: beforeTurretY,
                        afterTurretY: afterTurretY,
                        mouseDelta: afterMouseX - beforeMouseX,
                        turretDelta: afterTurretY - beforeTurretY,
                        isCorrectDirection: (deltaX > 0 && (afterTurretY > beforeTurretY)) || 
                                          (deltaX < 0 && (afterTurretY < beforeTurretY)) ||
                                          (deltaX === 0)
                    };
                    
                    console.log('🖱️ ' + description + ':', result);
                    results.push(result);
                }
            }
            
            // Test different mouse movements
            simulateMouseMovement(100, 0, "Mouse right (+100)");
            simulateMouseMovement(-100, 0, "Mouse left (-100)");
            simulateMouseMovement(50, 0, "Mouse right (+50)");
            simulateMouseMovement(-150, 0, "Mouse left (-150)");
            simulateMouseMovement(0, 0, "No movement (0)");
            
            resolve(results);
        });
    "#;

    let mouse_results: serde_json::Value = client.execute(mouse_simulation_script, vec![])
        .await
        .expect("Failed to execute mouse simulation");
    
    println!("🖱️ Mouse simulation results: {:#}", mouse_results);

    // Analyze the results
    if let Some(results_array) = mouse_results.as_array() {
        for result in results_array {
            if let Some(description) = result["description"].as_str() {
                let delta_x = result["deltaX"].as_f64().unwrap_or(0.0);
                let is_correct = result["isCorrectDirection"].as_bool().unwrap_or(false);
                
                if delta_x != 0.0 {
                    if is_correct {
                        println!("✅ {}: Mouse control working correctly", description);
                    } else {
                        println!("❌ {}: Mouse control is backwards!", description);
                        println!("   - deltaX: {}", delta_x);
                        println!("   - mouseDelta: {}", result["mouseDelta"].as_f64().unwrap_or(0.0));
                        println!("   - turretDelta: {}", result["turretDelta"].as_f64().unwrap_or(0.0));
                    }
                }
            }
        }
    }
}

async fn test_mouse_movement_simulation(client: &fantoccini::Client) {
    println!("🎮 Testing continuous mouse movement simulation...");

    let continuous_movement_script = r#"
        return new Promise((resolve) => {
            let movements = [];
            let frame = 0;
            
            function recordFrame() {
                if (window.game && window.game.turret && frame < 10) {
                    // Simulate smooth mouse movement (like moving mouse steadily right)
                    const event = new MouseEvent('mousemove', {
                        movementX: 10, // Consistent rightward movement
                        movementY: 0,
                        bubbles: true
                    });
                    document.dispatchEvent(event);
                    
                    movements.push({
                        frame: frame,
                        mouseX: window.game.mouseX,
                        turretY: window.game.turret.rotation.y,
                        expectedDirection: 'right'
                    });
                    
                    frame++;
                    setTimeout(recordFrame, 50); // Record every 50ms
                } else {
                    resolve(movements);
                }
            }
            
            recordFrame();
        });
    "#;

    let movement_data: serde_json::Value = client.execute(continuous_movement_script, vec![])
        .await
        .expect("Failed to execute continuous movement simulation");
    
    println!("🎮 Continuous movement data: {:#}", movement_data);

    // Verify smooth movement progression
    if let Some(movements) = movement_data.as_array() {
        let mut prev_turret_y = None;
        let mut consistent_direction = true;
        
        for movement in movements {
            let turret_y = movement["turretY"].as_f64();
            if let (Some(current), Some(previous)) = (turret_y, prev_turret_y) {
                // For rightward mouse movement, turret should rotate consistently in one direction
                if current <= previous {
                    consistent_direction = false;
                    println!("❌ Inconsistent turret rotation detected at frame {}", movement["frame"]);
                }
            }
            prev_turret_y = turret_y;
        }
        
        if consistent_direction {
            println!("✅ Turret rotation is smooth and consistent");
        } else {
            println!("❌ Turret rotation is inconsistent or backwards");
        }
    }
}

async fn test_tank_body_vs_turret_rotation(client: &fantoccini::Client) {
    println!("🚗 Testing tank body vs turret rotation independence...");

    let body_turret_test_script = r#"
        return new Promise((resolve) => {
            if (!window.game || !window.game.tank || !window.game.turret) {
                resolve({ error: 'Game components not found' });
                return;
            }
            
            // Record initial state
            const initialState = {
                tankBodyY: window.game.tank.rotation.y,
                turretY: window.game.turret.rotation.y,
                mouseX: window.game.mouseX
            };
            
            // Simulate mouse movement (should only affect turret)
            const mouseEvent = new MouseEvent('mousemove', {
                movementX: 200,
                movementY: 0,
                bubbles: true
            });
            document.dispatchEvent(mouseEvent);
            
            // Record state after mouse movement
            const afterMouseState = {
                tankBodyY: window.game.tank.rotation.y,
                turretY: window.game.turret.rotation.y,
                mouseX: window.game.mouseX
            };
            
            // Simulate movement keys (should affect tank body)
            window.game.keys = { 'KeyW': true }; // Forward movement
            
            // Give time for any movement to be processed
            setTimeout(() => {
                const afterMovementState = {
                    tankBodyY: window.game.tank.rotation.y,
                    turretY: window.game.turret.rotation.y,
                    mouseX: window.game.mouseX
                };
                
                // Clear keys
                window.game.keys = {};
                
                const analysis = {
                    initialState,
                    afterMouseState,
                    afterMovementState,
                    turretMovedFromMouse: Math.abs(afterMouseState.turretY - initialState.turretY) > 0.01,
                    tankBodyUnaffectedByMouse: Math.abs(afterMouseState.tankBodyY - initialState.tankBodyY) < 0.01,
                    mouseAffectedTurretCorrectly: (afterMouseState.turretY - initialState.turretY) > 0, // Should be positive for rightward movement
                };
                
                console.log('🔍 Body vs Turret analysis:', analysis);
                resolve(analysis);
            }, 100);
        });
    "#;

    let body_turret_analysis: serde_json::Value = client.execute(body_turret_test_script, vec![])
        .await
        .expect("Failed to execute body vs turret test");
    
    println!("🔍 Tank body vs turret analysis: {:#}", body_turret_analysis);

    // Verify independence
    let turret_moved = body_turret_analysis["turretMovedFromMouse"].as_bool().unwrap_or(false);
    let body_unaffected = body_turret_analysis["tankBodyUnaffectedByMouse"].as_bool().unwrap_or(false);
    let correct_direction = body_turret_analysis["mouseAffectedTurretCorrectly"].as_bool().unwrap_or(false);

    if turret_moved && body_unaffected && correct_direction {
        println!("✅ Tank body and turret rotation work independently and correctly");
    } else {
        println!("❌ Issues detected:");
        if !turret_moved {
            println!("   - Turret did not respond to mouse movement");
        }
        if !body_unaffected {
            println!("   - Tank body was affected by mouse movement (should be independent)");
        }
        if !correct_direction {
            println!("   - Turret rotated in wrong direction");
        }
    }

    // Make assertions for the test
    assert!(turret_moved, "Turret should respond to mouse movement");
    assert!(body_unaffected, "Tank body should not be affected by mouse movement");
    assert!(correct_direction, "Turret should rotate in correct direction for mouse movement");
} 