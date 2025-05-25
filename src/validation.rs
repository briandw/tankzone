//! Message validation utilities for Battlezone server
//! 
//! This module provides validation functions for client and server messages
//! to ensure data integrity and catch protocol errors early.

use serde_json;
use std::collections::HashMap;
use tracing::{warn, error};
use uuid::Uuid;

use crate::network::messages::{ClientMessage, ServerMessage};
use crate::game::{Player, Enemy, Bullet};

/// Validation result with detailed error information
#[derive(Debug, Clone)]
pub struct ValidationResult {
    pub valid: bool,
    pub errors: Vec<String>,
    pub warnings: Vec<String>,
}

impl ValidationResult {
    pub fn success() -> Self {
        Self {
            valid: true,
            errors: vec![],
            warnings: vec![],
        }
    }
    
    pub fn error(message: String) -> Self {
        Self {
            valid: false,
            errors: vec![message],
            warnings: vec![],
        }
    }
    
    pub fn with_warning(mut self, warning: String) -> Self {
        self.warnings.push(warning);
        self
    }
    
    pub fn add_error(&mut self, error: String) {
        self.valid = false;
        self.errors.push(error);
    }
    
    pub fn add_warning(&mut self, warning: String) {
        self.warnings.push(warning);
    }
}

/// Client message validator
pub struct ClientMessageValidator {
    /// Track message frequency to detect spam
    player_message_counts: HashMap<String, u32>,
    /// Maximum messages per second per player
    max_messages_per_second: u32,
}

impl ClientMessageValidator {
    pub fn new() -> Self {
        Self {
            player_message_counts: HashMap::new(),
            max_messages_per_second: 60, // Allow up to 60 messages per second (for 60fps input)
        }
    }
    
    /// Validate a client message from a specific player
    pub fn validate(&mut self, player_id: &str, message: &ClientMessage) -> ValidationResult {
        let mut result = ValidationResult::success();
        
        // Rate limiting check
        if let Err(rate_limit_error) = self.check_rate_limit(player_id) {
            result.add_error(rate_limit_error);
            return result;
        }
        
        // Message-specific validation
        match message {
            ClientMessage::PlayerInput { forward, backward, strafe_left, strafe_right, mouse_x, mouse_y } => {
                self.validate_player_input(*forward, *backward, *strafe_left, *strafe_right, *mouse_x, *mouse_y, &mut result);
            }
            ClientMessage::FireCommand {} => {
                // Fire command validation (could add cooldown checking here)
            }
            ClientMessage::ChatMessage { message } => {
                self.validate_chat_message(message, &mut result);
            }
            ClientMessage::PlayerUpdate { position, rotation, turret_rotation } => {
                self.validate_position_update(position, rotation, turret_rotation, &mut result);
                result.add_warning("Using deprecated PlayerUpdate message".to_string());
            }
            ClientMessage::BulletFired { position, velocity } => {
                self.validate_bullet_fired(position, velocity, &mut result);
                result.add_warning("Using deprecated BulletFired message".to_string());
            }
            ClientMessage::BulletHit { bullet_id, target_player_id, damage } => {
                self.validate_bullet_hit(bullet_id, target_player_id, *damage, &mut result);
                result.add_warning("Using deprecated BulletHit message".to_string());
            }
            ClientMessage::Ping => {
                // Ping is always valid
            }
        }
        
        // Log warnings
        for warning in &result.warnings {
            warn!("Message validation warning from {}: {}", player_id, warning);
        }
        
        // Log errors
        for error in &result.errors {
            error!("Message validation error from {}: {}", player_id, error);
        }
        
        result
    }
    
    fn check_rate_limit(&mut self, player_id: &str) -> Result<(), String> {
        let count = self.player_message_counts.entry(player_id.to_string()).or_insert(0);
        *count += 1;
        
        if *count > self.max_messages_per_second {
            Err(format!("Rate limit exceeded: {} messages/second", count))
        } else {
            Ok(())
        }
    }
    
    /// Reset rate limiting counters (call this every second)
    pub fn reset_rate_limits(&mut self) {
        self.player_message_counts.clear();
    }
    
    fn validate_player_input(&self, forward: bool, backward: bool, strafe_left: bool, strafe_right: bool, mouse_x: f32, mouse_y: f32, result: &mut ValidationResult) {
        // Check for conflicting movement commands
        if forward && backward {
            result.add_warning("Both forward and backward pressed simultaneously".to_string());
        }
        if strafe_left && strafe_right {
            result.add_warning("Both strafe_left and strafe_right pressed simultaneously".to_string());
        }
        
        // Validate mouse input ranges (reasonable limits for gameplay)
        if mouse_x.abs() > 100.0 {
            result.add_error(format!("Mouse X out of reasonable range: {}", mouse_x));
        }
        if mouse_y.abs() > 100.0 {
            result.add_error(format!("Mouse Y out of reasonable range: {}", mouse_y));
        }
        
        // Check for NaN or infinite values
        if !mouse_x.is_finite() {
            result.add_error(format!("Mouse X is not finite: {}", mouse_x));
        }
        if !mouse_y.is_finite() {
            result.add_error(format!("Mouse Y is not finite: {}", mouse_y));
        }
    }
    
    fn validate_chat_message(&self, message: &str, result: &mut ValidationResult) {
        if message.is_empty() {
            result.add_error("Chat message cannot be empty".to_string());
        }
        if message.len() > 500 {
            result.add_error(format!("Chat message too long: {} characters", message.len()));
        }
        if message.chars().any(|c| c.is_control() && c != '\n' && c != '\t') {
            result.add_warning("Chat message contains control characters".to_string());
        }
    }
    
    fn validate_position_update(&self, position: &[f32; 3], rotation: &[f32; 3], turret_rotation: &[f32; 3], result: &mut ValidationResult) {
        // Validate position is within world bounds
        const WORLD_BOUNDS: f32 = 1000.0;
        for (i, &coord) in position.iter().enumerate() {
            if !coord.is_finite() {
                result.add_error(format!("Position[{}] is not finite: {}", i, coord));
            }
            if coord.abs() > WORLD_BOUNDS {
                result.add_error(format!("Position[{}] out of world bounds: {}", i, coord));
            }
        }
        
        // Validate rotations are reasonable
        for (i, &rot) in rotation.iter().enumerate() {
            if !rot.is_finite() {
                result.add_error(format!("Rotation[{}] is not finite: {}", i, rot));
            }
        }
        
        for (i, &rot) in turret_rotation.iter().enumerate() {
            if !rot.is_finite() {
                result.add_error(format!("Turret rotation[{}] is not finite: {}", i, rot));
            }
        }
    }
    
    fn validate_bullet_fired(&self, position: &[f32; 3], velocity: &[f32; 3], result: &mut ValidationResult) {
        // Validate bullet position
        for (i, &coord) in position.iter().enumerate() {
            if !coord.is_finite() {
                result.add_error(format!("Bullet position[{}] is not finite: {}", i, coord));
            }
        }
        
        // Validate bullet velocity
        let speed_squared: f32 = velocity.iter().map(|v| v * v).sum();
        let speed = speed_squared.sqrt();
        
        if !speed.is_finite() {
            result.add_error("Bullet velocity is not finite".to_string());
        } else if speed > 200.0 {
            result.add_error(format!("Bullet speed too high: {}", speed));
        } else if speed < 1.0 {
            result.add_warning(format!("Bullet speed very low: {}", speed));
        }
    }
    
    fn validate_bullet_hit(&self, bullet_id: &Uuid, target_player_id: &str, damage: u32, result: &mut ValidationResult) {
        if target_player_id.is_empty() {
            result.add_error("Target player ID cannot be empty".to_string());
        }
        
        if damage == 0 {
            result.add_warning("Bullet hit with 0 damage".to_string());
        } else if damage > 100 {
            result.add_error(format!("Damage too high: {}", damage));
        }
    }
}

/// Server message validator
pub struct ServerMessageValidator;

impl ServerMessageValidator {
    pub fn new() -> Self {
        Self
    }
    
    /// Validate a server message before broadcasting
    pub fn validate(&self, message: &ServerMessage) -> ValidationResult {
        let mut result = ValidationResult::success();
        
        match message {
            ServerMessage::PlayerMoved { player_id, position, rotation, turret_rotation } => {
                self.validate_player_moved(player_id, position, rotation, turret_rotation, &mut result);
            }
            ServerMessage::BulletSpawned { bullet } => {
                self.validate_bullet_spawned(bullet, &mut result);
            }
            ServerMessage::GameStateUpdate { players, enemies } => {
                self.validate_game_state_update(players, enemies, &mut result);
            }
            ServerMessage::PlayerJoined { player } => {
                self.validate_player_joined(player, &mut result);
            }
            ServerMessage::ChatMessage { player_id, message, timestamp } => {
                self.validate_chat_message_broadcast(player_id, message, *timestamp, &mut result);
            }
            ServerMessage::EnemySpawned { enemy } => {
                self.validate_enemy_spawned(enemy, &mut result);
            }
            ServerMessage::EnemyMoved { enemy_id, position, rotation } => {
                self.validate_enemy_moved(enemy_id, position, rotation, &mut result);
            }
            ServerMessage::EnemyHit { enemy_id, bullet_id, damage, new_health } => {
                self.validate_enemy_hit(enemy_id, bullet_id, *damage, *new_health, &mut result);
            }
            _ => {
                // Other messages are considered valid by default
            }
        }
        
        // Log validation errors
        for error in &result.errors {
            error!("Server message validation error: {}", error);
        }
        
        result
    }
    
    fn validate_player_moved(&self, player_id: &str, position: &[f32; 3], rotation: &[f32; 3], turret_rotation: &[f32; 3], result: &mut ValidationResult) {
        if player_id.is_empty() {
            result.add_error("Player ID cannot be empty".to_string());
        }
        
        // Validate position
        for (i, &coord) in position.iter().enumerate() {
            if !coord.is_finite() {
                result.add_error(format!("Player position[{}] is not finite: {}", i, coord));
            }
        }
        
        // Validate rotations
        for (i, &rot) in rotation.iter().enumerate() {
            if !rot.is_finite() {
                result.add_error(format!("Player rotation[{}] is not finite: {}", i, rot));
            }
        }
        
        for (i, &rot) in turret_rotation.iter().enumerate() {
            if !rot.is_finite() {
                result.add_error(format!("Player turret rotation[{}] is not finite: {}", i, rot));
            }
        }
    }
    
    fn validate_bullet_spawned(&self, bullet: &Bullet, result: &mut ValidationResult) {
        if bullet.player_id.is_empty() {
            result.add_error("Bullet player_id cannot be empty".to_string());
        }
        
        for (i, &coord) in bullet.position.iter().enumerate() {
            if !coord.is_finite() {
                result.add_error(format!("Bullet position[{}] is not finite: {}", i, coord));
            }
        }
        
        for (i, &vel) in bullet.velocity.iter().enumerate() {
            if !vel.is_finite() {
                result.add_error(format!("Bullet velocity[{}] is not finite: {}", i, vel));
            }
        }
    }
    
    fn validate_game_state_update(&self, players: &[Player], enemies: &[Enemy], result: &mut ValidationResult) {
        // Validate all players
        for (i, player) in players.iter().enumerate() {
            if player.id.is_empty() {
                result.add_error(format!("Player[{}] has empty ID", i));
            }
            
            if player.health > 100 {
                result.add_error(format!("Player[{}] health out of range: {}", i, player.health));
            }
            
            for (j, &coord) in player.position.iter().enumerate() {
                if !coord.is_finite() {
                    result.add_error(format!("Player[{}] position[{}] is not finite: {}", i, j, coord));
                }
            }
        }
        
        // Validate all enemies
        for (i, enemy) in enemies.iter().enumerate() {
            if enemy.health > enemy.max_health {
                result.add_error(format!("Enemy[{}] health {} exceeds max_health {}", i, enemy.health, enemy.max_health));
            }
            
            for (j, &coord) in enemy.position.iter().enumerate() {
                if !coord.is_finite() {
                    result.add_error(format!("Enemy[{}] position[{}] is not finite: {}", i, j, coord));
                }
            }
        }
    }
    
    fn validate_player_joined(&self, player: &Player, result: &mut ValidationResult) {
        if player.id.is_empty() {
            result.add_error("Joined player has empty ID".to_string());
        }
        
        if player.health > 100 {
            result.add_error(format!("Joined player health out of range: {}", player.health));
        }
    }
    
    fn validate_chat_message_broadcast(&self, player_id: &str, message: &str, timestamp: u64, result: &mut ValidationResult) {
        if player_id.is_empty() {
            result.add_error("Chat message player_id cannot be empty".to_string());
        }
        
        if message.is_empty() {
            result.add_error("Chat message cannot be empty".to_string());
        }
        
        if timestamp == 0 {
            result.add_warning("Chat message has zero timestamp".to_string());
        }
    }
    
    fn validate_enemy_spawned(&self, enemy: &Enemy, result: &mut ValidationResult) {
        if enemy.health > enemy.max_health {
            result.add_error(format!("Enemy health {} exceeds max_health {}", enemy.health, enemy.max_health));
        }
        
        if enemy.max_health == 0 {
            result.add_error("Enemy max_health cannot be zero".to_string());
        }
    }
    
    fn validate_enemy_moved(&self, enemy_id: &Uuid, position: &[f32; 3], rotation: &[f32; 3], result: &mut ValidationResult) {
        for (i, &coord) in position.iter().enumerate() {
            if !coord.is_finite() {
                result.add_error(format!("Enemy position[{}] is not finite: {}", i, coord));
            }
        }
        
        for (i, &rot) in rotation.iter().enumerate() {
            if !rot.is_finite() {
                result.add_error(format!("Enemy rotation[{}] is not finite: {}", i, rot));
            }
        }
    }
    
    fn validate_enemy_hit(&self, enemy_id: &Uuid, bullet_id: &Uuid, damage: u32, new_health: u32, result: &mut ValidationResult) {
        if damage == 0 {
            result.add_warning("Enemy hit with 0 damage".to_string());
        }
        
        if damage > 100 {
            result.add_error(format!("Enemy damage too high: {}", damage));
        }
    }
}

/// Global validation configuration
pub struct ValidationConfig {
    pub enable_client_validation: bool,
    pub enable_server_validation: bool,
    pub strict_mode: bool, // If true, reject messages with warnings
}

impl Default for ValidationConfig {
    fn default() -> Self {
        Self {
            enable_client_validation: true,
            enable_server_validation: true,
            strict_mode: false, // Allow warnings by default
        }
    }
} 