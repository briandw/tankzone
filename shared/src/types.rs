use nalgebra::{Vector3, UnitQuaternion};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// Unique identifier for players
pub type PlayerId = Uuid;

/// Unique identifier for entities
pub type EntityId = u32;

/// Team colors for tanks
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum Team {
    Red,
    Blue,
    Neutral, // For NPCs
}

/// 3D position and rotation
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct Transform {
    pub position: Vector3<f32>,
    pub rotation: UnitQuaternion<f32>,
}

impl Default for Transform {
    fn default() -> Self {
        Self {
            position: Vector3::zeros(),
            rotation: UnitQuaternion::identity(),
        }
    }
}

/// Tank component data
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Tank {
    pub health: u32,
    pub max_health: u32,
    pub team: Team,
    pub turret_angle: f32,
    pub last_fire_time: f64,
    pub fire_cooldown: f64,
    pub movement_speed: f32,
    pub rotation_speed: f32,
    pub turret_rotation_speed: f32,
}

impl Default for Tank {
    fn default() -> Self {
        Self {
            health: 100,
            max_health: 100,
            team: Team::Neutral,
            turret_angle: 0.0,
            last_fire_time: 0.0,
            fire_cooldown: 0.33, // 3 shots per second
            movement_speed: 10.0,
            rotation_speed: 90.0_f32.to_radians(),
            turret_rotation_speed: 120.0_f32.to_radians(),
        }
    }
}

/// Projectile component data
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Projectile {
    pub owner: PlayerId,
    pub damage: u32,
    pub velocity: Vector3<f32>,
    pub lifetime: f32,
    pub max_lifetime: f32,
}

impl Default for Projectile {
    fn default() -> Self {
        Self {
            owner: Uuid::nil(),
            damage: 25,
            velocity: Vector3::zeros(),
            lifetime: 0.0,
            max_lifetime: 10.0, // 10 seconds max flight time
        }
    }
}

/// Obstacle component (static environment objects)
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct Obstacle {
    pub destructible: bool,
    pub health: Option<u32>,
}

/// Player input state
#[derive(Debug, Clone, Copy, Default, Serialize, Deserialize)]
pub struct PlayerInput {
    pub forward: bool,
    pub backward: bool,
    pub rotate_left: bool,
    pub rotate_right: bool,
    pub fire: bool,
    pub turret_angle: f32,
    pub timestamp: u64,
}

/// Player score tracking
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct PlayerScore {
    pub kills: u32,
    pub deaths: u32,
    pub npc_kills: u32,
}

/// Collision groups for physics
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CollisionGroup {
    Tank = 1,
    Projectile = 2,
    Obstacle = 4,
    PowerUp = 8,
}

impl CollisionGroup {
    pub fn bits(self) -> u32 {
        self as u32
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_transform_default() {
        let transform = Transform::default();
        assert_eq!(transform.position, Vector3::zeros());
        assert_eq!(transform.rotation, UnitQuaternion::identity());
    }

    #[test]
    fn test_tank_default() {
        let tank = Tank::default();
        assert_eq!(tank.health, 100);
        assert_eq!(tank.max_health, 100);
        assert_eq!(tank.team, Team::Neutral);
        assert_eq!(tank.fire_cooldown, 0.33);
    }

    #[test]
    fn test_projectile_default() {
        let projectile = Projectile::default();
        assert_eq!(projectile.damage, 25);
        assert_eq!(projectile.max_lifetime, 10.0);
    }

    #[test]
    fn test_player_input_serialization() {
        let input = PlayerInput {
            forward: true,
            fire: true,
            turret_angle: 1.57,
            timestamp: 12345,
            ..Default::default()
        };
        
        let serialized = serde_json::to_string(&input).unwrap();
        let deserialized: PlayerInput = serde_json::from_str(&serialized).unwrap();
        
        assert_eq!(input.forward, deserialized.forward);
        assert_eq!(input.fire, deserialized.fire);
        assert!((input.turret_angle - deserialized.turret_angle).abs() < f32::EPSILON);
        assert_eq!(input.timestamp, deserialized.timestamp);
    }

    #[test]
    fn test_collision_groups() {
        assert_eq!(CollisionGroup::Tank.bits(), 1);
        assert_eq!(CollisionGroup::Projectile.bits(), 2);
        assert_eq!(CollisionGroup::Obstacle.bits(), 4);
        assert_eq!(CollisionGroup::PowerUp.bits(), 8);
    }
} 