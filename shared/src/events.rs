use serde::{Deserialize, Serialize};
use crate::{PlayerId, EntityId, Transform, Team};

/// Game events that occur during gameplay
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum GameEvent {
    /// Player joined the game
    PlayerJoined {
        player_id: PlayerId,
        name: String,
        team: Team,
    },
    /// Player left the game
    PlayerLeft {
        player_id: PlayerId,
    },
    /// Tank was destroyed
    TankDestroyed {
        tank_id: EntityId,
        killer_id: Option<PlayerId>,
        position: Transform,
    },
    /// Projectile hit something
    ProjectileHit {
        projectile_id: EntityId,
        target_id: Option<EntityId>,
        position: Transform,
        damage: u32,
    },
    /// Player scored a kill
    PlayerKill {
        killer_id: PlayerId,
        victim_id: PlayerId,
    },
    /// Round started
    RoundStarted {
        round_duration: f32,
    },
    /// Round ended
    RoundEnded {
        winner: Option<PlayerId>,
        scores: Vec<(PlayerId, u32)>,
    },
    /// Chat message
    ChatMessage {
        player_id: PlayerId,
        message: String,
        timestamp: u64,
    },
}

/// Network messages between client and server
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum NetworkMessage {
    /// Client to server: Player input
    PlayerInput(crate::PlayerInput),
    /// Client to server: Join game request
    JoinGame {
        player_name: String,
    },
    /// Client to server: Chat message
    ChatMessage {
        message: String,
    },
    /// Server to client: Game state update
    GameStateUpdate {
        tick: u64,
        entities: Vec<EntityState>,
        events: Vec<GameEvent>,
    },
    /// Server to client: Player joined confirmation
    JoinConfirmed {
        player_id: PlayerId,
        entity_id: EntityId,
    },
    /// Server to client: Error message
    Error {
        message: String,
    },
}

/// State of an entity for network synchronization
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EntityState {
    pub id: EntityId,
    pub transform: Transform,
    pub entity_type: EntityType,
}

/// Type of entity for rendering
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EntityType {
    Tank {
        health: u32,
        max_health: u32,
        team: Team,
        turret_angle: f32,
        player_id: Option<PlayerId>,
    },
    Projectile {
        velocity: nalgebra::Vector3<f32>,
        owner: PlayerId,
    },
    Obstacle,
}

#[cfg(test)]
mod tests {
    use super::*;
    use uuid::Uuid;
    use nalgebra::Vector3;

    #[test]
    fn test_game_event_serialization() {
        let event = GameEvent::PlayerJoined {
            player_id: Uuid::new_v4(),
            name: "TestPlayer".to_string(),
            team: Team::Red,
        };

        let serialized = serde_json::to_string(&event).unwrap();
        let deserialized: GameEvent = serde_json::from_str(&serialized).unwrap();

        match (event, deserialized) {
            (GameEvent::PlayerJoined { name: n1, team: t1, .. }, 
             GameEvent::PlayerJoined { name: n2, team: t2, .. }) => {
                assert_eq!(n1, n2);
                assert_eq!(t1, t2);
            }
            _ => panic!("Deserialization failed"),
        }
    }

    #[test]
    fn test_network_message_serialization() {
        let input = crate::PlayerInput {
            forward: true,
            fire: true,
            turret_angle: 1.57,
            timestamp: 12345,
            ..Default::default()
        };

        let message = NetworkMessage::PlayerInput(input);
        let serialized = serde_json::to_string(&message).unwrap();
        let deserialized: NetworkMessage = serde_json::from_str(&serialized).unwrap();

        match deserialized {
            NetworkMessage::PlayerInput(deserialized_input) => {
                assert_eq!(input.forward, deserialized_input.forward);
                assert_eq!(input.fire, deserialized_input.fire);
                assert!((input.turret_angle - deserialized_input.turret_angle).abs() < f32::EPSILON);
            }
            _ => panic!("Wrong message type"),
        }
    }

    #[test]
    fn test_entity_state_creation() {
        let entity_state = EntityState {
            id: 123,
            transform: crate::Transform::default(),
            entity_type: EntityType::Tank {
                health: 100,
                max_health: 100,
                team: Team::Blue,
                turret_angle: 0.0,
                player_id: Some(Uuid::new_v4()),
            },
        };

        assert_eq!(entity_state.id, 123);
        match entity_state.entity_type {
            EntityType::Tank { health, team, .. } => {
                assert_eq!(health, 100);
                assert_eq!(team, Team::Blue);
            }
            _ => panic!("Wrong entity type"),
        }
    }
} 