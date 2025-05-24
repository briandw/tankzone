use serde::{Deserialize, Serialize};
use std::time::Instant;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Player {
    pub id: String,
    pub position: [f32; 3],
    pub rotation: [f32; 3],
    pub turret_rotation: [f32; 3],
    pub health: u32,
    pub connected: bool,
    #[serde(skip, default = "Instant::now")]
    pub last_update: Instant,
}

impl Player {
    pub fn new(id: String) -> Self {
        Self {
            id,
            position: [0.0, 0.5, 0.0],
            rotation: [0.0, 0.0, 0.0],
            turret_rotation: [0.0, 0.0, 0.0],
            health: 100,
            connected: true,
            last_update: Instant::now(),
        }
    }

    pub fn is_alive(&self) -> bool {
        self.health > 0
    }

    pub fn distance_to(&self, other: &Player) -> f32 {
        let dx = self.position[0] - other.position[0];
        let dy = self.position[1] - other.position[1];
        let dz = self.position[2] - other.position[2];
        (dx * dx + dy * dy + dz * dz).sqrt()
    }

    pub fn distance_to_point(&self, point: [f32; 3]) -> f32 {
        let dx = self.position[0] - point[0];
        let dy = self.position[1] - point[1];
        let dz = self.position[2] - point[2];
        (dx * dx + dy * dy + dz * dz).sqrt()
    }
} 