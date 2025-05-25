use battletanks_shared::{Config, PlayerId, EntityId, ProtoPlayerInput, Transform};
use crate::ecs::EcsWorld;
use crate::physics::PhysicsWorld;
use std::collections::HashMap;
use std::collections::VecDeque;
use tracing::info;

/// Main game state that coordinates ECS and Physics
pub struct GameState {
    ecs_world: EcsWorld,
    tick_counter: u64,
    events: VecDeque<battletanks_shared::GameEvent>,
    player_scores: HashMap<PlayerId, battletanks_shared::PlayerScore>,
    round_timer: f32,
    config: Config,
}

impl GameState {
    /// Create a new game state
    pub fn new(config: &Config) -> Self {
        Self {
            ecs_world: EcsWorld::new(),
            tick_counter: 0,
            events: VecDeque::new(),
            player_scores: HashMap::new(),
            round_timer: 0.0,
            config: config.clone(),
        }
    }

    /// Update the game state
    pub fn update(&mut self, _physics_world: &PhysicsWorld) {
        self.tick_counter += 1;
        self.round_timer += self.config.server.physics_timestep;

        // Run ECS systems
        self.ecs_world.movement_system(self.config.server.physics_timestep);
        let expired_projectiles = self.ecs_world.projectile_system(self.config.server.physics_timestep);

        // Remove expired projectiles
        for entity_id in expired_projectiles {
            self.ecs_world.remove_entity(entity_id);
        }

        // Clear old events (keep last 100)
        while self.events.len() > 100 {
            self.events.pop_front();
        }
    }

    /// Add a player to the game
    pub fn add_player(&mut self, player_id: PlayerId, name: String) -> EntityId {
        // Create player tank entity (we'll integrate with physics later)
        let transform = Transform::default();
        let physics_handle = rapier3d::prelude::RigidBodyHandle::from_raw_parts(0, 0); // Placeholder
        
        let entity_id = self.ecs_world.create_player_tank(
            player_id,
            name.clone(),
            transform,
            physics_handle,
        );

        // Initialize player score
        self.player_scores.insert(player_id, battletanks_shared::PlayerScore::default());

        // Add player joined event
        self.events.push_back(battletanks_shared::GameEvent::PlayerJoined {
            player_id,
            name,
            team: battletanks_shared::Team::Red, // TODO: Assign teams properly
        });

        info!("Player {} added to game with entity ID {}", player_id, entity_id);
        entity_id
    }

    /// Remove a player from the game
    pub fn remove_player(&mut self, player_id: PlayerId) {
        // Find and remove player entity
        let players = self.ecs_world.get_players();
        for (entity_id, _, _, player) in players {
            if player.player_id == player_id {
                self.ecs_world.remove_entity(entity_id);
                break;
            }
        }

        // Remove player score
        self.player_scores.remove(&player_id);

        // Add player left event
        self.events.push_back(battletanks_shared::GameEvent::PlayerLeft {
            player_id,
        });

        info!("Player {} removed from game", player_id);
    }

    /// Update player input
    pub fn update_player_input(&mut self, player_id: PlayerId, input: ProtoPlayerInput) {
        // Convert ProtoPlayerInput to the internal PlayerInput format
        let internal_input = battletanks_shared::PlayerInput {
            forward: input.forward,
            backward: input.backward,
            rotate_left: input.rotate_left,
            rotate_right: input.rotate_right,
            fire: input.fire,
            turret_angle: input.turret_angle,
            timestamp: input.timestamp,
        };
        self.ecs_world.update_player_input(player_id, internal_input);
    }

    /// Get current tick
    pub fn tick(&self) -> u64 {
        self.tick_counter
    }

    // Note: create_state_message removed - using StateSynchronizer for Protocol Buffer state updates

    /// Get player count
    pub fn player_count(&self) -> usize {
        self.ecs_world.get_players().len()
    }

    /// Get entity count
    pub fn entity_count(&self) -> usize {
        self.ecs_world.entity_count()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use uuid::Uuid;
    use tokio::time::{timeout, Duration};

    #[test]
    fn test_game_state_creation() {
        let config = Config::default();
        let game_state = GameState::new(&config);
        
        assert_eq!(game_state.tick(), 0);
        assert_eq!(game_state.player_count(), 0);
        assert_eq!(game_state.entity_count(), 0);
    }

    #[test]
    fn test_add_player() {
        let config = Config::default();
        let mut game_state = GameState::new(&config);
        
        let player_id = Uuid::new_v4();
        let entity_id = game_state.add_player(player_id, "TestPlayer".to_string());
        
        assert_eq!(game_state.player_count(), 1);
        assert_eq!(game_state.entity_count(), 1);
        assert_eq!(entity_id, 1);
        
        // Check that player score was initialized
        assert!(game_state.player_scores.contains_key(&player_id));
    }

    #[test]
    fn test_remove_player() {
        let config = Config::default();
        let mut game_state = GameState::new(&config);
        
        let player_id = Uuid::new_v4();
        game_state.add_player(player_id, "TestPlayer".to_string());
        
        assert_eq!(game_state.player_count(), 1);
        
        game_state.remove_player(player_id);
        
        assert_eq!(game_state.player_count(), 0);
        assert_eq!(game_state.entity_count(), 0);
        assert!(!game_state.player_scores.contains_key(&player_id));
    }

    #[test]
    fn test_update_player_input() {
        let config = Config::default();
        let mut game_state = GameState::new(&config);
        
        let player_id = Uuid::new_v4();
        game_state.add_player(player_id, "TestPlayer".to_string());
        
        let input = ProtoPlayerInput {
            forward: true,
            backward: false,
            rotate_left: false,
            rotate_right: false,
            fire: true,
            turret_angle: 1.57,
            timestamp: 0,
            sequence_number: 1,
        };
        
        game_state.update_player_input(player_id, input);
        
        // Verify input was updated
        let players = game_state.ecs_world.get_players();
        assert!(players[0].3.input.forward);
        assert!(players[0].3.input.fire);
    }

    #[test]
    fn test_game_state_update() {
        let config = Config::default();
        let mut game_state = GameState::new(&config);
        let physics_world = PhysicsWorld::new(&config).unwrap();
        
        let initial_tick = game_state.tick();
        
        game_state.update(&physics_world);
        
        assert_eq!(game_state.tick(), initial_tick + 1);
    }

    // Note: test_create_state_message removed - using StateSynchronizer for Protocol Buffer state updates

    #[tokio::test]
    async fn test_game_state_update_with_timeout() -> Result<(), Box<dyn std::error::Error>> {
        let config = Config::default();
        let mut game_state = GameState::new(&config);
        let physics_world = PhysicsWorld::new(&config)?;
        
        // Add some players
        for i in 0..10 {
            let player_id = Uuid::new_v4();
            game_state.add_player(player_id, format!("Player{}", i));
        }
        
        let update_operation = async {
            // Run 100 updates (simulating ~3.3 seconds at 30Hz)
            for _ in 0..100 {
                game_state.update(&physics_world);
            }
        };
        
        // Should complete within 5 seconds
        timeout(Duration::from_secs(5), update_operation).await?;
        
        assert_eq!(game_state.tick(), 100);
        assert_eq!(game_state.player_count(), 10);
        
        Ok(())
    }

    // Note: test_state_serialization_with_timeout removed - using StateSynchronizer for Protocol Buffer state updates
} 