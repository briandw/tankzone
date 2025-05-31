use bevy::prelude::*;

#[derive(Component)]
pub struct TankEntity {
    pub tank_id: String,
}

#[derive(Component)]
pub struct TankTurret {
    pub tank_id: String,
}

#[derive(Resource)]
pub struct TankModel {
    pub body_scene: Handle<Scene>,
    pub turret_scene: Handle<Scene>,
}

pub fn spawn_tank(
    commands: &mut Commands,
    tank_model: &TankModel,
    position: Vec3,
    rotation: f32,
    turret_rotation: f32,
    color: Color,
) -> Entity {
    // Spawn tank body
    let body = commands.spawn((
        SceneBundle {
            scene: tank_model.body_scene.clone(),
            transform: Transform::from_xyz(position.x, position.y, position.z)
                .with_rotation(Quat::from_rotation_y(-rotation))
                .with_scale(Vec3::splat(5.0)),
            ..default()
        },
        TankEntity {
            tank_id: "temp".to_string(), // This will be updated by the game system
        },
    )).id();

    // Spawn turret as child of body
    let turret = commands.spawn((
        SceneBundle {
            scene: tank_model.turret_scene.clone(),
            transform: Transform::from_xyz(0.0, 0.0, 0.0)
                .with_rotation(Quat::from_rotation_y(-turret_rotation))
                .with_scale(Vec3::splat(5.0)),
            ..default()
        },
        TankTurret {
            tank_id: "temp".to_string(), // This will be updated by the game system
        },
    )).id();

    // Set up parent-child relationship
    commands.entity(body).push_children(&[turret]);

    body
}

pub fn load_tank_model(
    commands: &mut Commands,
    asset_server: Res<AssetServer>,
    mut tank_model: ResMut<TankModel>,
) {
    // Load both tank models
    tank_model.body_scene = asset_server.load("tank_body.glb#Scene0");
    tank_model.turret_scene = asset_server.load("turret.glb#Scene0");
    
    // Spawn a test tank
    spawn_tank(
        commands,
        &tank_model,
        Vec3::ZERO,
        0.0,
        0.0,
        Color::WHITE,
    );
} 