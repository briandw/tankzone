# Battle Tanks - Detailed Game Specification

## 1. Project Overview

### 1.1 Game Concept
Battle Tanks is a multiplayer tank combat game inspired by Atari's Battle Zone, reimagined with a cyberpunk/Tron aesthetic. Players control tanks in a neon-lit 3D vector environment, competing in free-for-all battles.

### 1.2 Core Gameplay
- **Perspective**: Over-the-shoulder third-person view
- **Game Mode**: Free-for-all deathmatch (10-minute rounds)
- **Victory Condition**: Player with most eliminations wins
- **Players**: Up to 50 concurrent players per session
- **NPCs**: Basic enemy tanks to populate the battlefield

### 1.3 Technical Stack
- **Server**: Rust with Rapier3D physics engine
- **Client**: JavaScript with Three.js rendering
- **Protocol**: Protocol Buffers over WebSocket
- **Architecture**: Server-authoritative with client-side rendering

## 2. Functional Requirements

### 2.1 Player Mechanics

#### 2.1.1 Tank Controls
- **Movement**: WASD keys
  - W: Forward movement
  - S: Reverse movement
  - A: Rotate tank body left
  - D: Rotate tank body right
- **Turret Control**: Mouse position (independent from body)
- **Firing**: Spacebar
- **Turret Behavior**: Follows mouse cursor position smoothly

#### 2.1.2 Tank Properties
- **Health System**: 100 HP, depletes with damage
- **Movement Speed**: 10 units/second (medium-slow)
- **Rotation Speed**: 90 degrees/second
- **Turret Rotation Speed**: 120 degrees/second
- **Fire Rate**: 3 shots/second (0.33s cooldown)
- **Respawn**: 3-second delay after elimination
- **Spawn Protection**: 1-second invulnerability on respawn

#### 2.1.3 Projectile Properties
- **Type**: Straight-line energy projectiles
- **Speed**: 50 units/second
- **Damage**: 25 HP per hit
- **Visual**: Glowing neon trail matching team color

### 2.2 Power-Up System

Power-ups spawn randomly on the map and provide temporary abilities:

**Power-Up Rules**:
- Only one power-up active at a time (exclusive)
- Picking up a new power-up replaces the current one
- Visual indicator shows active power-up and remaining time

1. **Shield** (Invulnerability)
   - Duration: 5-10 seconds
   - Effect: Complete damage immunity
   - Visual: Glowing energy shield effect

2. **Cloak** (Stealth)
   - Duration: 10 seconds
   - Effect: 80% transparency, removed from radar
   - Visual: Shimmer/distortion effect

3. **Speed Boost**
   - Duration: 15 seconds
   - Effect: 2x movement and rotation speed
   - Visual: Speed lines/particle effects

4. **Rapid Fire**
   - Duration: 10 seconds
   - Effect: 3x fire rate (0.11s cooldown)
   - Visual: Overcharged turret glow

### 2.3 NPC Enemies
- **Behavior**: Basic patrol and attack AI
- **Spawn Rate**: Maintain 10-15 NPCs on map
- **Difficulty**: Standard (no variations initially)
- **Rewards**: 0.5 points per NPC elimination

### 2.4 Environment
- **Map Size**: 500x500 units
- **Obstacles**: Non-destructible geometric structures
- **Collision**: Full physics for tanks and projectiles
- **No Clipping**: Turrets cannot phase through walls

## 3. Non-Functional Requirements

### 3.1 Performance
- **Server Tick Rate**: 30Hz (33ms per tick)
- **Target Client FPS**: 60 FPS
- **Network Latency**: Playable up to 150ms
- **Concurrent Players**: 50 per server instance

### 3.2 Scalability
- **Horizontal Scaling**: Multiple server instances
- **Load Balancing**: Simple round-robin
- **State Management**: In-memory per instance

### 3.3 Security
- **Input Validation**: All client inputs validated server-side
- **Anti-Cheat**: Server-authoritative physics and state
- **Rate Limiting**: Connection and action limits

## 4. System Architecture

### 4.1 Client-Server Model
```
┌─────────────┐     Protocol Buffers    ┌─────────────┐
│   Client    │ ◄─────────────────────► │   Server    │
│ (Three.js)  │      WebSocket          │   (Rust)    │
└─────────────┘                         └─────────────┘
     │                                         │
     ├─ Rendering                             ├─ Game Logic
     ├─ Input Capture                         ├─ Physics (Rapier3D)
     └─ UI/HUD                                └─ State Management
```

### 4.2 Network Architecture
- **Connection**: WebSocket (ws://) for real-time bidirectional communication
- **Message Format**: Protocol Buffers for efficiency
- **Update Rate**: 30Hz state broadcasts
- **Interpolation**: Client-side for smooth rendering
- **Authentication**: Anonymous with player-chosen display name

## 5. Server Specification (Rust)

### 5.1 Core Components

```rust
// Main game loop structure
struct GameServer {
    world: RapierWorld,
    players: HashMap<PlayerId, Player>,
    npcs: Vec<NPC>,
    powerups: Vec<PowerUp>,
    projectiles: Vec<Projectile>,
    tick_rate: Duration,
}
```

### 5.2 Physics Integration
- **Engine**: Rapier3D
- **Collision Groups**: Players, NPCs, Projectiles, Obstacles, PowerUps
- **Update Cycle**: Fixed timestep at 30Hz

### 5.3 Game State Management
```rust
struct GameState {
    tick: u64,
    round_timer: f32,
    scores: HashMap<PlayerId, Score>,
    events: VecDeque<GameEvent>,
}
```

### 5.4 Client Connection Handling
- **Protocol**: WebSocket (ws://)
- **Player Identification**: Display name selection on connect
- **Session Management**: UUID assigned per connection
- **Disconnection**: 5-second timeout before removal

### 5.5 Respawn System
```rust
struct RespawnManager {
    pending_respawns: HashMap<PlayerId, f32>, // timer in seconds
    spawn_points: Vec<Vector3>,
    
    fn update(&mut self, delta_time: f32) {
        // Countdown respawn timers
        // Spawn players with 1s invulnerability
    }
}
```

## 6. Client Specification (JavaScript/Three.js)

### 6.1 Rendering Pipeline
```javascript
class GameRenderer {
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    tanks: Map<PlayerId, TankMesh>
    effects: ParticleSystem
}
```

### 6.2 Visual Style
- **Environment**: Dark space with neon grid floor
- **Skybox**: Star field background
- **Lighting**: Ambient + point lights on projectiles
- **Tank Colors**: 
  - Red team: #FF0040
  - Blue team: #00BFFF
  - NPCs: #808080

### 6.3 Visual Effects
- **Tank Destruction**:
  - Explosion particles: Bright burst matching tank color
  - Wreckage: Tank hull remains for 30 seconds (non-collidable)
  - Death camera: Brief slow-motion effect
- **Projectile Impact**: Small energy burst on hit
- **Power-up Pickup**: Expanding ring effect

### 6.3 Input Handling
```javascript
class InputManager {
    keyboard: KeyboardState
    mouse: MouseState
    
    // Send inputs at 30Hz to match server tick
    sendInputs() {
        const input = {
            forward: keyboard.isPressed('W'),
            backward: keyboard.isPressed('S'),
            rotateLeft: keyboard.isPressed('A'),
            rotateRight: keyboard.isPressed('D'),
            fire: keyboard.isPressed(' '),
            turretAngle: calculateTurretAngle(mouse.position)
        }
        network.send(input)
    }
}
```

### 6.4 UI/HUD Elements

#### 6.4.1 Radar (Upper Right)
- Size: 200x200 pixels
- Range: Limited to 150 units around player (30% of map)
- Shows tank positions within range
- Color coding: Red/Blue for teams, Gray for NPCs
- Update rate: Real-time
- Player always centered with directional indicator

#### 6.4.2 Chat Window (Lower Left)
- Features:
  - Player messages with display names
  - System events (eliminations, power-ups)
  - Round timer and scores
- Commands: /all for global chat

#### 6.4.3 HUD Overlay (Minimalist Design)
- Health bar: Thin bar at bottom center
- Active power-up: Small icon with timer ring
- Score counter: Top center (kills/deaths)
- Respawn timer: Center screen when eliminated

## 7. Data Models

### 7.1 Protocol Buffer Definitions

```protobuf
// Player input message
message PlayerInput {
    bool forward = 1;
    bool backward = 2;
    bool rotate_left = 3;
    bool rotate_right = 4;
    bool fire = 5;
    float turret_angle = 6;
    uint64 timestamp = 7;
}

// Game state update
message GameStateUpdate {
    uint64 tick = 1;
    repeated TankState tanks = 2;
    repeated ProjectileState projectiles = 3;
    repeated PowerUpState powerups = 4;
    repeated GameEvent events = 5;
}

// Tank state
message TankState {
    uint32 id = 1;
    Vector3 position = 2;
    float body_rotation = 3;
    float turret_rotation = 4;
    uint32 health = 5;
    TeamColor team = 6;
    repeated ActivePowerUp powerups = 7;
}
```

### 7.2 Entity Component System
```rust
// Components
struct Transform {
    position: Vec3,
    rotation: Quat,
}

struct Tank {
    health: u32,
    team: Team,
    turret_angle: f32,
}

struct Projectile {
    owner: PlayerId,
    damage: u32,
    velocity: Vec3,
}
```

## 8. Art Direction & Assets

### 8.1 Visual Style Guide
- **Aesthetic**: Tron/Cyberpunk
- **Color Palette**: 
  - Primary: Neon blues, reds, purples
  - Secondary: Dark grays, blacks
  - Accents: Bright whites for energy effects

### 8.2 3D Models
- **Tank Design**: Low-poly with glowing edges
- **Environment**: Geometric obstacles with neon trim
- **Effects**: Particle systems for explosions, trails

### 8.3 Audio Specifications
- **SFX**: Synthesized/electronic sounds
- **Ambient**: Subtle electronic soundtrack
- **Feedback**: Hit confirmations, power-up pickups

## 9. Deployment & Infrastructure

### 9.1 Server Requirements
- **OS**: Linux (Ubuntu 20.04+)
- **RAM**: 4GB minimum
- **CPU**: 2 cores minimum
- **Network**: 100Mbps+

### 9.2 Client Distribution
- **Platform**: Web browser
- **Requirements**: WebGL 2.0 support
- **Hosting**: Static file hosting (CDN)

### 9.3 Monitoring
- **Metrics**: Player count, latency, FPS
- **Logging**: Game events, errors
- **Analytics**: Player behavior, balance data

## 10. Development Phases

### Phase 1: Core Gameplay (MVP)
- Basic server with physics
- Client rendering and controls
- Single player vs NPCs

### Phase 2: Multiplayer
- Network protocol implementation
- State synchronization
- Basic matchmaking

### Phase 3: Polish
- Power-up system
- Visual effects
- Audio implementation

### Phase 4: Extended Features
- Team mode
- Additional maps
- Progression system