use serde::{Deserialize, Serialize};
use std::time::Instant;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Enemy {
    pub id: Uuid,
    pub position: [f32; 3],
    pub rotation: [f32; 3],
    pub health: u32,
    pub max_health: u32,
    #[serde(skip, default = "Instant::now")]
    pub last_update: Instant,
    #[serde(skip)]
    pub ai_data: EnemyAI,
}

#[derive(Debug, Clone)]
pub struct EnemyAI {
    pub move_direction: f32,
    pub speed: f32,
    pub last_move_time: Instant,
    pub change_direction_interval: f32, // seconds
}

impl Default for EnemyAI {
    fn default() -> Self {
        Self {
            move_direction: rand::random::<f32>() * std::f32::consts::PI * 2.0,
            speed: 0.5 + rand::random::<f32>() * 0.3, // 0.5 to 0.8 units per second
            last_move_time: Instant::now(),
            change_direction_interval: 2.0 + rand::random::<f32>() * 3.0, // 2-5 seconds
        }
    }
}

impl Enemy {
    pub fn new(position: [f32; 3]) -> Self {
        Self {
            id: Uuid::new_v4(),
            position,
            rotation: [0.0, rand::random::<f32>() * std::f32::consts::PI * 2.0, 0.0],
            health: 100,
            max_health: 100,
            last_update: Instant::now(),
            ai_data: EnemyAI::default(),
        }
    }

    pub fn is_alive(&self) -> bool {
        self.health > 0
    }

    pub fn take_damage(&mut self, damage: u32) -> bool {
        self.health = self.health.saturating_sub(damage);
        self.health == 0 // Returns true if enemy died
    }

    pub fn distance_to_point(&self, point: [f32; 3]) -> f32 {
        let dx = self.position[0] - point[0];
        let dy = self.position[1] - point[1];
        let dz = self.position[2] - point[2];
        (dx * dx + dy * dy + dz * dz).sqrt()
    }

    /// Update enemy AI movement
    pub fn update_ai(&mut self, delta_time: f32, world_bounds: f32) {
        let now = Instant::now();
        
        // Check if it's time to change direction
        if now.duration_since(self.ai_data.last_move_time).as_secs_f32() > self.ai_data.change_direction_interval {
            self.ai_data.move_direction = rand::random::<f32>() * std::f32::consts::PI * 2.0;
            self.ai_data.last_move_time = now;
            self.ai_data.change_direction_interval = 2.0 + rand::random::<f32>() * 3.0;
        }

        // Move in current direction
        let move_x = self.ai_data.move_direction.cos() * self.ai_data.speed * delta_time;
        let move_z = self.ai_data.move_direction.sin() * self.ai_data.speed * delta_time;

        self.position[0] += move_x;
        self.position[2] += move_z;

        // Bounce off world boundaries
        if self.position[0].abs() > world_bounds || self.position[2].abs() > world_bounds {
            self.ai_data.move_direction += std::f32::consts::PI; // Reverse direction
            self.position[0] = self.position[0].clamp(-world_bounds, world_bounds);
            self.position[2] = self.position[2].clamp(-world_bounds, world_bounds);
        }

        // Update rotation to face movement direction
        self.rotation[1] = self.ai_data.move_direction;
        self.last_update = now;
    }
} 