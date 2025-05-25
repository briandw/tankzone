use battlezone_server::validation::{ClientMessageValidator, ServerMessageValidator, ValidationResult};
use battlezone_server::network::messages::{ClientMessage, ServerMessage};
use battlezone_server::game::{Player, Enemy, Bullet};
use uuid::Uuid;

#[cfg(test)]
mod schema_validation_tests {
    use super::*;
    
    #[test]
    fn test_valid_client_messages() {
        let mut validator = ClientMessageValidator::new();
        let player_id = "test_player";
        
        // Valid PlayerInput message
        let valid_input = ClientMessage::PlayerInput {
            forward: true,
            backward: false,
            strafe_left: false,
            strafe_right: true,
            mouse_x: 1.5,
            mouse_y: -0.3,
        };
        
        let result = validator.validate(player_id, &valid_input);
        assert!(result.valid, "Valid PlayerInput should pass validation: {:?}", result.errors);
        
        // Valid FireCommand message
        let valid_fire = ClientMessage::FireCommand {};
        let result = validator.validate(player_id, &valid_fire);
        assert!(result.valid, "Valid FireCommand should pass validation: {:?}", result.errors);
        
        // Valid ChatMessage
        let valid_chat = ClientMessage::ChatMessage {
            message: "Hello world!".to_string(),
        };
        let result = validator.validate(player_id, &valid_chat);
        assert!(result.valid, "Valid ChatMessage should pass validation: {:?}", result.errors);
        
        // Valid Ping
        let valid_ping = ClientMessage::Ping;
        let result = validator.validate(player_id, &valid_ping);
        assert!(result.valid, "Valid Ping should pass validation: {:?}", result.errors);
    }
    
    #[test]
    fn test_invalid_client_messages() {
        let mut validator = ClientMessageValidator::new();
        let player_id = "test_player";
        
        // Invalid PlayerInput with NaN mouse values
        let invalid_input = ClientMessage::PlayerInput {
            forward: true,
            backward: false,
            strafe_left: false,
            strafe_right: false,
            mouse_x: f32::NAN,
            mouse_y: f32::INFINITY,
        };
        
        let result = validator.validate(player_id, &invalid_input);
        assert!(!result.valid, "PlayerInput with NaN values should fail validation");
        assert!(result.errors.iter().any(|e| e.contains("not finite")));
        
        // Invalid ChatMessage - empty
        let invalid_chat = ClientMessage::ChatMessage {
            message: "".to_string(),
        };
        let result = validator.validate(player_id, &invalid_chat);
        assert!(!result.valid, "Empty ChatMessage should fail validation");
        assert!(result.errors.iter().any(|e| e.contains("cannot be empty")));
        
        // Invalid ChatMessage - too long
        let long_message = "a".repeat(501);
        let invalid_chat_long = ClientMessage::ChatMessage {
            message: long_message,
        };
        let result = validator.validate(player_id, &invalid_chat_long);
        assert!(!result.valid, "Too long ChatMessage should fail validation");
        assert!(result.errors.iter().any(|e| e.contains("too long")));
    }
    
    #[test]
    fn test_client_message_warnings() {
        let mut validator = ClientMessageValidator::new();
        let player_id = "test_player";
        
        // PlayerInput with conflicting movement
        let conflicting_input = ClientMessage::PlayerInput {
            forward: true,
            backward: true, // Conflict!
            strafe_left: true,
            strafe_right: true, // Another conflict!
            mouse_x: 0.0,
            mouse_y: 0.0,
        };
        
        let result = validator.validate(player_id, &conflicting_input);
        assert!(result.valid, "Conflicting input should be valid but with warnings");
        assert!(!result.warnings.is_empty(), "Should have warnings for conflicting input");
        assert!(result.warnings.iter().any(|w| w.contains("forward and backward")));
        assert!(result.warnings.iter().any(|w| w.contains("strafe_left and strafe_right")));
        
        // Deprecated message types should produce warnings
        let deprecated_update = ClientMessage::PlayerUpdate {
            position: [0.0, 0.5, 0.0],
            rotation: [0.0, 0.0, 0.0],
            turret_rotation: [0.0, 1.0, 0.0],
        };
        
        let result = validator.validate(player_id, &deprecated_update);
        assert!(result.valid, "Deprecated PlayerUpdate should be valid");
        assert!(result.warnings.iter().any(|w| w.contains("deprecated")));
    }
    
    #[test]
    fn test_rate_limiting() {
        let mut validator = ClientMessageValidator::new();
        let player_id = "spam_player";
        
        let input_msg = ClientMessage::PlayerInput {
            forward: true,
            backward: false,
            strafe_left: false,
            strafe_right: false,
            mouse_x: 0.0,
            mouse_y: 0.0,
        };
        
        // Send many messages rapidly
        for i in 0..70 {
            let result = validator.validate(player_id, &input_msg);
            if i < 60 {
                assert!(result.valid, "Message {} should be valid (under rate limit)", i);
            } else {
                assert!(!result.valid, "Message {} should fail (over rate limit)", i);
                assert!(result.errors.iter().any(|e| e.contains("Rate limit exceeded")));
            }
        }
        
        // Reset rate limits and verify we can send again
        validator.reset_rate_limits();
        let result = validator.validate(player_id, &input_msg);
        assert!(result.valid, "After reset, should be able to send again");
    }
    
    #[test]
    fn test_valid_server_messages() {
        let validator = ServerMessageValidator::new();
        
        // Valid PlayerMoved message
        let player_moved = ServerMessage::PlayerMoved {
            player_id: "player123".to_string(),
            position: [10.0, 0.5, -5.0],
            rotation: [0.0, 1.57, 0.0],
            turret_rotation: [0.0, 2.1, 0.1],
        };
        
        let result = validator.validate(&player_moved);
        assert!(result.valid, "Valid PlayerMoved should pass validation: {:?}", result.errors);
        
        // Valid BulletSpawned message
        let bullet = Bullet::new("player123".to_string(), [0.0, 1.0, 0.0], [0.0, 0.0, 50.0]);
        let bullet_spawned = ServerMessage::BulletSpawned { bullet };
        
        let result = validator.validate(&bullet_spawned);
        assert!(result.valid, "Valid BulletSpawned should pass validation: {:?}", result.errors);
        
        // Valid GameStateUpdate message
        let players = vec![
            Player::new("player1".to_string()),
            Player::new("player2".to_string()),
        ];
        let enemies = vec![
            Enemy::new([15.0, 0.5, 20.0]),
            Enemy::new([-20.0, 0.5, 15.0]),
        ];
        
        let game_state = ServerMessage::GameStateUpdate { players, enemies };
        let result = validator.validate(&game_state);
        assert!(result.valid, "Valid GameStateUpdate should pass validation: {:?}", result.errors);
    }
    
    #[test]
    fn test_invalid_server_messages() {
        let validator = ServerMessageValidator::new();
        
        // Invalid PlayerMoved with empty player_id
        let invalid_player_moved = ServerMessage::PlayerMoved {
            player_id: "".to_string(), // Empty!
            position: [10.0, 0.5, -5.0],
            rotation: [0.0, 1.57, 0.0],
            turret_rotation: [0.0, 2.1, 0.1],
        };
        
        let result = validator.validate(&invalid_player_moved);
        assert!(!result.valid, "PlayerMoved with empty ID should fail validation");
        assert!(result.errors.iter().any(|e| e.contains("cannot be empty")));
        
        // Invalid PlayerMoved with NaN values
        let invalid_player_moved_nan = ServerMessage::PlayerMoved {
            player_id: "player123".to_string(),
            position: [f32::NAN, 0.5, -5.0], // NaN!
            rotation: [0.0, f32::INFINITY, 0.0], // Infinity!
            turret_rotation: [0.0, 2.1, 0.1],
        };
        
        let result = validator.validate(&invalid_player_moved_nan);
        assert!(!result.valid, "PlayerMoved with NaN values should fail validation");
        assert!(result.errors.iter().any(|e| e.contains("not finite")));
        
        // Invalid BulletSpawned with empty player_id
        let mut invalid_bullet = Bullet::new("".to_string(), [0.0, 1.0, 0.0], [0.0, 0.0, 50.0]);
        invalid_bullet.player_id = "".to_string(); // Force empty ID
        let invalid_bullet_spawned = ServerMessage::BulletSpawned { bullet: invalid_bullet };
        
        let result = validator.validate(&invalid_bullet_spawned);
        assert!(!result.valid, "BulletSpawned with empty player_id should fail validation");
        assert!(result.errors.iter().any(|e| e.contains("cannot be empty")));
    }
    
    #[test]
    fn test_game_state_validation() {
        let validator = ServerMessageValidator::new();
        
        // Create players with invalid data
        let mut invalid_player = Player::new("".to_string()); // Empty ID
        invalid_player.health = 150; // Over 100 health
        invalid_player.position = [f32::NAN, 0.5, 0.0]; // NaN position
        
        // Create enemy with invalid data
        let mut invalid_enemy = Enemy::new([0.0, 0.5, 0.0]);
        invalid_enemy.health = 150; // More than max_health (100)
        invalid_enemy.position = [10.0, f32::INFINITY, 5.0]; // Infinity position
        
        let invalid_game_state = ServerMessage::GameStateUpdate {
            players: vec![invalid_player],
            enemies: vec![invalid_enemy],
        };
        
        let result = validator.validate(&invalid_game_state);
        assert!(!result.valid, "GameStateUpdate with invalid data should fail validation");
        
        // Check for specific errors
        assert!(result.errors.iter().any(|e| e.contains("empty ID")));
        assert!(result.errors.iter().any(|e| e.contains("health out of range") || e.contains("exceeds max_health")));
        assert!(result.errors.iter().any(|e| e.contains("not finite")));
    }
    
    #[test]
    fn test_enemy_validation() {
        let validator = ServerMessageValidator::new();
        
        // Valid enemy spawn
        let valid_enemy = Enemy::new([10.0, 0.5, 15.0]);
        let enemy_spawned = ServerMessage::EnemySpawned { enemy: valid_enemy };
        
        let result = validator.validate(&enemy_spawned);
        assert!(result.valid, "Valid EnemySpawned should pass validation: {:?}", result.errors);
        
        // Invalid enemy with zero max_health
        let mut invalid_enemy = Enemy::new([10.0, 0.5, 15.0]);
        invalid_enemy.max_health = 0; // Invalid!
        invalid_enemy.health = 50; // This will be > max_health (0)
        
        let invalid_enemy_spawned = ServerMessage::EnemySpawned { enemy: invalid_enemy };
        let result = validator.validate(&invalid_enemy_spawned);
        assert!(!result.valid, "EnemySpawned with zero max_health should fail validation");
        assert!(result.errors.iter().any(|e| e.contains("max_health cannot be zero") || e.contains("exceeds max_health")));
        
        // Valid enemy movement
        let enemy_id = Uuid::new_v4();
        let enemy_moved = ServerMessage::EnemyMoved {
            enemy_id,
            position: [20.0, 0.5, 25.0],
            rotation: [0.0, 3.14, 0.0],
        };
        
        let result = validator.validate(&enemy_moved);
        assert!(result.valid, "Valid EnemyMoved should pass validation: {:?}", result.errors);
        
        // Invalid enemy movement with NaN
        let invalid_enemy_moved = ServerMessage::EnemyMoved {
            enemy_id,
            position: [f32::NAN, 0.5, 25.0], // NaN!
            rotation: [0.0, 3.14, f32::INFINITY], // Infinity!
        };
        
        let result = validator.validate(&invalid_enemy_moved);
        assert!(!result.valid, "EnemyMoved with NaN values should fail validation");
        assert!(result.errors.iter().any(|e| e.contains("not finite")));
    }
    
    #[test]
    fn test_chat_validation() {
        let validator = ServerMessageValidator::new();
        
        // Valid chat message
        let valid_chat = ServerMessage::ChatMessage {
            player_id: "player123".to_string(),
            message: "Hello everyone!".to_string(),
            timestamp: 1234567890,
        };
        
        let result = validator.validate(&valid_chat);
        assert!(result.valid, "Valid ChatMessage should pass validation: {:?}", result.errors);
        
        // Invalid chat with empty player_id
        let invalid_chat_player = ServerMessage::ChatMessage {
            player_id: "".to_string(), // Empty!
            message: "Hello".to_string(),
            timestamp: 1234567890,
        };
        
        let result = validator.validate(&invalid_chat_player);
        assert!(!result.valid, "ChatMessage with empty player_id should fail validation");
        assert!(result.errors.iter().any(|e| e.contains("cannot be empty")));
        
        // Invalid chat with empty message
        let invalid_chat_message = ServerMessage::ChatMessage {
            player_id: "player123".to_string(),
            message: "".to_string(), // Empty!
            timestamp: 1234567890,
        };
        
        let result = validator.validate(&invalid_chat_message);
        assert!(!result.valid, "ChatMessage with empty message should fail validation");
        assert!(result.errors.iter().any(|e| e.contains("cannot be empty")));
        
        // Warning for zero timestamp
        let warning_chat = ServerMessage::ChatMessage {
            player_id: "player123".to_string(),
            message: "Hello".to_string(),
            timestamp: 0, // Zero timestamp
        };
        
        let result = validator.validate(&warning_chat);
        assert!(result.valid, "ChatMessage with zero timestamp should be valid but warn");
        assert!(result.warnings.iter().any(|w| w.contains("zero timestamp")));
    }
} 