use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::game::{Player, Bullet};

// Messages sent from client to server
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum ClientMessage {
    // High-frequency messages (will be MessagePack binary)
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
    
    // Game state updates (MessagePack)
    GameStateUpdate {
        players: Vec<Player>,
        bullets: Vec<Bullet>,
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
    ServerInfo {
        message: String,
    },
    Error {
        message: String,
    },
    Pong,
}

impl ClientMessage {
    /// Determine if this message should be sent as binary (MessagePack) or text (JSON)
    pub fn is_binary(&self) -> bool {
        matches!(self, 
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
        matches!(self,
            ServerMessage::PlayerMoved { .. } |
            ServerMessage::BulletSpawned { .. } |
            ServerMessage::BulletDestroyed { .. } |
            ServerMessage::BulletsUpdate { .. } |
            ServerMessage::GameStateUpdate { .. } |
            ServerMessage::PlayerJoined { .. } |
            ServerMessage::PlayerLeft { .. } |
            ServerMessage::BulletHitConfirmed { .. } |
            ServerMessage::PlayerDestroyed { .. } |
            ServerMessage::PlayerRespawned { .. }
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

// Helper for message size analysis (useful for debugging/optimization)
pub fn message_size_analysis(msg: &ServerMessage) -> (usize, usize) {
    let binary_size = msg.to_binary().map(|b| b.len()).unwrap_or(0);
    let json_size = msg.to_json().map(|s| s.len()).unwrap_or(0);
    (binary_size, json_size)
} 