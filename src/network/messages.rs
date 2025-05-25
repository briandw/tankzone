use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::game::{Player, Bullet, Enemy};

/// Player input from client (used by physics engine)
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct PlayerInput {
    pub forward: bool,
    pub backward: bool,
    pub strafe_left: bool,
    pub strafe_right: bool,
    pub mouse_x: f32,  // Camera yaw (turret horizontal aiming)
    pub mouse_y: f32,  // Camera pitch (turret vertical aiming)
}

// Messages sent from client to server
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum ClientMessage {
    // Command-based input messages
    PlayerInput {
        forward: bool,
        backward: bool,
        strafe_left: bool,
        strafe_right: bool,
        mouse_x: f32,  // Camera yaw
        mouse_y: f32,  // Camera pitch
    },
    FireCommand {
        // Server will calculate position and velocity based on player state
    },
    
    // Legacy messages (will be deprecated)
    PlayerUpdate {
        position: [f32; 3],
        rotation: [f32; 3],
        turret_rotation: [f32; 3],
    },
    BulletFired {
        position: [f32; 3],
        velocity: [f32; 3],
    },
    BulletHit {
        bullet_id: Uuid,
        target_player_id: String,
        damage: u32,
    },
    
    // Low-frequency messages (can be JSON text for easier debugging)
    ChatMessage {
        message: String,
    },
    Ping,
}

impl From<ClientMessage> for PlayerInput {
    fn from(msg: ClientMessage) -> Self {
        match msg {
            ClientMessage::PlayerInput { forward, backward, strafe_left, strafe_right, mouse_x, mouse_y } => {
                PlayerInput {
                    forward,
                    backward,
                    strafe_left,
                    strafe_right,
                    mouse_x,
                    mouse_y,
                }
            },
            _ => PlayerInput::default(),
        }
    }
}

// Messages sent from server to clients
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum ServerMessage {
    // High-frequency updates (MessagePack)
    PlayerMoved {
        player_id: String,
        position: [f32; 3],
        rotation: [f32; 3],
        turret_rotation: [f32; 3],
    },
    BulletSpawned {
        bullet: Bullet,
    },
    BulletDestroyed {
        bullet_id: Uuid,
    },
    BulletsUpdate {
        bullets: Vec<Bullet>,
    },
    
    // Game state updates (MessagePack) - Physics-based
    GameStateUpdate {
        players: Vec<Player>,
        enemies: Vec<Enemy>,
        // Note: bullets are handled by physics and sent separately
    },
    PlayerJoined {
        player: Player,
    },
    PlayerLeft {
        player_id: String,
    },
    BulletHitConfirmed {
        bullet_id: Uuid,
        target_player_id: String,
        damage: u32,
        new_health: u32,
    },
    PlayerDestroyed {
        player_id: String,
    },
    PlayerRespawned {
        player: Player,
    },
    
    // Low-frequency events (JSON)
    ChatMessage {
        player_id: String,
        message: String,
        timestamp: u64,
    },
    PlayerAssigned {
        player_id: String,
    },
    ServerInfo {
        message: String,
    },
    Error {
        message: String,
    },
    Pong,
    
    // Enemy messages
    EnemySpawned {
        enemy: Enemy,
    },
    EnemyMoved {
        enemy_id: Uuid,
        position: [f32; 3],
        rotation: [f32; 3],
    },
    EnemyHit {
        enemy_id: Uuid,
        bullet_id: Uuid,
        damage: u32,
        new_health: u32,
    },
    EnemyDestroyed {
        enemy_id: Uuid,
        position: [f32; 3], // For explosion effect
    },
}

impl ClientMessage {
    /// Determine if this message should be sent as binary (MessagePack) or text (JSON)
    pub fn is_binary(&self) -> bool {
        matches!(self, 
            ClientMessage::PlayerInput { .. } |
            ClientMessage::FireCommand { .. } |
            ClientMessage::PlayerUpdate { .. } |
            ClientMessage::BulletFired { .. } |
            ClientMessage::BulletHit { .. }
        )
    }
    
    pub fn to_binary(&self) -> Result<Vec<u8>, rmp_serde::encode::Error> {
        rmp_serde::to_vec(self)
    }
    
    pub fn to_json(&self) -> Result<String, serde_json::Error> {
        serde_json::to_string(self)
    }
    
    pub fn from_binary(data: &[u8]) -> Result<Self, rmp_serde::decode::Error> {
        rmp_serde::from_slice(data)
    }
    
    pub fn from_json(data: &str) -> Result<Self, serde_json::Error> {
        serde_json::from_str(data)
    }
}

impl ServerMessage {
    /// Determine if this message should be sent as binary (MessagePack) or text (JSON)
    pub fn is_binary(&self) -> bool {
        // Temporarily disable all binary messages for debugging
        false
        
        // Original binary messages (commented out for now):
        // matches!(self,
        //     ServerMessage::PlayerMoved { .. } |
        //     ServerMessage::BulletSpawned { .. } |
        //     ServerMessage::BulletDestroyed { .. } |
        //     ServerMessage::BulletsUpdate { .. } |
        //     ServerMessage::GameStateUpdate { .. } |
        //     ServerMessage::BulletHitConfirmed { .. } |
        //     ServerMessage::PlayerDestroyed { .. } |
        //     ServerMessage::PlayerRespawned { .. }
        // )
    }
    
    pub fn to_binary(&self) -> Result<Vec<u8>, rmp_serde::encode::Error> {
        rmp_serde::to_vec(self)
    }
    
    pub fn to_json(&self) -> Result<String, serde_json::Error> {
        serde_json::to_string(self)
    }
    
    pub fn from_binary(data: &[u8]) -> Result<Self, rmp_serde::decode::Error> {
        rmp_serde::from_slice(data)
    }
    
    pub fn from_json(data: &str) -> Result<Self, serde_json::Error> {
        serde_json::from_str(data)
    }
}

// Helper for message size analysis (useful for debugging/optimization)
pub fn message_size_analysis(msg: &ServerMessage) -> (usize, usize) {
    let binary_size = msg.to_binary().map(|b| b.len()).unwrap_or(0);
    let json_size = msg.to_json().map(|s| s.len()).unwrap_or(0);
    (binary_size, json_size)
} 