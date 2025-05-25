// Generated protobuf code
include!(concat!(env!("OUT_DIR"), "/battletanks.rs"));

use prost::Message;
use std::time::{SystemTime, UNIX_EPOCH};

// Convenience implementations for common operations
impl NetworkMessage {
    /// Create a new NetworkMessage with current timestamp
    pub fn new(message_type: Option<network_message::MessageType>) -> Self {
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis() as u64;

        Self {
            timestamp,
            message_type,
        }
    }

    /// Create a PlayerInput message
    pub fn player_input(input: PlayerInput) -> Self {
        Self::new(Some(network_message::MessageType::PlayerInput(input)))
    }

    /// Create a GameStateUpdate message
    pub fn game_state_update(update: GameStateUpdate) -> Self {
        Self::new(Some(network_message::MessageType::GameStateUpdate(update)))
    }

    /// Create a JoinGameRequest message
    pub fn join_game_request(request: JoinGameRequest) -> Self {
        Self::new(Some(network_message::MessageType::JoinGameRequest(request)))
    }

    /// Create a JoinGameResponse message
    pub fn join_game_response(response: JoinGameResponse) -> Self {
        Self::new(Some(network_message::MessageType::JoinGameResponse(response)))
    }

    /// Create a PingRequest message
    pub fn ping_request(request: PingRequest) -> Self {
        Self::new(Some(network_message::MessageType::PingRequest(request)))
    }

    /// Create a PongResponse message
    pub fn pong_response(response: PongResponse) -> Self {
        Self::new(Some(network_message::MessageType::PongResponse(response)))
    }

    /// Create a ChatMessage
    pub fn chat_message(message: ChatMessageEvent) -> Self {
        Self::new(Some(network_message::MessageType::ChatMessage(message)))
    }

    /// Serialize to bytes
    pub fn to_bytes(&self) -> Result<Vec<u8>, prost::EncodeError> {
        let mut buf = Vec::new();
        self.encode(&mut buf)?;
        Ok(buf)
    }

    /// Deserialize from bytes
    pub fn from_bytes(bytes: &[u8]) -> Result<Self, prost::DecodeError> {
        Self::decode(bytes)
    }
}

impl PlayerInput {
    /// Create a new PlayerInput with current timestamp
    pub fn new(
        forward: bool,
        backward: bool,
        rotate_left: bool,
        rotate_right: bool,
        fire: bool,
        turret_angle: f32,
        sequence_number: u32,
    ) -> Self {
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis() as u64;

        Self {
            forward,
            backward,
            rotate_left,
            rotate_right,
            fire,
            turret_angle,
            timestamp,
            sequence_number,
        }
    }
}

impl Vector3 {
    /// Create a new Vector3
    pub fn new(x: f32, y: f32, z: f32) -> Self {
        Self { x, y, z }
    }

    /// Convert from nalgebra Vector3
    pub fn from_nalgebra(v: nalgebra::Vector3<f32>) -> Self {
        Self::new(v.x, v.y, v.z)
    }

    /// Convert to nalgebra Vector3
    pub fn to_nalgebra(&self) -> nalgebra::Vector3<f32> {
        nalgebra::Vector3::new(self.x, self.y, self.z)
    }
}

impl Vector2 {
    /// Create a new Vector2
    pub fn new(x: f32, y: f32) -> Self {
        Self { x, y }
    }

    /// Convert from nalgebra Vector2
    pub fn from_nalgebra(v: nalgebra::Vector2<f32>) -> Self {
        Self::new(v.x, v.y)
    }

    /// Convert to nalgebra Vector2
    pub fn to_nalgebra(&self) -> nalgebra::Vector2<f32> {
        nalgebra::Vector2::new(self.x, self.y)
    }
}

impl GameStateUpdate {
    /// Create a new GameStateUpdate
    pub fn new(tick: u64) -> Self {
        Self {
            tick,
            round_time_remaining: 0.0,
            tanks: Vec::new(),
            projectiles: Vec::new(),
            power_ups: Vec::new(),
            events: Vec::new(),
            scores: Vec::new(),
            is_delta_update: false,
            full_state_tick: tick as u32, // Convert u64 to u32
        }
    }

    /// Create a delta update
    pub fn delta(tick: u64, full_state_tick: u32) -> Self {
        Self {
            tick,
            round_time_remaining: 0.0,
            tanks: Vec::new(),
            projectiles: Vec::new(),
            power_ups: Vec::new(),
            events: Vec::new(),
            scores: Vec::new(),
            is_delta_update: true,
            full_state_tick,
        }
    }
}

impl TankState {
    /// Create a new TankState
    pub fn new(
        entity_id: u32,
        player_id: String,
        display_name: String,
        position: Vector3,
        team: TeamColor,
    ) -> Self {
        Self {
            entity_id,
            player_id,
            display_name,
            position: Some(position),
            body_rotation: 0.0,
            turret_rotation: 0.0,
            health: 100,
            max_health: 100,
            team: team as i32,
            active_powerups: Vec::new(),
            is_invulnerable: false,
            invulnerability_remaining: 0.0,
        }
    }
}

impl ProjectileState {
    /// Create a new ProjectileState
    pub fn new(
        entity_id: u32,
        owner_id: String,
        position: Vector3,
        velocity: Vector3,
        damage: u32,
        team: TeamColor,
    ) -> Self {
        Self {
            entity_id,
            owner_id,
            position: Some(position),
            velocity: Some(velocity),
            damage,
            team: team as i32,
            lifetime_remaining: 5.0, // Default 5 second lifetime
        }
    }
}

impl PowerUpState {
    /// Create a new PowerUpState
    pub fn new(entity_id: u32, power_up_type: PowerUpType, position: Vector3) -> Self {
        Self {
            entity_id,
            power_up_type: power_up_type as i32,
            position: Some(position),
            is_available: true,
            respawn_timer: 0.0,
        }
    }
}

impl JoinGameRequest {
    /// Create a new JoinGameRequest
    pub fn new(display_name: String) -> Self {
        Self {
            display_name,
            client_version: env!("CARGO_PKG_VERSION").to_string(),
        }
    }
}

impl JoinGameResponse {
    /// Create a successful response
    pub fn success(player_id: String, entity_id: u32, config: GameConfig) -> Self {
        Self {
            success: true,
            error_message: String::new(),
            player_id,
            assigned_entity_id: entity_id,
            game_config: Some(config),
        }
    }

    /// Create an error response
    pub fn error(message: String) -> Self {
        Self {
            success: false,
            error_message: message,
            player_id: String::new(),
            assigned_entity_id: 0,
            game_config: None,
        }
    }
}

impl PingRequest {
    /// Create a new PingRequest
    pub fn new(sequence_number: u32) -> Self {
        let client_timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis() as u64;

        Self {
            client_timestamp,
            sequence_number,
        }
    }
}

impl PongResponse {
    /// Create a new PongResponse
    pub fn new(client_timestamp: u64, sequence_number: u32) -> Self {
        let server_timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis() as u64;

        Self {
            client_timestamp,
            server_timestamp,
            sequence_number,
        }
    }
}

// Re-export commonly used types
pub use network_message::MessageType;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_network_message_serialization() {
        let input = PlayerInput::new(true, false, false, false, false, 1.5, 123);
        let message = NetworkMessage::player_input(input);
        
        let bytes = message.to_bytes().expect("Failed to serialize");
        let deserialized = NetworkMessage::from_bytes(&bytes).expect("Failed to deserialize");
        
        assert_eq!(message.timestamp, deserialized.timestamp);
        if let Some(MessageType::PlayerInput(input)) = deserialized.message_type {
            assert!(input.forward);
            assert!(!input.backward);
            assert_eq!(input.turret_angle, 1.5);
            assert_eq!(input.sequence_number, 123);
        } else {
            panic!("Expected PlayerInput message type");
        }
    }

    #[test]
    fn test_vector3_conversion() {
        let nalgebra_vec = nalgebra::Vector3::new(1.0, 2.0, 3.0);
        let proto_vec = Vector3::from_nalgebra(nalgebra_vec);
        let converted_back = proto_vec.to_nalgebra();
        
        assert_eq!(nalgebra_vec, converted_back);
    }

    #[test]
    fn test_game_state_update_creation() {
        let mut update = GameStateUpdate::new(100);
        update.round_time_remaining = 300.0;
        
        let tank = TankState::new(
            1,
            "player1".to_string(),
            "TestPlayer".to_string(),
            Vector3::new(0.0, 0.0, 0.0),
            TeamColor::TeamRed,
        );
        update.tanks.push(tank);
        
        assert_eq!(update.tick, 100);
        assert_eq!(update.tanks.len(), 1);
        assert!(!update.is_delta_update);
    }

    #[test]
    fn test_join_game_messages() {
        let request = JoinGameRequest::new("TestPlayer".to_string());
        assert_eq!(request.display_name, "TestPlayer");
        assert!(!request.client_version.is_empty());
        
        let config = GameConfig {
            tick_rate: 30.0,
            max_players: 50,
            round_duration: 600.0,
            respawn_time: 3.0,
            invulnerability_time: 1.0,
            map_size: Some(Vector2::new(500.0, 500.0)),
        };
        
        let response = JoinGameResponse::success("player1".to_string(), 1, config);
        assert!(response.success);
        assert_eq!(response.player_id, "player1");
        assert_eq!(response.assigned_entity_id, 1);
        
        let error_response = JoinGameResponse::error("Server full".to_string());
        assert!(!error_response.success);
        assert_eq!(error_response.error_message, "Server full");
    }

    #[test]
    fn test_ping_pong_messages() {
        let ping = PingRequest::new(42);
        assert_eq!(ping.sequence_number, 42);
        assert!(ping.client_timestamp > 0);
        
        let pong = PongResponse::new(ping.client_timestamp, ping.sequence_number);
        assert_eq!(pong.client_timestamp, ping.client_timestamp);
        assert_eq!(pong.sequence_number, ping.sequence_number);
        assert!(pong.server_timestamp > 0);
    }
} 