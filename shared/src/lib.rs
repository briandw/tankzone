pub mod types;
pub mod events;
pub mod config;
pub mod proto;

pub use types::*;
pub use events::*;
pub use config::*;

// Re-export protobuf types with explicit names to avoid conflicts
pub use proto::{
    NetworkMessage as ProtoNetworkMessage,
    PlayerInput as ProtoPlayerInput,
    GameStateUpdate as ProtoGameStateUpdate,
    GameEvent as ProtoGameEvent,
    GameConfig as ProtoGameConfig,
    PlayerScore as ProtoPlayerScore,
    Vector3 as ProtoVector3,
    Vector2 as ProtoVector2,
    TankState,
    ProjectileState,
    PowerUpState,
    ActivePowerUp,
    JoinGameRequest,
    JoinGameResponse,
    PingRequest,
    PongResponse,
    TeamColor,
    PowerUpType,
    MessageType,
}; 