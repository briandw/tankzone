use bevy::prelude::*;
use bevy::window::WindowResolution;
use serde_json;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::thread;
use futures_util::{SinkExt, StreamExt};
use tokio_tungstenite::{connect_async, tungstenite::Message};
use tokio::sync::mpsc;

// Use shared types
use battlexone_shared::*;

#[derive(Resource)]
struct GameStateResource {
    data: Arc<Mutex<(Vec<Tank>, Vec<Bullet>)>>,
}

#[derive(Resource)]
struct PlayerInfo {
    player_id: Arc<Mutex<Option<String>>>,
    user_id: String,
}

#[derive(Resource)]
struct InputState {
    keys: HashMap<String, bool>,
}

#[derive(Resource)]
struct ConnectionState {
    connected: Arc<Mutex<bool>>,
}

#[derive(Resource)]
struct WebSocketSender {
    sender: Arc<Mutex<Option<mpsc::UnboundedSender<String>>>>,
}

#[derive(Resource)]
struct TankModel {
    scene: Handle<Scene>,
}

#[derive(Component)]
struct TankEntity {
    tank_id: String,
}

#[derive(Component)]
struct TankTurret {
    tank_id: String,
}

#[derive(Component)]
struct BulletEntity {
    bullet_id: String,
}

#[derive(Component)]
struct PlayerIndicator {
    tank_id: String,
}

fn main() {
    App::new()
        .add_plugins(DefaultPlugins.set(WindowPlugin {
            primary_window: Some(Window {
                title: "BattleX One - Native Client".into(),
                resolution: WindowResolution::new(1200.0, 800.0),
                ..default()
            }),
            ..default()
        }))
        .insert_resource(GameStateResource {
            data: Arc::new(Mutex::new((Vec::new(), Vec::new()))),
        })
        .insert_resource(PlayerInfo {
            player_id: Arc::new(Mutex::new(None)),
            user_id: uuid::Uuid::new_v4().to_string(),
        })
        .insert_resource(InputState {
            keys: HashMap::new(),
        })
        .insert_resource(ConnectionState {
            connected: Arc::new(Mutex::new(false)),
        })
        .insert_resource(WebSocketSender {
            sender: Arc::new(Mutex::new(None)),
        })
        .insert_resource(TankModel {
            scene: Handle::default(),
        })
        .add_systems(Startup, setup)
        .add_systems(Update, (
            handle_input,
            send_input,
            update_game_entities,
            update_camera,
        ))
        .run();
}

fn setup(
    mut commands: Commands,
    game_state: Res<GameStateResource>,
    player_info: Res<PlayerInfo>,
    connection_state: Res<ConnectionState>,
    ws_sender: Res<WebSocketSender>,
    asset_server: Res<AssetServer>,
    mut tank_model: ResMut<TankModel>,
) {
    // Try to load tank model (but we'll use fallback shapes)
    tank_model.scene = asset_server.load("tank.glb#Scene0");
    
    // Setup 3D camera positioned for better tank viewing
    commands.spawn(Camera3dBundle {
        transform: Transform::from_xyz(0.0, 80.0, 100.0)
            .looking_at(Vec3::new(0.0, 0.0, 0.0), Vec3::Y),
        ..default()
    });
    
    // Add some lighting
    commands.spawn(DirectionalLightBundle {
        directional_light: DirectionalLight {
            shadows_enabled: true,
            illuminance: 10000.0,
            ..default()
        },
        transform: Transform {
            translation: Vec3::new(0.0, 50.0, 0.0),
            rotation: Quat::from_rotation_x(-std::f32::consts::FRAC_PI_4),
            ..default()
        },
        ..default()
    });
    
    // Ambient light
    commands.insert_resource(AmbientLight {
        color: Color::WHITE,
        brightness: 500.0,
    });
    
    // Start WebSocket connection in background thread
    let game_data = game_state.data.clone();
    let player_id = player_info.player_id.clone();
    let user_id = player_info.user_id.clone();
    let connected = connection_state.connected.clone();
    let sender_resource = ws_sender.sender.clone();
    
    thread::spawn(move || {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            println!("Connecting to WebSocket server...");
            
            match connect_async("ws://127.0.0.1:3001").await {
                Ok((ws_stream, _)) => {
                    println!("Connected to server!");
                    *connected.lock().unwrap() = true;
                    let (mut ws_sender, mut ws_receiver) = ws_stream.split();
                    
                    // Create a channel for sending messages from the main thread
                    let (tx, mut rx) = mpsc::unbounded_channel();
                    *sender_resource.lock().unwrap() = Some(tx);
                    
                    // Send join message
                    let join_msg = ClientMessage::Join {
                        name: "Bevy Player".to_string(),
                        user_id: Some(user_id),
                    };
                    
                    if let Ok(msg_str) = serde_json::to_string(&join_msg) {
                        let _ = ws_sender.send(Message::Text(msg_str)).await;
                    }
                    
                    // Spawn task to handle outgoing messages
                    tokio::spawn(async move {
                        while let Some(message) = rx.recv().await {
                            if ws_sender.send(Message::Text(message)).await.is_err() {
                                break;
                            }
                        }
                    });
                    
                    // Listen for messages from server
                    while let Some(msg) = ws_receiver.next().await {
                        match msg {
                            Ok(Message::Text(text)) => {
                                if let Ok(server_msg) = serde_json::from_str::<ServerMessage>(&text) {
                                    match server_msg {
                                        ServerMessage::Joined { player_id: p_id, user_id: _ } => {
                                            println!("Joined game with player_id: {}", p_id);
                                            *player_id.lock().unwrap() = Some(p_id);
                                        }
                                        ServerMessage::GameState(game_state) => {
                                            let mut data = game_data.lock().unwrap();
                                            *data = (game_state.tanks, game_state.bullets);
                                        }
                                    }
                                }
                            }
                            Ok(Message::Close(_)) => {
                                println!("Server closed connection");
                                *connected.lock().unwrap() = false;
                                break;
                            }
                            Err(e) => {
                                eprintln!("WebSocket error: {}", e);
                                *connected.lock().unwrap() = false;
                                break;
                            }
                            _ => {}
                        }
                    }
                }
                Err(e) => {
                    eprintln!("Failed to connect to server: {}", e);
                }
            }
        });
    });
}

fn handle_input(
    mut input_state: ResMut<InputState>,
    keyboard_input: Res<ButtonInput<KeyCode>>,
) {
    // Update input state
    input_state.keys.insert("KeyW".to_string(), keyboard_input.pressed(KeyCode::KeyW));
    input_state.keys.insert("KeyA".to_string(), keyboard_input.pressed(KeyCode::KeyA));
    input_state.keys.insert("KeyS".to_string(), keyboard_input.pressed(KeyCode::KeyS));
    input_state.keys.insert("KeyD".to_string(), keyboard_input.pressed(KeyCode::KeyD));
    input_state.keys.insert("ArrowLeft".to_string(), keyboard_input.pressed(KeyCode::ArrowLeft));
    input_state.keys.insert("ArrowRight".to_string(), keyboard_input.pressed(KeyCode::ArrowRight));
    input_state.keys.insert("ArrowUp".to_string(), keyboard_input.pressed(KeyCode::ArrowUp));
    input_state.keys.insert("ArrowDown".to_string(), keyboard_input.pressed(KeyCode::ArrowDown));
    input_state.keys.insert("Space".to_string(), keyboard_input.pressed(KeyCode::Space));
}

fn send_input(
    input_state: Res<InputState>,
    ws_sender: Res<WebSocketSender>,
    player_info: Res<PlayerInfo>,
) {
    // Only send input if we're connected and joined
    let player_id = player_info.player_id.lock().unwrap();
    if player_id.is_none() {
        return;
    }
    
    // Check if we have any keys pressed
    let has_input = input_state.keys.values().any(|&pressed| pressed);
    if !has_input {
        return; // Don't send empty input
    }
    
    // Encode input using the shared function
    let input_bitfield = encode_keys(&input_state.keys.iter().map(|(k, v)| (k.as_str(), *v)).collect());
    
    // Send input to server
    if let Some(sender) = ws_sender.sender.lock().unwrap().as_ref() {
        let input_msg = ClientMessage::Input { input: input_bitfield };
        if let Ok(msg_str) = serde_json::to_string(&input_msg) {
            let _ = sender.send(msg_str);
        }
    }
}

fn update_game_entities(
    mut commands: Commands,
    game_state: Res<GameStateResource>,
    player_info: Res<PlayerInfo>,
    mut tank_query: Query<(Entity, &mut Transform, &TankEntity)>,
    mut turret_query: Query<(Entity, &mut Transform, &TankTurret), Without<TankEntity>>,
    mut bullet_query: Query<(Entity, &mut Transform, &BulletEntity), (Without<TankEntity>, Without<TankTurret>)>,
    mut indicator_query: Query<(Entity, &mut Transform, &PlayerIndicator), (Without<TankEntity>, Without<BulletEntity>, Without<TankTurret>)>,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    _tank_model: Res<TankModel>,
) {
    // Get current game state
    let (tanks, bullets) = {
        let data = game_state.data.lock().unwrap();
        data.clone()
    };
    
    if tanks.is_empty() {
        return; // No data yet
    }
    
    let current_player_id = player_info.player_id.lock().unwrap().clone();
    
    // Track which tanks and bullets we've processed
    let mut existing_tanks: HashMap<String, Entity> = HashMap::new();
    let mut existing_turrets: HashMap<String, Entity> = HashMap::new();
    let mut existing_bullets: HashMap<String, Entity> = HashMap::new();
    let mut existing_indicators: HashMap<String, Entity> = HashMap::new();
    
    // Collect existing entities
    for (entity, _transform, tank_entity) in tank_query.iter() {
        existing_tanks.insert(tank_entity.tank_id.clone(), entity);
    }
    for (entity, _transform, turret_entity) in turret_query.iter() {
        existing_turrets.insert(turret_entity.tank_id.clone(), entity);
    }
    for (entity, _transform, bullet_entity) in bullet_query.iter() {
        existing_bullets.insert(bullet_entity.bullet_id.clone(), entity);
    }
    for (entity, _transform, indicator) in indicator_query.iter() {
        existing_indicators.insert(indicator.tank_id.clone(), entity);
    }
    
    // Update or create tanks
    for tank in &tanks {
        let color = if tank.is_player && current_player_id.as_ref() == Some(&tank.id) {
            Color::srgb(0.2, 0.6, 1.0) // Blue for player
        } else if tank.is_player {
            Color::srgb(0.2, 1.0, 0.2) // Green for other players
        } else {
            Color::srgb(1.0, 0.2, 0.2) // Red for NPCs
        };
        
        let tank_transform = Transform::from_xyz(tank.position.x, 0.0, tank.position.y)
            .with_rotation(Quat::from_rotation_y(-tank.rotation))
            .with_scale(Vec3::splat(10.0));
            
        if let Some(entity) = existing_tanks.get(&tank.id) {
            // Update existing tank body
            if let Ok((_, mut transform, _)) = tank_query.get_mut(*entity) {
                *transform = tank_transform;
            }
            
            // Update existing turret rotation
            if let Some(turret_entity) = existing_turrets.get(&tank.id) {
                if let Ok((_, mut turret_transform, _)) = turret_query.get_mut(*turret_entity) {
                    // Invert turret rotation to match inverted tank body
                    turret_transform.rotation = Quat::from_rotation_y(-tank.turret_rotation);
                }
            }
        } else {
            // Create new tank with proper tank shape using primitives
            let tank_body = commands.spawn((
                PbrBundle {
                    mesh: meshes.add(Cuboid::new(6.0, 2.0, 4.0)), // Tank body (longer than wide)
                    material: materials.add(StandardMaterial {
                        base_color: color,
                        metallic: 0.8,
                        perceptual_roughness: 0.3,
                        ..default()
                    }),
                    transform: tank_transform,
                    ..default()
                },
                TankEntity {
                    tank_id: tank.id.clone(),
                },
            )).id();
            
            // Tank turret (smaller box on top) - child of body, so it inherits tank body rotation
            let turret = commands.spawn((
                PbrBundle {
                    mesh: meshes.add(Cuboid::new(3.0, 1.5, 3.0)),
                    material: materials.add(StandardMaterial {
                        base_color: color,
                        metallic: 0.7,
                        perceptual_roughness: 0.4,
                        ..default()
                    }),
                    // Only apply turret_rotation since tank body rotation is inherited from parent
                    transform: Transform::from_xyz(0.0, 1.8, 0.0)
                        .with_rotation(Quat::from_rotation_y(-tank.turret_rotation)),
                    ..default()
                },
                TankTurret {
                    tank_id: tank.id.clone(),
                },
            )).id();
            
            // Tank barrel (cylinder) - child of turret, simple forward positioning
            let barrel = commands.spawn(PbrBundle {
                mesh: meshes.add(Cylinder::new(0.3, 4.0)),
                material: materials.add(StandardMaterial {
                    base_color: Color::srgb(0.4, 0.4, 0.4),
                    metallic: 0.9,
                    perceptual_roughness: 0.2,
                    ..default()
                }),
                // Position forward and rotate cylinder to point horizontally forward
                transform: Transform::from_xyz(2.0, 0.0, 0.0)
                    .with_rotation(Quat::from_rotation_z(std::f32::consts::FRAC_PI_2)),
                ..default()
            }).id();
            
            // Set up parent-child relationships
            commands.entity(tank_body).push_children(&[turret]);
            commands.entity(turret).push_children(&[barrel]);
        }
        
        // Update or create player indicator (smaller sphere above for extra visibility)
        let indicator_transform = Transform::from_xyz(tank.position.x, 6.0, tank.position.y);
        
        if let Some(entity) = existing_indicators.get(&tank.id) {
            // Update existing indicator
            if let Ok((_, mut transform, _)) = indicator_query.get_mut(*entity) {
                *transform = indicator_transform;
            }
        } else {
            // Create new indicator
            commands.spawn((
                PbrBundle {
                    mesh: meshes.add(Sphere::new(0.8)),
                    material: materials.add(StandardMaterial {
                        base_color: color,
                        emissive: LinearRgba::rgb(color.to_srgba().red * 0.5, color.to_srgba().green * 0.5, color.to_srgba().blue * 0.5),
                        ..default()
                    }),
                    transform: indicator_transform,
                    ..default()
                },
                PlayerIndicator {
                    tank_id: tank.id.clone(),
                },
            ));
        }
    }
    
    // Update or create bullets
    for bullet in &bullets {
        let bullet_transform = Transform::from_xyz(bullet.position.x, 1.0, bullet.position.y);
        
        if let Some(entity) = existing_bullets.get(&bullet.id) {
            // Update existing bullet
            if let Ok((_, mut transform, _)) = bullet_query.get_mut(*entity) {
                *transform = bullet_transform;
            }
        } else {
            // Create new bullet
            commands.spawn((
                PbrBundle {
                    mesh: meshes.add(Sphere::new(1.5)), // Larger bullets
                    material: materials.add(StandardMaterial {
                        base_color: Color::srgb(1.0, 1.0, 0.0),
                        emissive: LinearRgba::rgb(1.0, 1.0, 0.0), // Brighter glow
                        ..default()
                    }),
                    transform: bullet_transform,
                    ..default()
                },
                BulletEntity {
                    bullet_id: bullet.id.clone(),
                },
            ));
        }
    }
    
    // Remove tanks that no longer exist
    let current_tank_ids: std::collections::HashSet<String> = tanks.iter().map(|t| t.id.clone()).collect();
    for (entity, _, tank_entity) in tank_query.iter() {
        if !current_tank_ids.contains(&tank_entity.tank_id) {
            commands.entity(entity).despawn_recursive();
        }
    }
    
    // Remove turrets that no longer exist
    for (entity, _, turret_entity) in turret_query.iter() {
        if !current_tank_ids.contains(&turret_entity.tank_id) {
            commands.entity(entity).despawn_recursive();
        }
    }
    
    // Remove indicators that no longer exist
    for (entity, _, indicator) in indicator_query.iter() {
        if !current_tank_ids.contains(&indicator.tank_id) {
            commands.entity(entity).despawn_recursive();
        }
    }
    
    // Remove bullets that no longer exist
    let current_bullet_ids: std::collections::HashSet<String> = bullets.iter().map(|b| b.id.clone()).collect();
    for (entity, _, bullet_entity) in bullet_query.iter() {
        if !current_bullet_ids.contains(&bullet_entity.bullet_id) {
            commands.entity(entity).despawn_recursive();
        }
    }
}

fn update_camera(
    game_state: Res<GameStateResource>,
    player_info: Res<PlayerInfo>,
    mut camera_query: Query<&mut Transform, With<Camera3d>>,
) {
    let (tanks, _) = {
        let data = game_state.data.lock().unwrap();
        data.clone()
    };
    
    if tanks.is_empty() {
        return;
    }
    
    let current_player_id = player_info.player_id.lock().unwrap().clone();
    
    // Find the player's tank
    if let Some(player_id) = current_player_id {
        if let Some(player_tank) = tanks.iter().find(|t| t.id == player_id) {
            // Calculate total rotation (tank body + turret)
            let total_rotation = player_tank.rotation + player_tank.turret_rotation;
            
            // Calculate camera position based on total rotation
            let camera_distance = 150.0;
            let camera_height = 80.0;
            
            // Calculate camera position using trigonometry
            let camera_x = player_tank.position.x - total_rotation.cos() * camera_distance;
            let camera_z = player_tank.position.y - total_rotation.sin() * camera_distance;
            
            // Update camera position to follow player tank
            if let Ok(mut camera_transform) = camera_query.get_single_mut() {
                camera_transform.translation = Vec3::new(
                    camera_x,
                    camera_height,
                    camera_z,
                );
                
                // Look at a point slightly above the tank for a 5-degree upward angle
                let look_at_height = 30.0; // Height of the look-at point above the tank
                camera_transform.look_at(
                    Vec3::new(player_tank.position.x, look_at_height, player_tank.position.y),
                    Vec3::Y,
                );
            }
        }
    }
} 