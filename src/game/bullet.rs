use serde::{Deserialize, Serialize};
use std::time::Instant;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Bullet {
    pub id: Uuid,
    pub player_id: String,
    pub position: [f32; 3],
    pub velocity: [f32; 3],
    #[serde(skip, default = "Instant::now")]
    pub created_at: Instant,
}

impl Bullet {
    pub fn new(player_id: String, position: [f32; 3], velocity: [f32; 3]) -> Self {
        Self {
            id: Uuid::new_v4(),
            player_id,
            position,
            velocity,
            created_at: Instant::now(),
        }
    }

    pub fn update_position(&mut self, delta_time: f32) {
        self.position[0] += self.velocity[0] * delta_time;
        self.position[1] += self.velocity[1] * delta_time;
        self.position[2] += self.velocity[2] * delta_time;
    }

    pub fn is_expired(&self, max_age_seconds: u64) -> bool {
        self.created_at.elapsed().as_secs() > max_age_seconds
    }

    pub fn is_out_of_bounds(&self, bounds: f32) -> bool {
        self.position[0].abs() > bounds ||
        self.position[1] > bounds ||
        self.position[2].abs() > bounds
    }

    pub fn distance_to_point(&self, point: [f32; 3]) -> f32 {
        let dx = self.position[0] - point[0];
        let dy = self.position[1] - point[1];
        let dz = self.position[2] - point[2];
        (dx * dx + dy * dy + dz * dz).sqrt()
    }
} 