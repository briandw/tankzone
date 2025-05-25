use super::Player;
use rapier3d::prelude::*;
use rapier3d::na::{Vector3, Point3};
use std::collections::HashMap;
use uuid::Uuid;

/// Configuration constants for physics simulation
pub struct PhysicsConfig {
    pub tank_speed: f32,
    pub world_bounds: f32,
    pub delta_time: f32,
}

impl Default for PhysicsConfig {
    fn default() -> Self {
        Self {
            tank_speed: 1.0,
            world_bounds: 80.0,
            delta_time: 0.1, // 100ms between updates
        }
    }
}

// Note: The old PlayerInput and simulate_player_movement functions have been removed
// as they were replaced by the TankInput system and Rapier physics

/// Validate that a position is within world bounds
pub fn is_position_valid(position: [f32; 3], bounds: f32) -> bool {
    position[0].abs() <= bounds && 
    position[2].abs() <= bounds &&
    position[1] >= 0.0 && 
    position[1] <= bounds
}

/// Physics world wrapper that manages all game physics
pub struct PhysicsWorld {
    /// Rapier rigid body set
    pub rigid_bodies: RigidBodySet,
    /// Rapier collider set  
    pub colliders: ColliderSet,
    /// Integration parameters for physics stepping
    pub integration_parameters: IntegrationParameters,
    /// Physics pipeline for simulation
    pub pipeline: PhysicsPipeline,
    /// Island manager for performance optimization
    pub island_manager: IslandManager,
    /// Broad phase collision detection
    pub broad_phase: DefaultBroadPhase,
    /// Narrow phase collision detection
    pub narrow_phase: NarrowPhase,
    /// Joint set for constraints
    pub impulse_joint_set: ImpulseJointSet,
    pub multibody_joint_set: MultibodyJointSet,
    /// CCD solver for fast-moving objects
    pub ccd_solver: CCDSolver,
    /// Query pipeline for raycasting
    pub query_pipeline: QueryPipeline,
    /// Gravity vector
    pub gravity: Vector3<Real>,
    /// Player ID to rigid body handle mapping
    pub player_bodies: HashMap<String, RigidBodyHandle>,
    /// Bullet ID to rigid body handle mapping
    pub bullet_bodies: HashMap<Uuid, RigidBodyHandle>,
    /// Enemy ID to rigid body handle mapping
    pub enemy_bodies: HashMap<Uuid, RigidBodyHandle>,
}

impl Default for PhysicsWorld {
    fn default() -> Self {
        Self {
            rigid_bodies: RigidBodySet::new(),
            colliders: ColliderSet::new(),
            integration_parameters: IntegrationParameters::default(),
            pipeline: PhysicsPipeline::new(),
            island_manager: IslandManager::new(),
            broad_phase: DefaultBroadPhase::new(),
            narrow_phase: NarrowPhase::new(),
            impulse_joint_set: ImpulseJointSet::new(),
            multibody_joint_set: MultibodyJointSet::new(),
            ccd_solver: CCDSolver::new(),
            query_pipeline: QueryPipeline::new(),
            gravity: Vector3::new(0.0, -9.81, 0.0), // Standard gravity
            player_bodies: HashMap::new(),
            bullet_bodies: HashMap::new(),
            enemy_bodies: HashMap::new(),
        }
    }
}

impl PhysicsWorld {
    pub fn new() -> Self {
        let mut world = Self::default();
        
        // Create static ground plane
        let ground_collider = ColliderBuilder::cuboid(100.0, 0.1, 100.0)
            .translation(Vector3::new(0.0, -0.1, 0.0))
            .friction(0.8)
            .restitution(0.1)
            .build();
        world.colliders.insert(ground_collider);
        
        // Create invisible world boundaries
        world.create_world_boundaries();
        
        world
    }
    
    fn create_world_boundaries(&mut self) {
        let boundary_size = 100.0;
        let wall_thickness = 1.0;
        let wall_height = 10.0;
        
        // Create walls around the world
        let walls = [
            // North wall
            (Vector3::new(0.0, wall_height/2.0, boundary_size), Vector3::new(boundary_size, wall_height, wall_thickness)),
            // South wall  
            (Vector3::new(0.0, wall_height/2.0, -boundary_size), Vector3::new(boundary_size, wall_height, wall_thickness)),
            // East wall
            (Vector3::new(boundary_size, wall_height/2.0, 0.0), Vector3::new(wall_thickness, wall_height, boundary_size)),
            // West wall
            (Vector3::new(-boundary_size, wall_height/2.0, 0.0), Vector3::new(wall_thickness, wall_height, boundary_size)),
        ];
        
        for (position, size) in walls {
            let wall_collider = ColliderBuilder::cuboid(size.x, size.y, size.z)
                .translation(position)
                .friction(0.3)
                .restitution(0.2)
                .build();
            self.colliders.insert(wall_collider);
        }
    }
    
    /// Step the physics simulation forward by one frame
    pub fn step(&mut self) {
        self.pipeline.step(
            &self.gravity,
            &self.integration_parameters,
            &mut self.island_manager,
            &mut self.broad_phase,
            &mut self.narrow_phase,
            &mut self.rigid_bodies,
            &mut self.colliders,
            &mut self.impulse_joint_set,
            &mut self.multibody_joint_set,
            &mut self.ccd_solver,
            Some(&mut self.query_pipeline),
            &(),
            &(),
        );
    }
    
    /// Add a tank (player) to the physics world
    pub fn add_tank(&mut self, player_id: String, position: [f32; 3]) -> RigidBodyHandle {
        // Create tank chassis as a compound rigid body
        let tank_body = RigidBodyBuilder::dynamic()
            .translation(Vector3::new(position[0], position[1], position[2]))
            .linear_damping(2.0) // Prevent sliding
            .angular_damping(5.0) // Prevent spinning
            .build();
        
        let tank_handle = self.rigid_bodies.insert(tank_body);
        
        // Tank chassis collider (main body) - use density to set mass
        let chassis_collider = ColliderBuilder::cuboid(1.25, 0.5, 2.0) // Half-extents: 2.5x1x4 tank
            .density(1000.0) // kg/m³ - will create heavy tank
            .friction(0.8)
            .restitution(0.1)
            .active_collision_types(ActiveCollisionTypes::all())
            .build();
        
        self.colliders.insert_with_parent(chassis_collider, tank_handle, &mut self.rigid_bodies);
        
        // Track position collider (for more realistic ground contact)
        let track_collider = ColliderBuilder::cuboid(1.4, 0.3, 2.1)
            .translation(Vector3::new(0.0, -0.4, 0.0))
            .density(500.0)
            .friction(1.2) // High friction for tracks
            .restitution(0.0)
            .build();
        
        self.colliders.insert_with_parent(track_collider, tank_handle, &mut self.rigid_bodies);
        
        self.player_bodies.insert(player_id, tank_handle);
        tank_handle
    }
    
    /// Apply tank movement forces based on input
    pub fn apply_tank_input(&mut self, player_id: &str, input: &TankInput) {
        if let Some(&tank_handle) = self.player_bodies.get(player_id) {
            if let Some(tank_body) = self.rigid_bodies.get_mut(tank_handle) {
                
                // Calculate movement forces based on tank orientation and input
                let tank_rotation = tank_body.rotation();
                let forward_dir = tank_rotation * Vector3::z_axis(); // Tank's forward direction
                
                let mut force = Vector3::zeros();
                let tank_power = 8000.0; // Increased force for better responsiveness
                
                // Apply forward/backward movement
                if input.forward {
                    force += forward_dir.scale(tank_power);
                }
                if input.backward {
                    force -= forward_dir.scale(tank_power * 0.7); // Reverse is slower
                }
                
                // Apply the movement force
                tank_body.add_force(force, true);
                
                // Apply turning torque - tanks turn by rotating in place
                let turn_power = 3000.0; // Increased turning force
                if input.turn_left {
                    tank_body.add_torque(Vector3::new(0.0, turn_power, 0.0), true);
                }
                if input.turn_right {
                    tank_body.add_torque(Vector3::new(0.0, -turn_power, 0.0), true);
                }
                
                // For realistic tank movement, also allow combined movement+turning
                // This simulates tank tracks working at different speeds
                if input.forward && input.turn_left {
                    tank_body.add_torque(Vector3::new(0.0, turn_power * 0.5, 0.0), true);
                }
                if input.forward && input.turn_right {
                    tank_body.add_torque(Vector3::new(0.0, -turn_power * 0.5, 0.0), true);
                }
                if input.backward && input.turn_left {
                    tank_body.add_torque(Vector3::new(0.0, -turn_power * 0.3, 0.0), true);
                }
                if input.backward && input.turn_right {
                    tank_body.add_torque(Vector3::new(0.0, turn_power * 0.3, 0.0), true);
                }
                
                // Limit maximum speed
                let max_speed = 12.0; // Slightly reduced for better control
                if tank_body.linvel().magnitude() > max_speed {
                    let normalized_vel = tank_body.linvel().normalize();
                    tank_body.set_linvel(normalized_vel * max_speed, true);
                }
                
                // Limit maximum angular velocity for realistic turning
                let max_angular_speed = 2.0; // radians per second
                if tank_body.angvel().magnitude() > max_angular_speed {
                    let normalized_angvel = tank_body.angvel().normalize();
                    tank_body.set_angvel(normalized_angvel * max_angular_speed, true);
                }
            }
        }
    }
    
    /// Add a bullet to the physics world
    pub fn add_bullet(&mut self, bullet_id: Uuid, position: [f32; 3], velocity: [f32; 3]) -> RigidBodyHandle {
        let bullet_body = RigidBodyBuilder::dynamic()
            .translation(Vector3::new(position[0], position[1], position[2]))
            .linvel(Vector3::new(velocity[0], velocity[1], velocity[2]))
            .ccd_enabled(true) // Enable CCD for fast-moving bullets
            .build();
        
        let bullet_handle = self.rigid_bodies.insert(bullet_body);
        
        // Small sphere collider for bullet - use density instead of mass
        let bullet_collider = ColliderBuilder::ball(0.05) // 5cm radius
            .density(7800.0) // Steel density - will create light bullet due to small size
            .restitution(0.3)
            .friction(0.1)
            .active_collision_types(ActiveCollisionTypes::all())
            .build();
        
        self.colliders.insert_with_parent(bullet_collider, bullet_handle, &mut self.rigid_bodies);
        
        self.bullet_bodies.insert(bullet_id, bullet_handle);
        bullet_handle
    }
    
    /// Add an enemy tank to the physics world
    pub fn add_enemy(&mut self, enemy_id: Uuid, position: [f32; 3]) -> RigidBodyHandle {
        let enemy_body = RigidBodyBuilder::dynamic()
            .translation(Vector3::new(position[0], position[1], position[2]))
            .linear_damping(2.5)
            .angular_damping(6.0)
            .build();
        
        let enemy_handle = self.rigid_bodies.insert(enemy_body);
        
        // Enemy tank collider (slightly smaller than player) - use density for mass
        let enemy_collider = ColliderBuilder::cuboid(1.0, 0.4, 1.5)
            .density(900.0) // Slightly lighter than player tank
            .friction(0.7)
            .restitution(0.1)
            .active_collision_types(ActiveCollisionTypes::all())
            .build();
        
        self.colliders.insert_with_parent(enemy_collider, enemy_handle, &mut self.rigid_bodies);
        
        self.enemy_bodies.insert(enemy_id, enemy_handle);
        enemy_handle
    }
    
    /// Get position and rotation of a rigid body
    pub fn get_body_transform(&self, handle: RigidBodyHandle) -> Option<([f32; 3], [f32; 3])> {
        if let Some(body) = self.rigid_bodies.get(handle) {
            let position = body.translation();
            let rotation = body.rotation().euler_angles();
            Some(
                ([position.x, position.y, position.z], 
                 [rotation.0, rotation.1, rotation.2])
            )
        } else {
            None
        }
    }
    
    /// Remove a rigid body from the world
    pub fn remove_body(&mut self, handle: RigidBodyHandle) {
        self.rigid_bodies.remove(
            handle, 
            &mut self.island_manager,
            &mut self.colliders,
            &mut self.impulse_joint_set,
            &mut self.multibody_joint_set,
            true
        );
    }
    
    /// Remove a player from physics world
    pub fn remove_player(&mut self, player_id: &str) {
        if let Some(handle) = self.player_bodies.remove(player_id) {
            self.remove_body(handle);
        }
    }
    
    /// Remove a bullet from physics world  
    pub fn remove_bullet(&mut self, bullet_id: Uuid) {
        if let Some(handle) = self.bullet_bodies.remove(&bullet_id) {
            self.remove_body(handle);
        }
    }
    
    /// Remove an enemy from physics world
    pub fn remove_enemy(&mut self, enemy_id: Uuid) {
        if let Some(handle) = self.enemy_bodies.remove(&enemy_id) {
            self.remove_body(handle);
        }
    }
    
    /// Get all collision events from this physics step
    pub fn get_collision_events(&self) -> Vec<CollisionEvent> {
        // In a real implementation, you'd use event collectors
        // For now, return empty vec - we'll implement collision handling separately
        Vec::new()
    }
    
    /// Raycast from position in direction, returns hit info
    pub fn raycast(&self, origin: Vector3<Real>, direction: Vector3<Real>, max_distance: Real) -> Option<(ColliderHandle, Real)> {
        let ray = Ray::new(Point3::from(origin), direction);
        
        if let Some((handle, toi)) = self.query_pipeline.cast_ray(
            &self.rigid_bodies,
            &self.colliders,
            &ray,
            max_distance,
            true,
            QueryFilter::default()
        ) {
            Some((handle, toi))
        } else {
            None
        }
    }
}

/// Tank input commands from client
#[derive(Debug, Clone, Default)]
pub struct TankInput {
    pub forward: bool,
    pub backward: bool,
    pub strafe_left: bool,
    pub strafe_right: bool,
    pub turn_left: bool,
    pub turn_right: bool,
    pub turret_yaw: f32,    // Horizontal turret rotation (radians)
    pub turret_pitch: f32,  // Vertical turret rotation (radians)
}

/// Convert client input to tank input
impl From<crate::network::messages::PlayerInput> for TankInput {
    fn from(input: crate::network::messages::PlayerInput) -> Self {
        Self {
            forward: input.forward,
            backward: input.backward,
            strafe_left: input.strafe_left,
            strafe_right: input.strafe_right,
            // Convert strafe to tank turning for more realistic tank movement
            turn_left: input.strafe_left,
            turn_right: input.strafe_right,
            turret_yaw: input.mouse_x,
            turret_pitch: input.mouse_y,
        }
    }
}

/// Calculate bullet trajectory from tank position and turret rotation
pub fn calculate_bullet_trajectory(
    tank_position: [f32; 3], 
    tank_rotation: [f32; 3],
    turret_yaw: f32, 
    turret_pitch: f32
) -> ([f32; 3], [f32; 3]) {
    // Calculate absolute turret direction (tank rotation + turret offset)
    let total_yaw = tank_rotation[1] + turret_yaw;
    let pitch = turret_pitch.clamp(-std::f32::consts::PI / 4.0, std::f32::consts::PI / 6.0);
    
    // Calculate barrel tip position (3 meters forward from tank center, 1.5m up for turret)
    let barrel_length = 3.0;
    let turret_height = 1.5;
    
    let barrel_tip = [
        tank_position[0] + total_yaw.sin() * barrel_length,
        tank_position[1] + turret_height - pitch.sin() * barrel_length,
        tank_position[2] + total_yaw.cos() * barrel_length,
    ];
    
    // Calculate bullet velocity (high speed projectile)
    let bullet_speed = 100.0; // m/s - tank cannon
    let velocity = [
        total_yaw.sin() * pitch.cos() * bullet_speed,
        -pitch.sin() * bullet_speed, // Negative because positive pitch aims down
        total_yaw.cos() * pitch.cos() * bullet_speed,
    ];
    
    (barrel_tip, velocity)
} 