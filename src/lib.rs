use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Position {
    pub x: f32,
    pub y: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Velocity {
    pub x: f32,
    pub y: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Bullet {
    pub id: String,
    pub position: Position,
    pub velocity: Velocity,
    pub owner_id: String,
    pub created_at: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Tank {
    pub id: String,
    pub position: Position,
    pub rotation: f32,
    pub turret_rotation: f32,
    pub is_player: bool,
    pub health: i32,
    pub is_dead: bool,
    pub respawn_time: Option<u64>,
    pub last_fire_time: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameState {
    pub tanks: Vec<Tank>,
    pub bullets: Vec<Bullet>,
}

// Input handling
pub struct PlayerInput {
    pub w: bool,
    pub a: bool,
    pub s: bool,
    pub d: bool,
    pub arrow_left: bool,
    pub arrow_right: bool,
    pub arrow_up: bool,
    pub arrow_down: bool,
    pub space: bool,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ClientMessage {
    #[serde(rename = "join")]
    Join { 
        name: String,
        user_id: Option<String>,
    },
    #[serde(rename = "input")]
    Input { input: u16 },
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ServerMessage {
    #[serde(rename = "joined")]
    Joined { 
        player_id: String,
        user_id: String,
    },
    #[serde(rename = "game_state")]
    GameState(GameState),
}

impl ClientMessage {
    pub fn decode_input(input: u16) -> PlayerInput {
        PlayerInput {
            w: (input & (1 << 0)) != 0,
            a: (input & (1 << 1)) != 0,
            s: (input & (1 << 2)) != 0,
            d: (input & (1 << 3)) != 0,
            arrow_left: (input & (1 << 4)) != 0,
            arrow_right: (input & (1 << 5)) != 0,
            arrow_up: (input & (1 << 6)) != 0,
            arrow_down: (input & (1 << 7)) != 0,
            space: (input & (1 << 8)) != 0,
        }
    }
}

pub fn encode_keys(keys: &HashMap<&str, bool>) -> u16 {
    let mut bitfield = 0;
    
    if *keys.get("KeyW").unwrap_or(&false) { bitfield |= 1 << 0; }
    if *keys.get("KeyA").unwrap_or(&false) { bitfield |= 1 << 1; }
    if *keys.get("KeyS").unwrap_or(&false) { bitfield |= 1 << 2; }
    if *keys.get("KeyD").unwrap_or(&false) { bitfield |= 1 << 3; }
    if *keys.get("ArrowLeft").unwrap_or(&false) { bitfield |= 1 << 4; }
    if *keys.get("ArrowRight").unwrap_or(&false) { bitfield |= 1 << 5; }
    if *keys.get("ArrowUp").unwrap_or(&false) { bitfield |= 1 << 6; }
    if *keys.get("ArrowDown").unwrap_or(&false) { bitfield |= 1 << 7; }
    if *keys.get("Space").unwrap_or(&false) { bitfield |= 1 << 8; }
    
    bitfield
} 