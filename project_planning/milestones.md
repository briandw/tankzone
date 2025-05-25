# Battle Tanks - Development Milestones & Testing Plan

## Overview
This document outlines the development milestones for Battle Tanks, with emphasis on comprehensive testing at every stage. Each milestone includes specific sub-goals with detailed completion criteria and testing requirements.

---

## Milestone 1: Core Server Infrastructure
**Goal**: Establish the foundational Rust server with physics engine and basic game loop.

### 1.1 Rust Server Setup
**Completion Criteria**:
- Rust project structure established with Cargo workspace
- Basic WebSocket server running on configurable port
- Logging infrastructure implemented (env_logger or tracing)

**Testing Requirements**:
- Unit tests for configuration loading
- Integration test: WebSocket connection via curl/wscat
- Load test: 100 concurrent connections
- Test command: `wscat -c ws://localhost:8080`

### 1.2 Rapier3D Physics Integration
**Completion Criteria**:
- Rapier3D physics world initialized
- Basic collision shapes created (tanks, walls, projectiles)
- Physics step integrated into game loop at fixed 30Hz

**Testing Requirements**:
- Unit tests for physics world creation
- Unit tests for collision detection between different entity types
- Integration test: Spawn entities and verify physics updates
- Performance test: Maintain 30Hz with 100 entities

### 1.3 Entity Component System (ECS)
**Completion Criteria**:
- ECS framework implemented (or use existing like Bevy/Hecs)
- Components: Transform, Tank, Projectile, Obstacle
- Systems: Movement, Collision, Damage

**Testing Requirements**:
- Unit tests for each component type
- Unit tests for system logic
- Integration test: Full entity lifecycle (create, update, destroy)
- Benchmark: ECS performance with 50 tanks + 200 projectiles

### 1.4 Game State Management
**Completion Criteria**:
- Game state structure with tick counter
- State snapshot capability for networking
- Event queue for game events

**Testing Requirements**:
- Unit tests for state mutations
- Integration test: State serialization/deserialization
- Stress test: State updates at 30Hz for 10 minutes
- Memory leak detection with Valgrind

---

## Milestone 2: Network Protocol & Client Communication
**Goal**: Implement Protocol Buffers communication between server and client.

### 2.1 Protocol Buffer Definitions
**Completion Criteria**:
- All .proto files defined (PlayerInput, GameState, Events)
- Rust code generation via prost
- JavaScript code generation via protobuf.js

**Testing Requirements**:
- Unit tests for message serialization in Rust
- Unit tests for message serialization in JavaScript
- Cross-platform test: Rust ↔ JavaScript message exchange


### 2.2 Client-Server Communication
**Completion Criteria**:
- WebSocket message handling on both ends
- Input message processing (30Hz rate limiting)
- State broadcast system

**Testing Requirements**:
- Integration test: Echo server test
- Integration test: Input validation and rate limiting
- End-to-end test using headless_chrome:
  ```
  use headless_chrome::{Browser, LaunchOptions};
use std::error::Error;

fn test_websocket() -> Result<(), Box<dyn Error>> {
    let browser = Browser::new(LaunchOptions::default_builder().headless(true).build()?)?;
    let tab = browser.new_tab()?;
    tab.navigate_to("http://localhost:3000")?;
    tab.evaluate(
        r#"
        let ws = new WebSocket('ws://localhost:8080');
        ws.send('inputMessage');
        "#,
        false,
    )?;
    Ok(())
}
```
- Latency test: Round-trip time measurement

### 2.3 State Synchronization
**Completion Criteria**:
- Delta compression for state updates
- Client-side state interpolation
- Lag compensation system

**Testing Requirements**:
- Unit tests for delta compression
- Integration test: State consistency across multiple clients
- Network condition simulation (latency, packet loss)
- Headless browser test: Verify interpolation smoothness

---

## Milestone 3: Basic Client Implementation
**Goal**: Create the Three.js client with rendering and input handling.

### 3.1 Three.js Scene Setup
**Completion Criteria**:
- Three.js scene with cyberpunk aesthetic
- Grid floor and starfield skybox
- Camera system (over-the-shoulder view)
- Basic lighting setup

**Testing Requirements**:
- Visual regression tests using headless chrome screenshots
- Performance test: Maintain 60 FPS with scene
- Unit tests for camera positioning logic
- Cross-browser compatibility tests

### 3.2 Tank Rendering & Animation
**Completion Criteria**:
- Tank 3D models with separate body/turret
- Smooth movement interpolation
- Team-based coloring system
- Neon edge effects

**Testing Requirements**:
- Unit tests for interpolation mathematics
- Visual tests: Tank rendering at different angles
- Performance test: 50 tanks rendered at 60 FPS
- Headless test: Verify tank creation/destruction

### 3.3 Input System
**Completion Criteria**:
- WASD movement capture
- Mouse position tracking for turret
- Spacebar firing
- Input prediction for responsiveness

**Testing Requirements**:
- Unit tests for input state management
- Integration test: Input → Protocol Buffer conversion
- End-to-end 
```
use headless_chrome::{Browser, LaunchOptions, types::Point};
use std::error::Error;

fn simulate_player_input() -> Result<(), Box<dyn Error>> {
    let browser = Browser::new(LaunchOptions::default_builder().headless(true).build()?)?;
    let tab = browser.new_tab()?;
    tab.navigate_to("http://localhost:3000")?;
    tab.press_key("w")?;
    tab.move_mouse_to(Point { x: 100.0, y: 100.0 })?;
    tab.press_key(" ")?;
    // Server verification logic would go here
    Ok(())
}
```
- Input lag measurement tests

### 3.4 HUD Implementation
**Completion Criteria**:
- Minimalist health bar
- Radar with limited range (150 units)
- Score display
- Chat window

**Testing Requirements**:
- Unit tests for radar calculations
- Visual regression tests for HUD elements
- Integration test: HUD updates from server state
- Accessibility tests (contrast, readability)

---

## Milestone 4: Core Gameplay Loop
**Goal**: Implement basic tank combat with NPCs.

### 4.1 Player Tank Control
**Completion Criteria**:
- Server-authoritative movement
- Turret rotation independent of body
- Collision detection with walls
- Network-synced position updates

**Testing Requirements**:
- Integration test: Movement in all directions
- Collision test: Tank vs walls, tank vs tank
- Network test: Multi-client position consistency
- End-to-end test
```
use headless_chrome::{Browser, LaunchOptions};
use serde_json::Value;
use std::{error::Error, thread, time::Duration};

fn test_tank_movement() -> Result<(), Box<dyn Error>> {
    let browser = Browser::new(LaunchOptions::default_builder().headless(true).build()?)?;
    let tab = browser.new_tab()?;
    tab.navigate_to("http://localhost:3000")?;
    tab.press_key("w")?;
    thread::sleep(Duration::from_millis(1000));
    let position: Value = tab.evaluate("window.game.player.position", false)?.value.unwrap().into();
    let z = position["z"].as_f64().unwrap();
    assert!(z > 0.0, "Expected position.z > 0, got {}", z);
    Ok(())
}
```
### 4.2 Shooting Mechanics
**Completion Criteria**:
- Projectile spawning with cooldown
- Straight-line projectile physics
- Hit detection and damage application
- Visual effects for projectiles

**Testing Requirements**:
- Unit tests for cooldown system
- Integration test: Projectile lifecycle
- Network test: Projectile sync across clients
- Performance test: 100 simultaneous projectiles
- End-to-end test: Fire and hit verification

### 4.3 Basic NPC AI
**Completion Criteria**:
- NPC spawning system (maintain 10-15)
- Patrol behavior
- Target acquisition and shooting
- Collision avoidance

**Testing Requirements**:
- Unit tests for AI decision making
- Integration test: NPC behavior patterns
- Performance test: 15 NPCs without frame drops
- Headless test: Verify NPC count maintenance

### 4.4 Damage & Destruction
**Completion Criteria**:
- Health depletion system
- Tank destruction with explosion effect
- Wreckage spawning (30-second decay)
- Score tracking

**Testing Requirements**:
- Unit tests for damage calculations
- Integration test: Full combat scenario
- Visual test: Explosion and wreckage effects
- End-to-end test: Player elimination → respawn cycle

---

## Milestone 5: Multiplayer Implementation
**Goal**: Enable full multiplayer gameplay with 50 concurrent players.

### 5.1 Player Session Management
**Completion Criteria**:
- Display name selection system
- UUID session tracking
- Connection/disconnection handling
- Player list maintenance

**Testing Requirements**:
- Unit tests for session storage
- Integration test: Join/leave notifications
- Load test: 50 concurrent players
- Chaos test: Random disconnections
- End-to-end test: Multi-browser session

### 5.2 Multiplayer Combat
**Completion Criteria**:
- Player vs player damage
- Elimination notifications
- Score synchronization
- Spectator mode while respawning

**Testing Requirements**:
- Integration test: PvP combat scenarios
- Network test: State consistency under load
- Fairness test: Verify no advantage from latency
- End-to-end multi-browser combat test

### 5.3 Respawn System
**Completion Criteria**:
- 3-second respawn timer
- Spawn point selection (avoid enemies)
- 1-second invulnerability
- Visual indicators for respawning

**Testing Requirements**:
- Unit tests for spawn point selection
- Integration test: Respawn cycle
- Exploit test: Invulnerability abuse prevention
- Visual test: Respawn effects

### 5.4 Performance Optimization
**Completion Criteria**:
- Spatial partitioning for physics
- Network message batching
- Client-side prediction
- Server tick rate maintenance

**Testing Requirements**:
- Load test: 50 players, 15 NPCs, 100 projectiles
- Network bandwidth measurement
- CPU/Memory profiling under load
- Latency compensation verification

---

## Milestone 6: Power-ups & Game Features
**Goal**: Implement power-up system and complete game features.

### 6.1 Power-up System
**Completion Criteria**:
- Four power-up types implemented
- Exclusive power-up rule (one at a time)
- Visual effects for each power-up
- Spawn/pickup mechanics

**Testing Requirements**:
- Unit tests for each power-up effect
- Integration test: Power-up lifecycle
- Balance test: Power-up duration and effectiveness
- Visual regression tests for effects
- End-to-end test: All power-up combinations

### 6.2 Round Management
**Completion Criteria**:
- 10-minute round timer
- Round end conditions
- Score announcement
- Map reset between rounds

**Testing Requirements**:
- Integration test: Full round simulation
- Edge case test: Tied scores
- Performance test: Round transition
- End-to-end test: Multi-round session

### 6.3 Chat System
**Completion Criteria**:
- Real-time chat messaging
- System event notifications
- Chat history
- Basic profanity filter

**Testing Requirements**:
- Unit tests for message filtering
- Integration test: Message broadcast
- Security test: XSS prevention
- Load test: Chat spam handling

### 6.4 Audio System
**Completion Criteria**:
- Sound effects (shooting, explosions, power-ups)
- Spatial audio
- Music system
- Volume controls

**Testing Requirements**:
- Unit tests for audio triggers
- Integration test: Audio synchronization
- Performance test: Audio with 50 players
- Browser compatibility tests

---

## Milestone 7: Polish & Optimization
**Goal**: Finalize game with polish, optimization, and production readiness.

### 7.1 Visual Polish
**Completion Criteria**:
- Particle effect optimization
- Advanced shaders (glow, distortion)
- Smooth animations
- Visual feedback improvements

**Testing Requirements**:
- Performance profiling with effects
- Visual regression suite
- GPU stress testing
- Cross-platform visual tests

### 7.2 Network Optimization
**Completion Criteria**:
- Message compression
- Predictive preloading
- Bandwidth optimization
- Reconnection support

**Testing Requirements**:
- Bandwidth usage analysis
- Network failure recovery tests
- Geographic latency testing
- Mobile network testing

### 7.3 Production Deployment
**Completion Criteria**:
- Docker containerization
- Environment configuration
- Monitoring integration
- Load balancing setup

**Testing Requirements**:
- Container build and deployment tests
- Configuration validation
- Monitoring alert tests
- Disaster recovery testing

### 7.4 Final Testing Suite
**Completion Criteria**:
- Automated test pipeline
- Continuous integration setup
- Performance benchmarks
- Security audit

**Testing Requirements**:
- Full regression test suite
- 24-hour stability test
- Security penetration testing
- Final load test: 5 servers, 250 total players

---

## Testing Infrastructure Requirements

### Automated Testing Tools
- **Rust**: cargo test, criterion (benchmarks), headless chrome
- **Network**: wscat, curl, Apache Bench
- **Visual**: Percy, Chromatic
- **Load Testing**: k6, Artillery
- **Monitoring**: Prometheus, Grafana

### Continuous Integration Pipeline
```yaml
# Example CI pipeline
stages:
  - unit-tests
  - integration-tests
  - build
  - e2e-tests
  - performance-tests
  - deploy

test-rust:
  script:
    - cargo test --all
    - cargo bench

test-client:
  script:
    - npm test
    - npm run test:e2e

test-integration:
  script:
    - docker-compose up -d
    - npm run test:integration
    - cargo test --features integration
```

### Test Metrics Goals
- Unit test coverage: >80%
- Integration test coverage: >70%
- E2E test scenarios: >50
- Load test: 50 concurrent players
- Latency: <150ms at 95th percentile
- Server tick rate: 30Hz ± 1Hz
- Client frame rate: 60 FPS (min 30 FPS)

---

## Development Timeline Estimate
- Milestone 1: 2 weeks
- Milestone 2: 2 weeks
- Milestone 3: 3 weeks
- Milestone 4: 3 weeks
- Milestone 5: 3 weeks
- Milestone 6: 2 weeks
- Milestone 7: 2 weeks

**Total: ~17 weeks** (assuming single developer)

This can be parallelized with multiple developers working on client/server simultaneously after Milestone 2.