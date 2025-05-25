#![allow(dead_code)]

pub mod ecs;
pub mod game_state;
pub mod network;
pub mod physics;
pub mod server;

// Re-export commonly used types
pub use ecs::EcsWorld;
pub use game_state::GameState;
pub use network::{ClientConnection, NetworkEvent};
pub use physics::PhysicsWorld;
pub use server::GameServer; 