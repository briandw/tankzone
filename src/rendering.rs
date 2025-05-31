use bevy::prelude::*;
use std::collections::HashMap;
use battlexone_shared::*;
use crate::game_state::{GameStateResource, PlayerInfo};
use crate::tank_model::{TankEntity, TankTurret, spawn_tank, TankModel};

#[derive(Component)]
pub struct BulletEntity {
    pub bullet_id: String,
}

#[derive(Component)]
pub struct PlayerIndicator {
    pub tank_id: String,
}

pub fn setup_rendering(
    mut commands: Commands,
    asset_server: Res<AssetServer>,
    mut tank_model: ResMut<TankModel>,
) {
    // Load tank models
    tank_model.body_scene = asset_server.load("tank_body.glb#Scene0");
    tank_model.turret_scene = asset_server.load("turret.glb#Scene0");
    
    // Setup 3D camera positioned for better tank viewing
    commands.spawn(Camera3dBundle {
        transform: Transform::from_xyz(0.0, 80.0, 100.0)
            .looking_at(Vec3::new(0.0, 0.0, 0.0), Vec3::Y),
        ..default()
    }).insert(Name::new("Main Camera"));
    
    // Add directional lighting
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
    
    // Add ambient lighting
    commands.insert_resource(AmbientLight {
        color: Color::WHITE,
        brightness: 500.0,
    });
}

pub fn update_game_entities(
    mut commands: Commands,
    game_state: Res<GameStateResource>,
    player_info: Res<PlayerInfo>,
    mut tank_query: Query<(Entity, &mut Transform, &TankEntity)>,
    mut turret_query: Query<(Entity, &mut Transform, &TankTurret), Without<TankEntity>>,
    mut bullet_query: Query<(Entity, &mut Transform, &BulletEntity), (Without<TankEntity>, Without<TankTurret>)>,
    mut indicator_query: Query<(Entity, &mut Transform, &PlayerIndicator), (Without<TankEntity>, Without<BulletEntity>, Without<TankTurret>)>,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    tank_model: Res<TankModel>,
) {
    // Get current game state
    let game_data = game_state.get_data();
    let (tanks, bullets) = {
        let data = game_data.lock().unwrap();
        data.clone()
    };
    
    if tanks.is_empty() {
        return; // No data yet
    }
    
    let current_player_id = player_info.get_player_id();
    
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
        
        if let Some(entity) = existing_tanks.get(&tank.id) {
            // Update existing tank body
            if let Ok((_, mut transform, _)) = tank_query.get_mut(*entity) {
                transform.translation = Vec3::new(tank.position.x, 0.0, tank.position.y);
                transform.rotation = Quat::from_rotation_y(-tank.rotation + std::f32::consts::FRAC_PI_2);
            }
            
            // Update existing turret rotation and position
            if let Some(turret_entity) = existing_turrets.get(&tank.id) {
                if let Ok((_, mut turret_transform, _)) = turret_query.get_mut(*turret_entity) {
                    // Update turret position to match body
                    turret_transform.translation = Vec3::new(tank.position.x, 0.0, tank.position.y);
                    // Set turret rotation independently
                    turret_transform.rotation = Quat::from_rotation_y(-tank.turret_rotation + std::f32::consts::FRAC_PI_2);
                }
            }
        } else {
            // Create new tank with 3D model
            let (body, turret) = spawn_tank(
                &mut commands,
                &tank_model,
                Vec3::new(tank.position.x, 0.0, tank.position.y),
                tank.rotation,
                tank.turret_rotation,
                color,
            );
            
            // Store the entities in our tracking maps
            existing_tanks.insert(tank.id.clone(), body);
            existing_turrets.insert(tank.id.clone(), turret);
        }
        
        // Update or create player indicator
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
    
    // Clean up entities that no longer exist
    cleanup_entities(
        &mut commands,
        &tanks,
        &bullets,
        &tank_query.iter().collect::<Vec<_>>(),
        &turret_query.iter().collect::<Vec<_>>(),
        &bullet_query.iter().collect::<Vec<_>>(),
        &indicator_query.iter().collect::<Vec<_>>(),
    );
}

fn cleanup_entities(
    commands: &mut Commands,
    tanks: &[Tank],
    bullets: &[Bullet],
    tank_entities: &[(Entity, &Transform, &TankEntity)],
    turret_entities: &[(Entity, &Transform, &TankTurret)],
    bullet_entities: &[(Entity, &Transform, &BulletEntity)],
    indicator_entities: &[(Entity, &Transform, &PlayerIndicator)],
) {
    // Remove tanks that no longer exist
    let current_tank_ids: std::collections::HashSet<String> = tanks.iter().map(|t| t.id.clone()).collect();
    for (entity, _, tank_entity) in tank_entities {
        if !current_tank_ids.contains(&tank_entity.tank_id) {
            commands.entity(*entity).despawn_recursive();
        }
    }
    
    // Remove turrets that no longer exist
    for (entity, _, turret_entity) in turret_entities {
        if !current_tank_ids.contains(&turret_entity.tank_id) {
            commands.entity(*entity).despawn_recursive();
        }
    }
    
    // Remove indicators that no longer exist
    for (entity, _, indicator) in indicator_entities {
        if !current_tank_ids.contains(&indicator.tank_id) {
            commands.entity(*entity).despawn_recursive();
        }
    }
    
    // Remove bullets that no longer exist
    let current_bullet_ids: std::collections::HashSet<String> = bullets.iter().map(|b| b.id.clone()).collect();
    for (entity, _, bullet_entity) in bullet_entities {
        if !current_bullet_ids.contains(&bullet_entity.bullet_id) {
            commands.entity(*entity).despawn_recursive();
        }
    }
}

pub fn update_camera(
    game_state: Res<GameStateResource>,
    player_info: Res<PlayerInfo>,
    mut camera_query: Query<&mut Transform, With<Camera3d>>,
) {
    let game_data = game_state.get_data();
    let (tanks, _) = {
        let data = game_data.lock().unwrap();
        data.clone()
    };
    
    if tanks.is_empty() {
        return;
    }
    
    let current_player_id = player_info.get_player_id();
    
    // Find the player's tank
    if let Some(player_id) = current_player_id {
        if let Some(player_tank) = tanks.iter().find(|t| t.id == player_id) {
            // Use only the turret's rotation for camera calculations
            let total_rotation = player_tank.turret_rotation;
            
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