use battletanks_shared::{Config, NetworkMessage, PlayerId, EntityId, PlayerInput, Transform};
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
    pub fn update_player_input(&mut self, player_id: PlayerId, input: PlayerInput) {
        self.ecs_world.update_player_input(player_id, input);
    }

    /// Get current tick
    pub fn tick(&self) -> u64 {
        self.tick_counter
    }

    /// Create a network message with current game state
    pub fn create_state_message(&self) -> NetworkMessage {
        let mut entities = Vec::new();

        // Add tank entities
        for (entity_id, transform, tank) in self.ecs_world.get_tanks() {
            // Check if it's a player tank
            let players = self.ecs_world.get_players();
            let player_id = players.iter()
                .find(|(id, _, _, _)| *id == entity_id)
                .map(|(_, _, _, player)| player.player_id);

            entities.push(battletanks_shared::EntityState {
                id: entity_id,
                transform,
                entity_type: battletanks_shared::EntityType::Tank {
                    health: tank.health,
                    max_health: tank.max_health,
                    team: tank.team,
                    turret_angle: tank.turret_angle,
                    player_id,
                },
            });
        }

        // Add projectile entities
        for (entity_id, transform, projectile) in self.ecs_world.get_projectiles() {
            entities.push(battletanks_shared::EntityState {
                id: entity_id,
                transform,
                entity_type: battletanks_shared::EntityType::Projectile {
                    velocity: projectile.velocity,
                    owner: projectile.owner,
                },
            });
        }

        // Get recent events
        let events: Vec<_> = self.events.iter().cloned().collect();

        NetworkMessage::GameStateUpdate {
            tick: self.tick_counter,
            entities,
            events,
        }
    }

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
        
        let input = PlayerInput {
            forward: true,
            fire: true,
            turret_angle: 1.57,
            ..Default::default()
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

    #[test]
    fn test_create_state_message() {
        let config = Config::default();
        let mut game_state = GameState::new(&config);
        
        let player_id = Uuid::new_v4();
        game_state.add_player(player_id, "TestPlayer".to_string());
        
        let message = game_state.create_state_message();
        
        match message {
            NetworkMessage::GameStateUpdate { tick, entities, events } => {
                assert_eq!(tick, 0);
                assert_eq!(entities.len(), 1);
                assert!(!events.is_empty()); // Should have PlayerJoined event
            }
            _ => panic!("Wrong message type"),
        }
    }

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

    #[tokio::test]
    async fn test_state_serialization_with_timeout() -> Result<(), Box<dyn std::error::Error>> {
        let config = Config::default();
        let mut game_state = GameState::new(&config);
        
        // Add multiple players
        for i in 0..5 {
            let player_id = Uuid::new_v4();
            game_state.add_player(player_id, format!("Player{}", i));
        }
        
        let serialization_test = async {
            for _ in 0..50 {
                let message = game_state.create_state_message();
                
                // Test that message can be serialized
                let _serialized = serde_json::to_string(&message).unwrap();
            }
        };
        
        // Should complete within 1 second
        timeout(Duration::from_secs(1), serialization_test).await?;
        
        Ok(())
    }
} 