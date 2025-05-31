pub struct Tank {
    pub id: String,
    pub position: Position,
    pub rotation: f32,
    pub turret_rotation: f32,
    pub is_player: bool,
    pub health: u32, // Changed to u32 for consistency if needed, or keep i32
    pub is_dead: bool,
    pub respawn_at: Option<u64>, // Timestamp for when the tank should respawn
    pub last_fire_time: u64,
}

#[derive(Serialize, Deserialize, Debug, Clone)] 