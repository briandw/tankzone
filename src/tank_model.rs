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
    _color: Color,
) -> (Entity, Entity) {
    // Spawn tank body with 90-degree offset to correct orientation
    let body = commands.spawn((
        SceneBundle {
            scene: tank_model.body_scene.clone(),
            transform: Transform::from_xyz(position.x, position.y, position.z)
                .with_rotation(Quat::from_rotation_y(-rotation + std::f32::consts::FRAC_PI_2))
                .with_scale(Vec3::splat(5.0)),
            ..default()
        },
        TankEntity {
            tank_id: "temp".to_string(), // This will be updated by the game system
        },
    )).id();

    // Spawn turret as a separate entity (not a child of the body)
    let turret = commands.spawn((
        SceneBundle {
            scene: tank_model.turret_scene.clone(),
            transform: Transform::from_xyz(position.x, position.y, position.z)
                .with_rotation(Quat::from_rotation_y(-turret_rotation + std::f32::consts::FRAC_PI_2))
                .with_scale(Vec3::splat(5.0)),
            ..default()
        },
        TankTurret {
            tank_id: "temp".to_string(), // This will be updated by the game system
        },
    )).id();

    (body, turret)
} 