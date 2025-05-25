use battlezone_server::GameServer;
use std::time::Duration;
use tokio::time::sleep;
use tracing::{info, error};
use tracing_subscriber;

#[tokio::test]
async fn test_game_server_creation_only() {
    let _ = tracing_subscriber::fmt()
        .with_env_filter("battlezone_server=info")
        .try_init();

    info!("🎮 Testing GameServer creation (no game loop)");

    // Test that we can create a GameServer without hanging
    let game_server = GameServer::new();
    info!("✅ GameServer created successfully");

    // Test adding a player
    game_server.add_player("test_player".to_string()).await;
    info!("✅ Player added successfully");

    // Test player input
    let input = battlezone_server::network::messages::PlayerInput {
        forward: true,
        backward: false,
        strafe_left: false,
        strafe_right: false,
        mouse_x: 0.5,
        mouse_y: 0.0,
    };
    game_server.handle_player_input("test_player", input).await;
    info!("✅ Player input handled successfully");

    // Test manual enemy spawning (one enemy only)
    info!("🧪 Testing manual single enemy spawn...");
    let enemy_id = uuid::Uuid::new_v4();
    let mut enemy = battlezone_server::game::Enemy::new([10.0, 0.5, 10.0]);
    enemy.id = enemy_id;
    
    // Add enemy to physics world
    {
        let mut physics = game_server.physics_world.lock().await;
        physics.add_enemy(enemy_id, [10.0, 0.5, 10.0]);
    }
    
    game_server.enemies.insert(enemy_id, enemy.clone());
    info!("✅ Single enemy created successfully");

    info!("🏁 GameServer creation test completed without game loop");
}

#[tokio::test]
async fn test_physics_loop_only() {
    let _ = tracing_subscriber::fmt()
        .with_env_filter("battlezone_server=info")
        .try_init();

    info!("⚙️ Testing physics loop with timeout");

    let game_server = GameServer::new();
    info!("✅ GameServer created");

    // Add a player first
    game_server.add_player("test_player".to_string()).await;
    info!("✅ Player added");

    // Test physics loop with a timeout
    let physics_task = {
        let game_server = game_server.clone();
        tokio::spawn(async move {
            info!("🔄 Starting physics loop...");
            
            let mut interval = tokio::time::interval(Duration::from_millis(16));
            for i in 0..10 { // Only run 10 iterations
                interval.tick().await;
                info!("🔄 Physics iteration {}", i + 1);
                
                // Simple physics step
                {
                    let mut physics = game_server.physics_world.lock().await;
                    physics.step();
                }
                
                if i == 9 {
                    info!("✅ Physics loop completed 10 iterations successfully");
                    break;
                }
            }
        })
    };

    // Wait for physics task with timeout
    match tokio::time::timeout(Duration::from_secs(5), physics_task).await {
        Ok(_) => {
            info!("✅ Physics loop test completed successfully");
        }
        Err(_) => {
            error!("❌ Physics loop test timed out");
            panic!("Physics loop hangs");
        }
    }
}

#[tokio::test]
async fn test_enemy_spawning_isolated() {
    let _ = tracing_subscriber::fmt()
        .with_env_filter("battlezone_server=info")
        .try_init();

    info!("👹 Testing isolated enemy spawning");

    let game_server = GameServer::new();
    info!("✅ GameServer created");

    // Test spawning enemies one by one with timeout
    let spawn_task = {
        let game_server = game_server.clone();
        tokio::spawn(async move {
            let positions = [[15.0, 0.5, 20.0], [-20.0, 0.5, 15.0]]; // Only 2 enemies

            for (i, position) in positions.iter().enumerate() {
                info!("👹 Attempting to spawn enemy {} at {:?}", i + 1, position);
                
                let enemy_id = uuid::Uuid::new_v4();
                let mut enemy = battlezone_server::game::Enemy::new(*position);
                enemy.id = enemy_id;
                
                info!("👹 Created enemy object for enemy {}", i + 1);
                
                // Add enemy to physics world
                {
                    info!("👹 Acquiring physics lock for enemy {}", i + 1);
                    let mut physics = game_server.physics_world.lock().await;
                    info!("👹 Got physics lock for enemy {}", i + 1);
                    physics.add_enemy(enemy_id, *position);
                    info!("👹 Added enemy {} to physics world", i + 1);
                }
                
                game_server.enemies.insert(enemy_id, enemy.clone());
                info!("👹 Inserted enemy {} into game state", i + 1);
                
                // Try broadcasting
                let message = battlezone_server::network::messages::ServerMessage::EnemySpawned { enemy };
                let broadcast_result = game_server.broadcaster.send(message);
                info!("👹 Broadcast result for enemy {}: {:?}", i + 1, broadcast_result.is_ok());
                
                info!("✅ Successfully spawned enemy {}", i + 1);
                
                // Small delay
                tokio::time::sleep(Duration::from_millis(100)).await;
            }
            
            info!("✅ All enemies spawned successfully");
        })
    };

    // Wait for spawn task with timeout
    match tokio::time::timeout(Duration::from_secs(10), spawn_task).await {
        Ok(_) => {
            info!("✅ Enemy spawning test completed successfully");
        }
        Err(_) => {
            error!("❌ Enemy spawning test timed out");
            panic!("Enemy spawning hangs");
        }
    }
}

/// Test the exact scenario from start_game_loop - this should reproduce the hang
#[tokio::test]
async fn test_start_game_loop_scenario() {
    let _ = tracing_subscriber::fmt()
        .with_env_filter("battlezone_server=info")
        .try_init();

    info!("🔥 Testing the exact start_game_loop scenario (this should hang)");

    let game_server = GameServer::new();
    info!("✅ GameServer created");

    // Add a player for more realistic conditions
    game_server.add_player("test_player".to_string()).await;
    info!("✅ Player added");

    // Reproduce the exact conditions from start_game_loop
    let test_scenario = {
        let game_server_clone = game_server.clone();
        tokio::spawn(async move {
            // Start the physics game loop task (like in start_game_loop)
            let physics_task = {
                let game_server = game_server_clone.clone();
                tokio::spawn(async move {
                    info!("🔄 Starting continuous physics loop...");
                    let mut interval = tokio::time::interval(Duration::from_millis(16));
                    let mut iteration = 0;
                    
                    loop {
                        interval.tick().await;
                        iteration += 1;
                        
                        if iteration % 30 == 0 { // Log every 30 iterations
                            info!("🔄 Physics iteration {}", iteration);
                        }
                        
                        // Step the physics simulation (like in physics_loop)
                        {
                            let mut physics = game_server.physics_world.lock().await;
                            
                            // Apply player inputs (like in physics_loop)
                            for player_input_ref in game_server.player_inputs.iter() {
                                let player_id = player_input_ref.key().clone();
                                let input = player_input_ref.value().clone();
                                physics.apply_tank_input(&player_id, &input);
                            }
                            
                            physics.step();
                        }
                        
                        // Break after some iterations for testing
                        if iteration > 100 {
                            info!("✅ Physics loop completed 100 iterations");
                            break;
                        }
                    }
                })
            };

            // Small delay then start enemy spawning task (like in start_game_loop)
            tokio::time::sleep(Duration::from_millis(50)).await;
            
            let enemy_spawn_task = {
                let game_server = game_server_clone.clone();
                tokio::spawn(async move {
                    info!("👹 Starting enemy spawning...");
                    
                    // Use the exact spawn_initial_enemies logic
                    let enemy_positions = [
                        [15.0, 0.5, 20.0], [-20.0, 0.5, 15.0], [25.0, 0.5, -10.0]
                    ]; // Only 3 enemies for testing

                    for (i, position) in enemy_positions.iter().enumerate() {
                        let enemy_id = uuid::Uuid::new_v4();
                        let mut enemy = battlezone_server::game::Enemy::new(*position);
                        enemy.id = enemy_id;
                        
                        info!("👹 Spawning enemy {} at position {:?}", i + 1, position);
                        
                        // Add enemy to physics world (this is where the hang likely occurs)
                        {
                            info!("👹 Trying to acquire physics lock for enemy {}", i + 1);
                            let mut physics = game_server.physics_world.lock().await;
                            info!("👹 Got physics lock for enemy {}", i + 1);
                            physics.add_enemy(enemy_id, *position);
                            info!("👹 Added enemy {} to physics world", i + 1);
                        }
                        
                        game_server.enemies.insert(enemy_id, enemy.clone());
                        
                        // Broadcast enemy spawn
                        let _ = game_server.broadcaster.send(
                            battlezone_server::network::messages::ServerMessage::EnemySpawned { enemy }
                        );
                        
                        info!("✅ Spawned enemy {}", i + 1);
                        
                        // Small delay between spawns
                        tokio::time::sleep(Duration::from_millis(100)).await;
                    }
                    
                    info!("✅ Finished spawning all enemies");
                })
            };

            // Wait for both tasks to complete
            let (physics_result, spawn_result) = tokio::join!(physics_task, enemy_spawn_task);
            
            match physics_result {
                Ok(_) => info!("✅ Physics task completed"),
                Err(e) => error!("❌ Physics task failed: {}", e),
            }
            
            match spawn_result {
                Ok(_) => info!("✅ Enemy spawn task completed"),
                Err(e) => error!("❌ Enemy spawn task failed: {}", e),
            }
            
            info!("✅ Both tasks completed successfully");
        })
    };

    // Wait for the test scenario with timeout
    match tokio::time::timeout(Duration::from_secs(30), test_scenario).await {
        Ok(_) => {
            info!("✅ start_game_loop scenario test completed successfully!");
        }
        Err(_) => {
            error!("❌ start_game_loop scenario test timed out - this confirms the hang!");
            panic!("start_game_loop scenario hangs - deadlock confirmed");
        }
    }
} 