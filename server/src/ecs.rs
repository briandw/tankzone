use battletanks_shared::{Transform, Tank, Projectile, Obstacle, PlayerInput, PlayerId, EntityId};
use hecs::{World, Entity};
use nalgebra::Vector3;
use rapier3d::prelude::RigidBodyHandle;
use std::collections::HashMap;
use tracing::warn;

/// ECS world wrapper that manages entities and components
pub struct EcsWorld {
    world: World,
    next_entity_id: EntityId,
    entity_map: HashMap<EntityId, Entity>, // Maps our entity IDs to Hecs entities
    physics_map: HashMap<Entity, RigidBodyHandle>, // Maps entities to physics handles
}

/// Component that links entities to physics bodies
#[derive(Debug, Clone)]
pub struct PhysicsBody {
    pub handle: RigidBodyHandle,
}

/// Component for player-controlled entities
#[derive(Debug, Clone)]
pub struct Player {
    pub player_id: PlayerId,
    pub name: String,
    pub input: PlayerInput,
}

/// Component for NPC entities
#[derive(Debug, Clone)]
pub struct Npc {
    pub ai_state: NpcAiState,
    pub target: Option<Entity>,
}

#[derive(Debug, Clone)]
pub enum NpcAiState {
    Patrol,
    Attacking,
    Searching,
}

impl Default for EcsWorld {
    fn default() -> Self {
        Self::new()
    }
}

impl EcsWorld {
    /// Create a new ECS world
    pub fn new() -> Self {
        Self {
            world: World::new(),
            next_entity_id: 1,
            entity_map: HashMap::new(),
            physics_map: HashMap::new(),
        }
    }

    /// Create a new entity and return its ID
    fn create_entity(&mut self) -> (EntityId, Entity) {
        let entity_id = self.next_entity_id;
        self.next_entity_id += 1;
        
        let entity = self.world.spawn(());
        self.entity_map.insert(entity_id, entity);
        
        (entity_id, entity)
    }

    /// Create a player tank entity
    pub fn create_player_tank(
        &mut self,
        player_id: PlayerId,
        name: String,
        transform: Transform,
        physics_handle: RigidBodyHandle,
    ) -> EntityId {
        let (entity_id, entity) = self.create_entity();
        
        let tank = Tank {
            team: battletanks_shared::Team::Red, // TODO: Assign teams properly
            ..Default::default()
        };
        
        let player = Player {
            player_id,
            name,
            input: PlayerInput::default(),
        };
        
        let physics_body = PhysicsBody {
            handle: physics_handle,
        };
        
        // Add all components to the entity
        let _ = self.world.insert(entity, (transform, tank, player, physics_body));
        
        self.physics_map.insert(entity, physics_handle);
        
        entity_id
    }

    /// Create an NPC tank entity
    pub fn create_npc_tank(
        &mut self,
        transform: Transform,
        physics_handle: RigidBodyHandle,
    ) -> EntityId {
        let (entity_id, entity) = self.create_entity();
        
        let tank = Tank {
            team: battletanks_shared::Team::Neutral,
            ..Default::default()
        };
        
        let npc = Npc {
            ai_state: NpcAiState::Patrol,
            target: None,
        };
        
        let physics_body = PhysicsBody {
            handle: physics_handle,
        };
        
        // Add all components to the entity
        let _ = self.world.insert(entity, (transform, tank, npc, physics_body));
        
        self.physics_map.insert(entity, physics_handle);
        
        entity_id
    }

    /// Create a projectile entity
    pub fn create_projectile(
        &mut self,
        transform: Transform,
        projectile: Projectile,
        physics_handle: RigidBodyHandle,
    ) -> EntityId {
        let (entity_id, entity) = self.create_entity();
        
        let physics_body = PhysicsBody {
            handle: physics_handle,
        };
        
        // Add all components to the entity
        let _ = self.world.insert(entity, (transform, projectile, physics_body));
        
        self.physics_map.insert(entity, physics_handle);
        
        entity_id
    }

    /// Create an obstacle entity
    pub fn create_obstacle(
        &mut self,
        transform: Transform,
        obstacle: Obstacle,
        physics_handle: RigidBodyHandle,
    ) -> EntityId {
        let (entity_id, entity) = self.create_entity();
        
        let physics_body = PhysicsBody {
            handle: physics_handle,
        };
        
        // Add all components to the entity
        let _ = self.world.insert(entity, (transform, obstacle, physics_body));
        
        self.physics_map.insert(entity, physics_handle);
        
        entity_id
    }

    /// Remove an entity by ID
    pub fn remove_entity(&mut self, entity_id: EntityId) -> Option<RigidBodyHandle> {
        if let Some(entity) = self.entity_map.remove(&entity_id) {
            let physics_handle = self.physics_map.remove(&entity);
            if let Err(e) = self.world.despawn(entity) {
                warn!("Failed to despawn entity {}: {}", entity_id, e);
            }
            physics_handle
        } else {
            None
        }
    }

    /// Update player input for a specific player
    pub fn update_player_input(&mut self, player_id: PlayerId, input: PlayerInput) {
        for (_, (player,)) in self.world.query_mut::<(&mut Player,)>() {
            if player.player_id == player_id {
                player.input = input;
                break;
            }
        }
    }

    /// Get all player entities with their components
    pub fn get_players(&self) -> Vec<(EntityId, Transform, Tank, Player)> {
        let mut players = Vec::new();
        
        for (entity, (transform, tank, player)) in self.world.query::<(&Transform, &Tank, &Player)>().iter() {
            if let Some(entity_id) = self.get_entity_id(entity) {
                players.push((entity_id, *transform, tank.clone(), player.clone()));
            }
        }
        
        players
    }

    /// Get all tank entities (players and NPCs)
    pub fn get_tanks(&self) -> Vec<(EntityId, Transform, Tank)> {
        let mut tanks = Vec::new();
        
        for (entity, (transform, tank)) in self.world.query::<(&Transform, &Tank)>().iter() {
            if let Some(entity_id) = self.get_entity_id(entity) {
                tanks.push((entity_id, *transform, tank.clone()));
            }
        }
        
        tanks
    }

    /// Get all projectile entities
    pub fn get_projectiles(&self) -> Vec<(EntityId, Transform, Projectile)> {
        let mut projectiles = Vec::new();
        
        for (entity, (transform, projectile)) in self.world.query::<(&Transform, &Projectile)>().iter() {
            if let Some(entity_id) = self.get_entity_id(entity) {
                projectiles.push((entity_id, *transform, projectile.clone()));
            }
        }
        
        projectiles
    }

    /// Get all entities with physics bodies
    pub fn get_physics_entities(&self) -> Vec<(EntityId, RigidBodyHandle)> {
        let mut entities = Vec::new();
        
        for (entity, (physics_body,)) in self.world.query::<(&PhysicsBody,)>().iter() {
            if let Some(entity_id) = self.get_entity_id(entity) {
                entities.push((entity_id, physics_body.handle));
            }
        }
        
        entities
    }

    /// Update transform for an entity
    pub fn update_transform(&mut self, entity_id: EntityId, transform: Transform) {
        if let Some(entity) = self.entity_map.get(&entity_id) {
            if let Ok(mut existing_transform) = self.world.get::<&mut Transform>(*entity) {
                *existing_transform = transform;
            }
        }
    }

    /// Get entity ID from Hecs entity
    fn get_entity_id(&self, entity: Entity) -> Option<EntityId> {
        self.entity_map.iter()
            .find(|(_, &e)| e == entity)
            .map(|(&id, _)| id)
    }

    /// Get the number of entities
    pub fn entity_count(&self) -> usize {
        self.world.len() as usize
    }

    /// Get the number of entities with a specific component
    pub fn count_entities_with<T: hecs::Component>(&self) -> usize {
        self.world.query::<&T>().iter().count()
    }

    /// Movement system - updates entity positions based on input
    pub fn movement_system(&mut self, delta_time: f32) {
        let mut updates = Vec::new();
        
        // Collect updates first to avoid borrowing issues
        for (entity, (transform, tank, player)) in self.world.query::<(&Transform, &Tank, &Player)>().iter() {
            let input = &player.input;
            let mut new_transform = *transform;
            
            // Calculate movement
            if input.forward {
                let forward = Vector3::new(0.0, 0.0, 1.0);
                new_transform.position += forward * tank.movement_speed * delta_time;
            }
            if input.backward {
                let backward = Vector3::new(0.0, 0.0, -1.0);
                new_transform.position += backward * tank.movement_speed * delta_time;
            }
            
            // Calculate rotation
            if input.rotate_left {
                // Rotate around Y axis
                let rotation_delta = tank.rotation_speed * delta_time;
                new_transform.rotation *= nalgebra::UnitQuaternion::from_axis_angle(
                    &nalgebra::Vector3::y_axis(),
                    rotation_delta
                );
            }
            if input.rotate_right {
                let rotation_delta = -tank.rotation_speed * delta_time;
                new_transform.rotation *= nalgebra::UnitQuaternion::from_axis_angle(
                    &nalgebra::Vector3::y_axis(),
                    rotation_delta
                );
            }
            
            if let Some(entity_id) = self.get_entity_id(entity) {
                updates.push((entity_id, new_transform));
            }
        }
        
        // Apply updates
        for (entity_id, transform) in updates {
            self.update_transform(entity_id, transform);
        }
    }

    /// Projectile system - updates projectile lifetimes and removes expired ones
    pub fn projectile_system(&mut self, delta_time: f32) -> Vec<EntityId> {
        let mut expired_projectiles = Vec::new();
        let mut entities_to_check = Vec::new();
        
        // First pass: update lifetimes and collect entities to check
        for (entity, (projectile,)) in self.world.query_mut::<(&mut Projectile,)>() {
            projectile.lifetime += delta_time;
            entities_to_check.push((entity, projectile.lifetime >= projectile.max_lifetime));
        }
        
        // Second pass: check for expired projectiles
        for (entity, is_expired) in entities_to_check {
            if is_expired {
                if let Some(entity_id) = self.get_entity_id(entity) {
                    expired_projectiles.push(entity_id);
                }
            }
        }
        
        expired_projectiles
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tokio::time::{timeout, Duration};
    use std::time::Instant;
    use uuid::Uuid;
    use nalgebra::UnitQuaternion;

    #[test]
    fn test_ecs_world_creation() {
        let world = EcsWorld::new();
        assert_eq!(world.entity_count(), 0);
    }

    #[test]
    fn test_player_tank_creation() {
        let mut world = EcsWorld::new();
        let player_id = Uuid::new_v4();
        let transform = Transform::default();
        let physics_handle = RigidBodyHandle::from_raw_parts(0, 0);
        
        let entity_id = world.create_player_tank(
            player_id,
            "TestPlayer".to_string(),
            transform,
            physics_handle,
        );
        
        assert_eq!(world.entity_count(), 1);
        assert_eq!(entity_id, 1);
        
        let players = world.get_players();
        assert_eq!(players.len(), 1);
        assert_eq!(players[0].0, entity_id);
        assert_eq!(players[0].3.player_id, player_id);
    }

    #[test]
    fn test_npc_tank_creation() {
        let mut world = EcsWorld::new();
        let transform = Transform::default();
        let physics_handle = RigidBodyHandle::from_raw_parts(0, 0);
        
        let entity_id = world.create_npc_tank(transform, physics_handle);
        
        assert_eq!(world.entity_count(), 1);
        assert_eq!(entity_id, 1);
        
        let tanks = world.get_tanks();
        assert_eq!(tanks.len(), 1);
        assert_eq!(tanks[0].0, entity_id);
    }

    #[test]
    fn test_projectile_creation() {
        let mut world = EcsWorld::new();
        let transform = Transform::default();
        let projectile = Projectile::default();
        let physics_handle = RigidBodyHandle::from_raw_parts(0, 0);
        
        let entity_id = world.create_projectile(transform, projectile, physics_handle);
        
        assert_eq!(world.entity_count(), 1);
        assert_eq!(entity_id, 1);
        
        let projectiles = world.get_projectiles();
        assert_eq!(projectiles.len(), 1);
        assert_eq!(projectiles[0].0, entity_id);
    }

    #[test]
    fn test_obstacle_creation() {
        let mut world = EcsWorld::new();
        let transform = Transform::default();
        let obstacle = Obstacle::default();
        let physics_handle = RigidBodyHandle::from_raw_parts(0, 0);
        
        let entity_id = world.create_obstacle(transform, obstacle, physics_handle);
        
        assert_eq!(world.entity_count(), 1);
        assert_eq!(entity_id, 1);
    }

    #[test]
    fn test_entity_removal() {
        let mut world = EcsWorld::new();
        let transform = Transform::default();
        let physics_handle = RigidBodyHandle::from_raw_parts(0, 0);
        
        let entity_id = world.create_npc_tank(transform, physics_handle);
        assert_eq!(world.entity_count(), 1);
        
        let removed_handle = world.remove_entity(entity_id);
        assert_eq!(world.entity_count(), 0);
        assert_eq!(removed_handle, Some(physics_handle));
    }

    #[test]
    fn test_player_input_update() {
        let mut world = EcsWorld::new();
        let player_id = Uuid::new_v4();
        let transform = Transform::default();
        let physics_handle = RigidBodyHandle::from_raw_parts(0, 0);
        
        let _entity_id = world.create_player_tank(
            player_id,
            "TestPlayer".to_string(),
            transform,
            physics_handle,
        );
        
        let input = PlayerInput {
            forward: true,
            fire: true,
            turret_angle: 1.57,
            ..Default::default()
        };
        
        world.update_player_input(player_id, input);
        
        let players = world.get_players();
        assert!(players[0].3.input.forward);
        assert!(players[0].3.input.fire);
        assert!((players[0].3.input.turret_angle - 1.57).abs() < f32::EPSILON);
    }

    #[test]
    fn test_movement_system() {
        let mut world = EcsWorld::new();
        let player_id = Uuid::new_v4();
        let transform = Transform::default();
        let physics_handle = RigidBodyHandle::from_raw_parts(0, 0);
        
        let _entity_id = world.create_player_tank(
            player_id,
            "TestPlayer".to_string(),
            transform,
            physics_handle,
        );
        
        // Set input to move forward
        let input = PlayerInput {
            forward: true,
            ..Default::default()
        };
        world.update_player_input(player_id, input);
        
        // Run movement system
        world.movement_system(1.0); // 1 second
        
        let players = world.get_players();
        let new_position = players[0].1.position;
        
        // Should have moved forward (positive Z direction)
        assert!(new_position.z > 0.0);
        assert_eq!(new_position.x, 0.0);
        assert_eq!(new_position.y, 0.0);
    }

    #[test]
    fn test_projectile_system() {
        let mut world = EcsWorld::new();
        let transform = Transform::default();
        let projectile = Projectile {
            max_lifetime: 1.0, // 1 second lifetime
            ..Default::default()
        };
        let physics_handle = RigidBodyHandle::from_raw_parts(0, 0);
        
        let entity_id = world.create_projectile(transform, projectile, physics_handle);
        assert_eq!(world.entity_count(), 1);
        
        // Run projectile system for 0.5 seconds - should not expire
        let expired = world.projectile_system(0.5);
        assert_eq!(expired.len(), 0);
        assert_eq!(world.entity_count(), 1);
        
        // Run projectile system for another 0.6 seconds - should expire
        let expired = world.projectile_system(0.6);
        assert_eq!(expired.len(), 1);
        assert_eq!(expired[0], entity_id);
    }

    #[tokio::test]
    async fn test_ecs_performance_with_timeout() -> Result<(), Box<dyn std::error::Error>> {
        let mut world = EcsWorld::new();
        
        // Create 50 tanks + 200 projectiles as specified in requirements
        for i in 0..50 {
            let player_id = Uuid::new_v4();
            let transform = Transform::default();
            let physics_handle = RigidBodyHandle::from_raw_parts(i, 0);
            
            world.create_player_tank(
                player_id,
                format!("Player{}", i),
                transform,
                physics_handle,
            );
        }
        
        for i in 50..250 {
            let transform = Transform::default();
            let projectile = Projectile::default();
            let physics_handle = RigidBodyHandle::from_raw_parts(i, 0);
            
            world.create_projectile(transform, projectile, physics_handle);
        }
        
        assert_eq!(world.entity_count(), 250);
        
        // Test ECS system performance
        let ecs_operations = async {
            let start = Instant::now();
            
            for _ in 0..100 { // Run systems 100 times
                world.movement_system(1.0 / 30.0); // 30Hz timestep
                world.projectile_system(1.0 / 30.0);
                
                // Query all entities
                let _tanks = world.get_tanks();
                let _projectiles = world.get_projectiles();
                let _physics_entities = world.get_physics_entities();
            }
            
            let duration = start.elapsed();
            assert!(duration < Duration::from_secs(1), 
                "ECS operations took too long: {:?}", duration);
        };
        
        // Ensure operations complete within 5 seconds
        timeout(Duration::from_secs(5), ecs_operations).await?;
        
        Ok(())
    }

    #[test]
    fn test_multiple_entity_types() {
        let mut world = EcsWorld::new();
        
        // Create different types of entities
        let player_id = Uuid::new_v4();
        let _player_tank = world.create_player_tank(
            player_id,
            "Player".to_string(),
            Transform::default(),
            RigidBodyHandle::from_raw_parts(0, 0),
        );
        
        let _npc_tank = world.create_npc_tank(
            Transform::default(),
            RigidBodyHandle::from_raw_parts(1, 0),
        );
        
        let _projectile = world.create_projectile(
            Transform::default(),
            Projectile::default(),
            RigidBodyHandle::from_raw_parts(2, 0),
        );
        
        let _obstacle = world.create_obstacle(
            Transform::default(),
            Obstacle::default(),
            RigidBodyHandle::from_raw_parts(3, 0),
        );
        
        assert_eq!(world.entity_count(), 4);
        
        // Verify entity counts by type
        assert_eq!(world.count_entities_with::<Player>(), 1);
        assert_eq!(world.count_entities_with::<Npc>(), 1);
        assert_eq!(world.count_entities_with::<Tank>(), 2); // Player + NPC
        assert_eq!(world.count_entities_with::<Projectile>(), 1);
        assert_eq!(world.count_entities_with::<Obstacle>(), 1);
    }

    #[tokio::test]
    async fn test_entity_lifecycle_with_timeout() -> Result<(), Box<dyn std::error::Error>> {
        let mut world = EcsWorld::new();
        
        let lifecycle_test = async {
            // Create entity
            let entity_id = world.create_npc_tank(
                Transform::default(),
                RigidBodyHandle::from_raw_parts(0, 0),
            );
            
            assert_eq!(world.entity_count(), 1);
            
            // Update entity
            let new_transform = Transform {
                position: Vector3::new(10.0, 0.0, 10.0),
                rotation: UnitQuaternion::identity(),
            };
            world.update_transform(entity_id, new_transform);
            
            // Verify update
            let tanks = world.get_tanks();
            assert_eq!(tanks.len(), 1);
            assert_eq!(tanks[0].1.position, Vector3::new(10.0, 0.0, 10.0));
            
            // Remove entity
            world.remove_entity(entity_id);
            assert_eq!(world.entity_count(), 0);
        };
        
        // Ensure lifecycle operations complete within 1 second
        timeout(Duration::from_secs(1), lifecycle_test).await?;
        
        Ok(())
    }
} 