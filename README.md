# Battle Tanks 🎮

A multiplayer tank combat game with a cyberpunk aesthetic, built with Rust server and JavaScript client.

## 🏗️ Architecture

- **Server**: Rust with Rapier3D physics engine (30Hz tick rate)
- **Client**: JavaScript with Three.js rendering (Milestone 3+)
- **Protocol**: Protocol Buffers over WebSocket
- **Build System**: Unified Makefile coordinating Rust and JavaScript builds

## 🚀 Quick Start

### Prerequisites

- **Rust** (latest stable) - [Install here](https://rustup.rs/)
- **Node.js** (16+) - [Install here](https://nodejs.org/)
- **Protocol Buffers Compiler** - `brew install protobuf` (macOS) or `sudo apt-get install protobuf-compiler` (Ubuntu)

### Setup

```bash
# Clone and setup everything
git clone <repository-url>
cd battletanks
make setup  # Installs dependencies, builds everything, runs tests
```

### Development

```bash
# Start development mode (auto-rebuild on changes)
make dev

# Or manually start the server
make run

# Run all tests
make test
```

## 📋 Development Milestones

### ✅ Milestone 1: Core Server Infrastructure (Current)
- [x] Rust server with WebSocket support
- [x] Rapier3D physics integration (30Hz)
- [x] Entity Component System (Hecs)
- [x] Game state management
- [x] Protocol Buffer definitions
- [x] Comprehensive testing suite

### 🔄 Milestone 2: Network Protocol & Client Communication
- [ ] Protocol Buffer message handling
- [ ] Client-server communication
- [ ] State synchronization
- [ ] Rate limiting and validation

### 📅 Milestone 3: Basic Client Implementation
- [ ] Three.js scene setup
- [ ] Tank rendering and animation
- [ ] Input system
- [ ] HUD implementation
- [ ] **JavaScript Protocol Buffer integration** ← JS files created here

### 📅 Milestone 4+: Core Gameplay, Multiplayer, Polish

## 🔧 Build System

### Unified Build Strategy

The project uses a **unified build system** where:

1. **Protocol Buffers are the single source of truth** - defined in `proto/*.proto`
2. **Rust build generates Rust code** - via `prost` in `shared/build.rs`
3. **JavaScript files are generated from the same .proto files** - via `scripts/generate-js-proto.sh`
4. **Makefile coordinates everything** - ensures consistency between Rust and JS

### Build Commands

```bash
# Core commands
make install      # Install all dependencies
make proto        # Generate Protocol Buffer files for both Rust and JS
make build        # Build everything (Rust + JS protobuf generation)
make test         # Run all tests
make run          # Start the server

# Development
make dev          # Development mode with auto-rebuild
make check        # Format, lint, and test everything
make clean        # Clean all build artifacts

# Production
make build-release # Build optimized release version
make run-release   # Run in release mode
```

### Protocol Buffer Generation

```bash
# Generate both Rust and JavaScript Protocol Buffer files
make proto

# This runs:
# 1. cargo build --package shared  (generates Rust files)
# 2. ./scripts/generate-js-proto.sh (generates JS files)
```

**Why this approach?**
- ✅ **Single source of truth** - one set of .proto files
- ✅ **Consistency** - Rust and JS use identical message definitions
- ✅ **Automatic** - JS files regenerated whenever Rust builds
- ✅ **No duplication** - no separate client build system needed

## 📁 Project Structure

```
battletanks/
├── Cargo.toml              # Rust workspace configuration
├── Makefile                # Unified build system
├── package.json            # Node.js dependencies for protobuf generation
├── proto/                  # Protocol Buffer definitions (single source of truth)
│   └── messages.proto
├── scripts/
│   └── generate-js-proto.sh # JavaScript protobuf generation
├── shared/                 # Shared Rust library
│   ├── src/
│   │   ├── types.rs        # Game types
│   │   ├── events.rs       # Network messages
│   │   └── config.rs       # Configuration
│   └── build.rs            # Rust protobuf generation
├── server/                 # Rust server
│   ├── src/
│   │   ├── main.rs         # Entry point
│   │   ├── server.rs       # Main game server
│   │   ├── network.rs      # Client connections
│   │   ├── physics.rs      # Rapier3D wrapper
│   │   ├── ecs.rs          # Entity Component System
│   │   └── game_state.rs   # Game state management
│   └── tests/              # Integration tests
└── client/                 # JavaScript client (Milestone 3+)
    └── src/
        └── proto/          # Generated JS protobuf files (auto-generated)
```

## 🧪 Testing

### Current Tests (Milestone 1)

```bash
# Run all Rust tests
cargo test --workspace

# Run integration tests
make test-integration

# Run specific test suites
cargo test --package server
cargo test --package shared
```

### Test Coverage

- **Unit tests**: All core components (physics, ECS, networking)
- **Integration tests**: WebSocket connections, health endpoints, multi-client scenarios
- **Performance tests**: 30Hz physics with 100+ entities
- **Timeout compliance**: All tests complete within 30 seconds (following cursor rules)

### Future Tests (Milestone 3+)

JavaScript Protocol Buffer tests will be added in Milestone 3:
- Cross-platform message serialization
- WebSocket communication with real server
- Client-server integration tests

## 🔍 Development Guidelines

### Rust Guidelines
- Follow cursor rules for timeouts in tests
- Use `Result<T, E>` for error handling
- Comprehensive unit tests for all modules
- Integration tests with proper cleanup

### Protocol Buffer Strategy
- Define messages in `proto/*.proto` only
- Generate both Rust and JS from same source
- Version compatibility maintained automatically
- Binary efficiency over JSON

### Performance Requirements
- Server: 30Hz physics simulation
- Client: 60 FPS rendering (Milestone 3+)
- Network: Support 50 concurrent players
- Latency: Playable up to 150ms

## 📊 Current Status

**Milestone 1 Progress**: ✅ Complete
- ✅ Rust server infrastructure
- ✅ WebSocket handling
- ✅ Rapier3D physics (30Hz)
- ✅ ECS with Hecs
- ✅ Game state management
- ✅ Protocol Buffer definitions
- ✅ Comprehensive test suite
- ✅ Health check endpoints
- ✅ Unified build system

**Next**: Milestone 2 - Network Protocol & Client Communication

## 🤝 Contributing

1. Follow the milestone structure
2. Run `make check` before committing
3. Ensure all tests pass with `make test`
4. Use the unified build system (`make build`)
5. JavaScript client work starts in Milestone 3

## 📝 License

MIT License - see LICENSE file for details. 