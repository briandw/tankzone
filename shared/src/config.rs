use serde::{Deserialize, Serialize};
use config::{Config as ConfigBuilder, Environment, File};

/// Server configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServerConfig {
    /// WebSocket server port
    pub port: u16,
    /// Server host address
    pub host: String,
    /// Maximum number of concurrent players
    pub max_players: usize,
    /// Game tick rate in Hz
    pub tick_rate: u32,
    /// Physics timestep in seconds
    pub physics_timestep: f32,
}

impl Default for ServerConfig {
    fn default() -> Self {
        Self {
            port: 8080,
            host: "127.0.0.1".to_string(),
            max_players: 50,
            tick_rate: 30,
            physics_timestep: 1.0 / 30.0, // 30Hz
        }
    }
}

/// Game configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameConfig {
    /// Map size (square map)
    pub map_size: f32,
    /// Round duration in seconds
    pub round_duration: f32,
    /// Respawn delay in seconds
    pub respawn_delay: f32,
    /// Invulnerability duration after respawn
    pub spawn_protection_duration: f32,
    /// Number of NPCs to maintain
    pub npc_count: usize,
    /// Projectile speed
    pub projectile_speed: f32,
    /// Tank movement speed
    pub tank_speed: f32,
    /// Tank rotation speed (radians per second)
    pub tank_rotation_speed: f32,
    /// Turret rotation speed (radians per second)
    pub turret_rotation_speed: f32,
}

impl Default for GameConfig {
    fn default() -> Self {
        Self {
            map_size: 500.0,
            round_duration: 600.0, // 10 minutes
            respawn_delay: 3.0,
            spawn_protection_duration: 1.0,
            npc_count: 15,
            projectile_speed: 50.0,
            tank_speed: 10.0,
            tank_rotation_speed: 90.0_f32.to_radians(),
            turret_rotation_speed: 120.0_f32.to_radians(),
        }
    }
}

/// Combined configuration
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct Config {
    pub server: ServerConfig,
    pub game: GameConfig,
}

impl Config {
    /// Load configuration from environment variables and config file
    pub fn load() -> Result<Self, Box<dyn std::error::Error>> {
        let mut config = ConfigBuilder::builder()
            .add_source(Environment::with_prefix("BATTLETANKS"))
            .add_source(File::with_name("config").required(false))
            .build()?;

        // Set defaults
        let default_config = Self::default();
        config = ConfigBuilder::builder()
            .add_source(ConfigBuilder::try_from(&default_config)?)
            .add_source(config)
            .build()?;

        Ok(config.try_deserialize()?)
    }

    /// Get the server address as a string
    pub fn server_address(&self) -> String {
        format!("{}:{}", self.server.host, self.server.port)
    }

    /// Get the physics timestep duration
    pub fn physics_timestep_duration(&self) -> std::time::Duration {
        std::time::Duration::from_secs_f32(self.server.physics_timestep)
    }

    /// Get the tick duration
    pub fn tick_duration(&self) -> std::time::Duration {
        std::time::Duration::from_secs_f32(1.0 / self.server.tick_rate as f32)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_server_config() {
        let config = ServerConfig::default();
        assert_eq!(config.port, 8080);
        assert_eq!(config.host, "127.0.0.1");
        assert_eq!(config.max_players, 50);
        assert_eq!(config.tick_rate, 30);
        assert_eq!(config.physics_timestep, 1.0 / 30.0);
    }

    #[test]
    fn test_default_game_config() {
        let config = GameConfig::default();
        assert_eq!(config.map_size, 500.0);
        assert_eq!(config.round_duration, 600.0);
        assert_eq!(config.respawn_delay, 3.0);
        assert_eq!(config.spawn_protection_duration, 1.0);
        assert_eq!(config.npc_count, 15);
        assert_eq!(config.projectile_speed, 50.0);
        assert_eq!(config.tank_speed, 10.0);
    }

    #[test]
    fn test_config_serialization() {
        let config = Config::default();
        let serialized = serde_json::to_string(&config).unwrap();
        let deserialized: Config = serde_json::from_str(&serialized).unwrap();
        
        assert_eq!(config.server.port, deserialized.server.port);
        assert_eq!(config.game.map_size, deserialized.game.map_size);
    }

    #[test]
    fn test_server_address() {
        let config = Config::default();
        assert_eq!(config.server_address(), "127.0.0.1:8080");
    }

    #[test]
    fn test_durations() {
        let config = Config::default();
        let tick_duration = config.tick_duration();
        let physics_duration = config.physics_timestep_duration();
        
        assert!((tick_duration.as_secs_f32() - 1.0/30.0).abs() < f32::EPSILON);
        assert!((physics_duration.as_secs_f32() - 1.0/30.0).abs() < f32::EPSILON);
    }
} 