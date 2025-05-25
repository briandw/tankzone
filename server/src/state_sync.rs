use anyhow::Result;
use battletanks_shared::{
    ProtoGameStateUpdate, ProtoNetworkMessage, TankState, ProjectileState, PowerUpState,
    ProtoGameEvent, ProtoPlayerScore, network_message::MessageType, PlayerId
};
use std::collections::HashMap;
use std::time::{Duration, Instant};
use tracing::warn;

/// Represents a snapshot of the game state at a specific tick
#[derive(Clone, Debug)]
pub struct GameStateSnapshot {
    pub tick: u64,
    pub timestamp: Instant,
    pub round_time_remaining: f32,
    pub tanks: Vec<TankState>,
    pub projectiles: Vec<ProjectileState>,
    pub power_ups: Vec<PowerUpState>,
    pub events: Vec<ProtoGameEvent>,
    pub scores: Vec<ProtoPlayerScore>,
}

impl GameStateSnapshot {
    pub fn new(tick: u64) -> Self {
        Self {
            tick,
            timestamp: Instant::now(),
            round_time_remaining: 0.0,
            tanks: Vec::new(),
            projectiles: Vec::new(),
            power_ups: Vec::new(),
            events: Vec::new(),
            scores: Vec::new(),
        }
    }
}

/// Manages state synchronization with delta compression
pub struct StateSynchronizer {
    /// History of game state snapshots for delta compression
    state_history: HashMap<u64, GameStateSnapshot>,
    /// Maximum number of snapshots to keep in history
    max_history_size: usize,
    /// Interval for sending full state updates (in ticks)
    full_state_interval: u64,
    /// Last tick when a full state was sent
    last_full_state_tick: u64,
}

impl StateSynchronizer {
    pub fn new() -> Self {
        Self {
            state_history: HashMap::new(),
            max_history_size: 300, // Keep 10 seconds of history at 30Hz
            full_state_interval: 30, // Send full state every second at 30Hz
            last_full_state_tick: 0,
        }
    }

    /// Store a game state snapshot
    pub fn store_snapshot(&mut self, snapshot: GameStateSnapshot) {
        let tick = snapshot.tick;
        self.state_history.insert(tick, snapshot);

        // Clean up old snapshots
        if self.state_history.len() > self.max_history_size {
            let oldest_tick = tick.saturating_sub(self.max_history_size as u64);
            self.state_history.retain(|&k, _| k > oldest_tick);
        }
    }

    /// Create a delta update message
    pub fn create_delta_update(
        &mut self,
        current_snapshot: &GameStateSnapshot,
        reference_tick: Option<u64>,
    ) -> Result<ProtoNetworkMessage> {
        let should_send_full = reference_tick.is_none() 
            || current_snapshot.tick - self.last_full_state_tick >= self.full_state_interval
            || !self.state_history.contains_key(&reference_tick.unwrap_or(0));

        let (is_delta, tanks, projectiles, power_ups, events, scores) = if should_send_full {
            // Send full state
            self.last_full_state_tick = current_snapshot.tick;
            (
                false,
                current_snapshot.tanks.clone(),
                current_snapshot.projectiles.clone(),
                current_snapshot.power_ups.clone(),
                current_snapshot.events.clone(),
                current_snapshot.scores.clone(),
            )
        } else if let Some(ref_tick) = reference_tick {
            // Send delta
            if let Some(reference_snapshot) = self.state_history.get(&ref_tick) {
                let delta_tanks = self.compute_tank_delta(&reference_snapshot.tanks, &current_snapshot.tanks);
                let delta_projectiles = self.compute_projectile_delta(&reference_snapshot.projectiles, &current_snapshot.projectiles);
                let delta_power_ups = self.compute_power_up_delta(&reference_snapshot.power_ups, &current_snapshot.power_ups);
                
                (
                    true,
                    delta_tanks,
                    delta_projectiles,
                    delta_power_ups,
                    current_snapshot.events.clone(), // Always send all events
                    current_snapshot.scores.clone(), // Always send all scores
                )
            } else {
                warn!("Reference snapshot not found for tick {}, sending full state", ref_tick);
                self.last_full_state_tick = current_snapshot.tick;
                (
                    false,
                    current_snapshot.tanks.clone(),
                    current_snapshot.projectiles.clone(),
                    current_snapshot.power_ups.clone(),
                    current_snapshot.events.clone(),
                    current_snapshot.scores.clone(),
                )
            }
        } else {
            // Fallback to full state
            self.last_full_state_tick = current_snapshot.tick;
            (
                false,
                current_snapshot.tanks.clone(),
                current_snapshot.projectiles.clone(),
                current_snapshot.power_ups.clone(),
                current_snapshot.events.clone(),
                current_snapshot.scores.clone(),
            )
        };

        let game_state_update = ProtoGameStateUpdate {
            tick: current_snapshot.tick,
            round_time_remaining: current_snapshot.round_time_remaining,
            tanks,
            projectiles,
            power_ups,
            events,
            scores,
            is_delta_update: is_delta,
            full_state_tick: self.last_full_state_tick as u32,
        };

        Ok(ProtoNetworkMessage {
            timestamp: current_snapshot.timestamp.elapsed().as_millis() as u64,
            message_type: Some(MessageType::GameStateUpdate(game_state_update)),
        })
    }

    /// Compute delta for tank states
    fn compute_tank_delta(&self, old_tanks: &[TankState], new_tanks: &[TankState]) -> Vec<TankState> {
        let mut delta_tanks = Vec::new();
        
        // Create lookup map for old tanks
        let old_tank_map: HashMap<u32, &TankState> = old_tanks.iter()
            .map(|tank| (tank.entity_id, tank))
            .collect();

        for new_tank in new_tanks {
            if let Some(old_tank) = old_tank_map.get(&new_tank.entity_id) {
                // Check if tank has changed significantly
                if self.tank_has_changed(old_tank, new_tank) {
                    delta_tanks.push(new_tank.clone());
                }
            } else {
                // New tank, include in delta
                delta_tanks.push(new_tank.clone());
            }
        }

        // Include tanks that were removed (with health = 0 or special marker)
        for old_tank in old_tanks {
            if !new_tanks.iter().any(|t| t.entity_id == old_tank.entity_id) {
                let mut removed_tank = old_tank.clone();
                removed_tank.health = 0; // Mark as removed
                delta_tanks.push(removed_tank);
            }
        }

        delta_tanks
    }

    /// Check if a tank has changed significantly enough to include in delta
    fn tank_has_changed(&self, old_tank: &TankState, new_tank: &TankState) -> bool {
        const POSITION_THRESHOLD: f32 = 0.1;
        const ROTATION_THRESHOLD: f32 = 0.05;

        // Check position change
        if let (Some(old_pos), Some(new_pos)) = (&old_tank.position, &new_tank.position) {
            let pos_diff = ((new_pos.x - old_pos.x).powi(2) + 
                           (new_pos.y - old_pos.y).powi(2) + 
                           (new_pos.z - old_pos.z).powi(2)).sqrt();
            if pos_diff > POSITION_THRESHOLD {
                return true;
            }
        }

        // Check rotation change
        let body_rot_diff = (new_tank.body_rotation - old_tank.body_rotation).abs();
        let turret_rot_diff = (new_tank.turret_rotation - old_tank.turret_rotation).abs();
        if body_rot_diff > ROTATION_THRESHOLD || turret_rot_diff > ROTATION_THRESHOLD {
            return true;
        }

        // Check health change
        if old_tank.health != new_tank.health {
            return true;
        }

        // Check power-ups change
        if old_tank.active_powerups.len() != new_tank.active_powerups.len() {
            return true;
        }

        // Check invulnerability status
        if old_tank.is_invulnerable != new_tank.is_invulnerable {
            return true;
        }

        false
    }

    /// Compute delta for projectile states
    fn compute_projectile_delta(&self, _old_projectiles: &[ProjectileState], new_projectiles: &[ProjectileState]) -> Vec<ProjectileState> {
        // For projectiles, we typically send all active projectiles since they move frequently
        // and the overhead of delta computation might not be worth it
        new_projectiles.to_vec()
    }

    /// Compute delta for power-up states
    fn compute_power_up_delta(&self, old_power_ups: &[PowerUpState], new_power_ups: &[PowerUpState]) -> Vec<PowerUpState> {
        let mut delta_power_ups = Vec::new();
        
        let old_power_up_map: HashMap<u32, &PowerUpState> = old_power_ups.iter()
            .map(|power_up| (power_up.entity_id, power_up))
            .collect();

        for new_power_up in new_power_ups {
            if let Some(old_power_up) = old_power_up_map.get(&new_power_up.entity_id) {
                // Check if power-up availability changed
                if old_power_up.is_available != new_power_up.is_available ||
                   (old_power_up.respawn_timer - new_power_up.respawn_timer).abs() > 0.1 {
                    delta_power_ups.push(new_power_up.clone());
                }
            } else {
                // New power-up
                delta_power_ups.push(new_power_up.clone());
            }
        }

        delta_power_ups
    }

    /// Get a snapshot by tick
    pub fn get_snapshot(&self, tick: u64) -> Option<&GameStateSnapshot> {
        self.state_history.get(&tick)
    }

    /// Get the latest snapshot
    pub fn get_latest_snapshot(&self) -> Option<&GameStateSnapshot> {
        self.state_history.values()
            .max_by_key(|snapshot| snapshot.tick)
    }

    /// Set the full state interval for testing
    pub fn set_full_state_interval(&mut self, interval: u64) {
        self.full_state_interval = interval;
    }
}

/// Lag compensation utilities
pub struct LagCompensator {
    /// Player latency measurements
    player_latencies: HashMap<PlayerId, Duration>,
    /// Maximum compensation time
    max_compensation: Duration,
}

impl LagCompensator {
    pub fn new() -> Self {
        Self {
            player_latencies: HashMap::new(),
            max_compensation: Duration::from_millis(200), // Max 200ms compensation
        }
    }

    /// Update player latency measurement
    pub fn update_player_latency(&mut self, player_id: PlayerId, latency: Duration) {
        self.player_latencies.insert(player_id, latency.min(self.max_compensation));
    }

    /// Get compensated tick for a player's action
    pub fn get_compensated_tick(&self, player_id: PlayerId, current_tick: u64, tick_rate: f32) -> u64 {
        if let Some(latency) = self.player_latencies.get(&player_id) {
            let compensation_ticks = (latency.as_secs_f32() * tick_rate) as u64;
            current_tick.saturating_sub(compensation_ticks)
        } else {
            current_tick
        }
    }

    /// Get player latency
    pub fn get_player_latency(&self, player_id: PlayerId) -> Option<Duration> {
        self.player_latencies.get(&player_id).copied()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use battletanks_shared::{ProtoVector3, TeamColor};


    #[test]
    fn test_state_synchronizer_creation() {
        let sync = StateSynchronizer::new();
        assert_eq!(sync.state_history.len(), 0);
        assert_eq!(sync.last_full_state_tick, 0);
    }

    #[test]
    fn test_snapshot_storage() {
        let mut sync = StateSynchronizer::new();
        let snapshot = GameStateSnapshot::new(1);
        
        sync.store_snapshot(snapshot);
        assert_eq!(sync.state_history.len(), 1);
        assert!(sync.get_snapshot(1).is_some());
    }

    #[test]
    fn test_tank_change_detection() {
        let sync = StateSynchronizer::new();
        
        let tank1 = TankState {
            entity_id: 1,
            player_id: "player1".to_string(),
            display_name: "Player 1".to_string(),
            position: Some(ProtoVector3 { x: 0.0, y: 0.0, z: 0.0 }),
            body_rotation: 0.0,
            turret_rotation: 0.0,
            health: 100,
            max_health: 100,
            team: TeamColor::TeamRed as i32,
            active_powerups: vec![],
            is_invulnerable: false,
            invulnerability_remaining: 0.0,
        };

        let mut tank2 = tank1.clone();
        tank2.position = Some(ProtoVector3 { x: 1.0, y: 0.0, z: 0.0 });

        assert!(sync.tank_has_changed(&tank1, &tank2));
        assert!(!sync.tank_has_changed(&tank1, &tank1));
    }

    #[tokio::test]
    async fn test_delta_compression() {
        let mut sync = StateSynchronizer::new();
        
        // Create initial snapshot
        let mut snapshot1 = GameStateSnapshot::new(1);
        snapshot1.tanks.push(TankState {
            entity_id: 1,
            player_id: "player1".to_string(),
            display_name: "Player 1".to_string(),
            position: Some(ProtoVector3 { x: 0.0, y: 0.0, z: 0.0 }),
            body_rotation: 0.0,
            turret_rotation: 0.0,
            health: 100,
            max_health: 100,
            team: TeamColor::TeamRed as i32,
            active_powerups: vec![],
            is_invulnerable: false,
            invulnerability_remaining: 0.0,
        });
        
        sync.store_snapshot(snapshot1.clone());

        // Create updated snapshot
        let mut snapshot2 = GameStateSnapshot::new(2);
        let mut updated_tank = snapshot1.tanks[0].clone();
        updated_tank.position = Some(ProtoVector3 { x: 1.0, y: 0.0, z: 0.0 });
        snapshot2.tanks.push(updated_tank);

        // Test delta creation
        let delta_message = sync.create_delta_update(&snapshot2, Some(1));
        assert!(delta_message.is_ok());

        if let Some(MessageType::GameStateUpdate(update)) = delta_message.unwrap().message_type {
            assert_eq!(update.tick, 2);
            assert_eq!(update.tanks.len(), 1); // Should include the changed tank
        } else {
            panic!("Expected GameStateUpdate message");
        }
    }

    #[test]
    fn test_lag_compensator() {
        let mut compensator = LagCompensator::new();
        let player_id = uuid::Uuid::new_v4();
        let latency = Duration::from_millis(50);
        
        compensator.update_player_latency(player_id, latency);
        assert_eq!(compensator.get_player_latency(player_id), Some(latency));
        
        let compensated_tick = compensator.get_compensated_tick(player_id, 100, 30.0);
        assert!(compensated_tick < 100); // Should be compensated backwards
    }

    #[tokio::test]
    async fn test_full_state_interval() {
        let mut sync = StateSynchronizer::new();
        sync.full_state_interval = 2; // Send full state every 2 ticks for testing
        
        let snapshot1 = GameStateSnapshot::new(1);
        let snapshot2 = GameStateSnapshot::new(2);
        let snapshot3 = GameStateSnapshot::new(3);
        
        sync.store_snapshot(snapshot1.clone());
        sync.store_snapshot(snapshot2.clone());
        
        // First update should be full state
        let msg1 = sync.create_delta_update(&snapshot1, None).unwrap();
        if let Some(MessageType::GameStateUpdate(update)) = msg1.message_type {
            assert!(!update.is_delta_update);
        }
        
        // Second update should be delta
        let msg2 = sync.create_delta_update(&snapshot2, Some(1)).unwrap();
        if let Some(MessageType::GameStateUpdate(update)) = msg2.message_type {
            assert!(update.is_delta_update);
        }
        
        // Third update should be full state again (due to interval)
        let msg3 = sync.create_delta_update(&snapshot3, Some(2)).unwrap();
        if let Some(MessageType::GameStateUpdate(update)) = msg3.message_type {
            assert!(!update.is_delta_update);
        }
    }
} 