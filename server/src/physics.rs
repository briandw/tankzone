use anyhow::Result;
use battletanks_shared::{Config, CollisionGroup};
use nalgebra::{Vector3, Isometry3, Translation3, UnitQuaternion};
use rapier3d::prelude::*;
use std::collections::HashMap;
use tracing::{debug, warn};

/// Physics world wrapper that manages Rapier3D simulation
pub struct PhysicsWorld {
    rigid_body_set: RigidBodySet,
    collider_set: ColliderSet,
    gravity: Vector3<f32>,
    integration_parameters: IntegrationParameters,
    physics_pipeline: PhysicsPipeline,
    island_manager: IslandManager,
    broad_phase: BroadPhase,
    narrow_phase: NarrowPhase,
    impulse_joint_set: ImpulseJointSet,
    multibody_joint_set: MultibodyJointSet,
    ccd_solver: CCDSolver,
    query_pipeline: QueryPipeline,
    physics_hooks: (),
    event_handler: (),
    entity_map: HashMap<RigidBodyHandle, u32>, // Maps physics handles to entity IDs
}

impl PhysicsWorld {
    /// Create a new physics world with the given configuration
    pub fn new(config: &Config) -> Result<Self> {
        let rigid_body_set = RigidBodySet::new();
        let collider_set = ColliderSet::new();
        
        // No gravity for tank game (top-down view)
        let gravity = Vector3::new(0.0, 0.0, 0.0);
        
        let integration_parameters = IntegrationParameters {
            dt: config.server.physics_timestep,
            ..Default::default()
        };
        
        let physics_pipeline = PhysicsPipeline::new();
        let island_manager = IslandManager::new();
        let broad_phase = BroadPhase::new();
        let narrow_phase = NarrowPhase::new();
        let impulse_joint_set = ImpulseJointSet::new();
        let multibody_joint_set = MultibodyJointSet::new();
        let ccd_solver = CCDSolver::new();
        let query_pipeline = QueryPipeline::new();
        
        Ok(Self {
            rigid_body_set,
            collider_set,
            gravity,
            integration_parameters,
            physics_pipeline,
            island_manager,
            broad_phase,
            narrow_phase,
            impulse_joint_set,
            multibody_joint_set,
            ccd_solver,
            query_pipeline,
            physics_hooks: (),
            event_handler: (),
            entity_map: HashMap::new(),
        })
    }

    /// Step the physics simulation forward by one timestep
    pub fn step(&mut self) {
        self.physics_pipeline.step(
            &self.gravity,
            &self.integration_parameters,
            &mut self.island_manager,
            &mut self.broad_phase,
            &mut self.narrow_phase,
            &mut self.rigid_body_set,
            &mut self.collider_set,
            &mut self.impulse_joint_set,
            &mut self.multibody_joint_set,
            &mut self.ccd_solver,
            Some(&mut self.query_pipeline),
            &self.physics_hooks,
            &self.event_handler,
        );
    }

    /// Create a tank rigid body and collider
    pub fn create_tank(&mut self, entity_id: u32, position: Vector3<f32>) -> RigidBodyHandle {
        // Create tank body (dynamic)
        let rigid_body = RigidBodyBuilder::dynamic()
            .translation(position)
            .lock_rotations() // Prevent tilting, only allow Y-axis rotation
            .build();
        
        let body_handle = self.rigid_body_set.insert(rigid_body);
        
        // Create tank collider (box shape)
        let collider = ColliderBuilder::cuboid(1.0, 0.5, 2.0) // width, height, length
            .collision_groups(InteractionGroups::new(
                Group::from_bits_truncate(CollisionGroup::Tank.bits()),
                Group::from_bits_truncate(
                    CollisionGroup::Tank.bits() | 
                    CollisionGroup::Obstacle.bits() | 
                    CollisionGroup::Projectile.bits()
                ),
            ))
            .build();
        
        self.collider_set.insert_with_parent(collider, body_handle, &mut self.rigid_body_set);
        self.entity_map.insert(body_handle, entity_id);
        
        body_handle
    }

    /// Create a projectile rigid body and collider
    pub fn create_projectile(&mut self, entity_id: u32, position: Vector3<f32>, velocity: Vector3<f32>) -> RigidBodyHandle {
        // Create projectile body (kinematic for precise control)
        let rigid_body = RigidBodyBuilder::kinematic_velocity_based()
            .translation(position)
            .linvel(velocity)
            .build();
        
        let body_handle = self.rigid_body_set.insert(rigid_body);
        
        // Create projectile collider (small sphere)
        let collider = ColliderBuilder::ball(0.1)
            .collision_groups(InteractionGroups::new(
                Group::from_bits_truncate(CollisionGroup::Projectile.bits()),
                Group::from_bits_truncate(
                    CollisionGroup::Tank.bits() | 
                    CollisionGroup::Obstacle.bits()
                ),
            ))
            .sensor(true) // Projectiles are sensors (trigger events but don't physically collide)
            .build();
        
        self.collider_set.insert_with_parent(collider, body_handle, &mut self.rigid_body_set);
        self.entity_map.insert(body_handle, entity_id);
        
        body_handle
    }

    /// Create a static obstacle
    pub fn create_obstacle(&mut self, entity_id: u32, position: Vector3<f32>, size: Vector3<f32>) -> RigidBodyHandle {
        // Create obstacle body (static)
        let rigid_body = RigidBodyBuilder::fixed()
            .translation(position)
            .build();
        
        let body_handle = self.rigid_body_set.insert(rigid_body);
        
        // Create obstacle collider
        let collider = ColliderBuilder::cuboid(size.x, size.y, size.z)
            .collision_groups(InteractionGroups::new(
                Group::from_bits_truncate(CollisionGroup::Obstacle.bits()),
                Group::from_bits_truncate(
                    CollisionGroup::Tank.bits() | 
                    CollisionGroup::Projectile.bits()
                ),
            ))
            .build();
        
        self.collider_set.insert_with_parent(collider, body_handle, &mut self.rigid_body_set);
        self.entity_map.insert(body_handle, entity_id);
        
        body_handle
    }

    /// Remove a rigid body and its colliders
    pub fn remove_body(&mut self, handle: RigidBodyHandle) {
        if let Some(body) = self.rigid_body_set.get(handle) {
            // Remove all colliders attached to this body
            let colliders_to_remove: Vec<_> = body.colliders().iter().copied().collect();
            for collider_handle in colliders_to_remove {
                self.collider_set.remove(collider_handle, &mut self.island_manager, &mut self.rigid_body_set, true);
            }
        }
        
        // Remove the rigid body
        self.rigid_body_set.remove(
            handle,
            &mut self.island_manager,
            &mut self.collider_set,
            &mut self.impulse_joint_set,
            &mut self.multibody_joint_set,
            true,
        );
        
        self.entity_map.remove(&handle);
    }

    /// Get the position of a rigid body
    pub fn get_position(&self, handle: RigidBodyHandle) -> Option<Vector3<f32>> {
        self.rigid_body_set.get(handle).map(|body| body.translation().clone())
    }

    /// Set the position of a rigid body
    pub fn set_position(&mut self, handle: RigidBodyHandle, position: Vector3<f32>) {
        if let Some(body) = self.rigid_body_set.get_mut(handle) {
            body.set_translation(position, true);
        }
    }

    /// Set the velocity of a rigid body
    pub fn set_velocity(&mut self, handle: RigidBodyHandle, velocity: Vector3<f32>) {
        if let Some(body) = self.rigid_body_set.get_mut(handle) {
            body.set_linvel(velocity, true);
        }
    }

    /// Get collision events from the last physics step
    pub fn get_collision_events(&self) -> Vec<CollisionEvent> {
        // In a real implementation, you'd collect these during the physics step
        // For now, return empty vector as we're not implementing full collision handling yet
        Vec::new()
    }

    /// Get the number of rigid bodies in the world
    pub fn body_count(&self) -> usize {
        self.rigid_body_set.len()
    }

    /// Get entity ID from rigid body handle
    pub fn get_entity_id(&self, handle: RigidBodyHandle) -> Option<u32> {
        self.entity_map.get(&handle).copied()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tokio::time::{timeout, Duration};
    use std::time::Instant;

    #[test]
    fn test_physics_world_creation() {
        let config = Config::default();
        let physics_world = PhysicsWorld::new(&config);
        assert!(physics_world.is_ok());
        
        let world = physics_world.unwrap();
        assert_eq!(world.body_count(), 0);
    }

    #[test]
    fn test_tank_creation() {
        let config = Config::default();
        let mut world = PhysicsWorld::new(&config).unwrap();
        
        let position = Vector3::new(0.0, 0.0, 0.0);
        let handle = world.create_tank(1, position);
        
        assert_eq!(world.body_count(), 1);
        assert_eq!(world.get_entity_id(handle), Some(1));
        
        let retrieved_pos = world.get_position(handle).unwrap();
        assert!((retrieved_pos - position).magnitude() < f32::EPSILON);
    }

    #[test]
    fn test_projectile_creation() {
        let config = Config::default();
        let mut world = PhysicsWorld::new(&config).unwrap();
        
        let position = Vector3::new(1.0, 0.0, 1.0);
        let velocity = Vector3::new(10.0, 0.0, 0.0);
        let handle = world.create_projectile(2, position, velocity);
        
        assert_eq!(world.body_count(), 1);
        assert_eq!(world.get_entity_id(handle), Some(2));
    }

    #[test]
    fn test_obstacle_creation() {
        let config = Config::default();
        let mut world = PhysicsWorld::new(&config).unwrap();
        
        let position = Vector3::new(5.0, 0.0, 5.0);
        let size = Vector3::new(2.0, 1.0, 2.0);
        let handle = world.create_obstacle(3, position, size);
        
        assert_eq!(world.body_count(), 1);
        assert_eq!(world.get_entity_id(handle), Some(3));
    }

    #[test]
    fn test_body_removal() {
        let config = Config::default();
        let mut world = PhysicsWorld::new(&config).unwrap();
        
        let handle = world.create_tank(1, Vector3::zeros());
        assert_eq!(world.body_count(), 1);
        
        world.remove_body(handle);
        assert_eq!(world.body_count(), 0);
        assert_eq!(world.get_entity_id(handle), None);
    }

    #[test]
    fn test_collision_detection_setup() {
        let config = Config::default();
        let mut world = PhysicsWorld::new(&config).unwrap();
        
        // Create tank and obstacle
        let tank_handle = world.create_tank(1, Vector3::new(0.0, 0.0, 0.0));
        let obstacle_handle = world.create_obstacle(2, Vector3::new(5.0, 0.0, 0.0), Vector3::new(1.0, 1.0, 1.0));
        
        assert_eq!(world.body_count(), 2);
        
        // Move tank towards obstacle
        world.set_position(tank_handle, Vector3::new(3.0, 0.0, 0.0));
        
        // Step physics
        world.step();
        
        // Verify bodies still exist
        assert_eq!(world.body_count(), 2);
    }

    #[tokio::test]
    async fn test_physics_performance_with_timeout() -> Result<()> {
        let config = Config::default();
        let mut world = PhysicsWorld::new(&config)?;
        
        // Create 100 entities as specified in requirements
        for i in 0..100 {
            if i % 2 == 0 {
                world.create_tank(i, Vector3::new(i as f32, 0.0, 0.0));
            } else {
                world.create_projectile(i, Vector3::new(i as f32, 0.0, 0.0), Vector3::new(1.0, 0.0, 0.0));
            }
        }
        
        assert_eq!(world.body_count(), 100);
        
        // Test that physics can maintain 30Hz with 100 entities
        let start = Instant::now();
        let target_duration = Duration::from_secs_f32(1.0 / 30.0); // 33.33ms per step
        
        let physics_step = async {
            for _ in 0..30 { // 30 steps = 1 second at 30Hz
                let step_start = Instant::now();
                world.step();
                let step_duration = step_start.elapsed();
                
                // Each step should complete well under the target duration
                assert!(step_duration < target_duration, 
                    "Physics step took {:?}, should be under {:?}", step_duration, target_duration);
            }
        };
        
        // Ensure the entire test completes within 5 seconds
        timeout(Duration::from_secs(5), physics_step).await?;
        
        let total_duration = start.elapsed();
        assert!(total_duration < Duration::from_secs(2), 
            "Physics simulation took too long: {:?}", total_duration);
        
        Ok(())
    }

    #[test]
    fn test_physics_timestep_configuration() {
        let mut config = Config::default();
        config.server.physics_timestep = 1.0 / 60.0; // 60Hz
        
        let world = PhysicsWorld::new(&config).unwrap();
        assert!((world.integration_parameters.dt - 1.0/60.0).abs() < f32::EPSILON);
    }

    #[tokio::test]
    async fn test_physics_step_with_timeout() -> Result<()> {
        let config = Config::default();
        let mut world = PhysicsWorld::new(&config)?;
        
        // Add some entities
        world.create_tank(1, Vector3::zeros());
        world.create_projectile(2, Vector3::new(1.0, 0.0, 0.0), Vector3::new(5.0, 0.0, 0.0));
        
        // Test that a single physics step completes quickly
        let step_operation = async {
            world.step();
        };
        
        // Physics step should complete within 100ms
        timeout(Duration::from_millis(100), step_operation).await?;
        
        Ok(())
    }

    #[test]
    fn test_multiple_entity_types() {
        let config = Config::default();
        let mut world = PhysicsWorld::new(&config).unwrap();
        
        // Create different types of entities
        let tank1 = world.create_tank(1, Vector3::new(0.0, 0.0, 0.0));
        let tank2 = world.create_tank(2, Vector3::new(10.0, 0.0, 0.0));
        let projectile = world.create_projectile(3, Vector3::new(5.0, 0.0, 0.0), Vector3::new(1.0, 0.0, 0.0));
        let obstacle = world.create_obstacle(4, Vector3::new(15.0, 0.0, 0.0), Vector3::new(2.0, 2.0, 2.0));
        
        assert_eq!(world.body_count(), 4);
        
        // Verify all entities have correct IDs
        assert_eq!(world.get_entity_id(tank1), Some(1));
        assert_eq!(world.get_entity_id(tank2), Some(2));
        assert_eq!(world.get_entity_id(projectile), Some(3));
        assert_eq!(world.get_entity_id(obstacle), Some(4));
    }
} 