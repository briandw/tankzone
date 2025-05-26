# Battle Tanks - Simple 2D Tank Game

A minimal 2D tank game built with Rust (server) and vanilla JavaScript (client).

## Features

- **Simple 2D graphics** - Canvas-based rendering with tank sprites
- **Real-time multiplayer** - WebSocket communication
- **NPC tanks** - AI-controlled tanks that move in patterns
- **Arrow key controls** - Move your tank with arrow keys
- **Window-scoped identity** - Each browser tab gets its own tank
- **Network multiplayer** - Play with others on your local network
- **No complex dependencies** - No physics engine, no build tools, no protobuf

## Quick Start

### Development Mode (Auto-reload)
```bash
# Option 1: Use the development script (recommended)
./dev.sh dev

# Option 2: Use cargo directly
cargo dev

# Option 3: Use cargo-watch directly
cargo watch -x run
```

### Production Mode
```bash
cargo run --release
```

### Playing the Game

1. **Play locally:**
   - Go to http://localhost:3000 in your browser
   - Use WASD to move your tank, arrow keys for turret, space to fire
   - Red tanks are NPCs

2. **Play on network:**
   - Server runs on all network interfaces (0.0.0.0)
   - Find your IP address: `ifconfig` (macOS/Linux) or `ipconfig` (Windows)
   - Share the URL: `http://YOUR_IP:3000`
   - Others can join from phones, tablets, other computers

3. **Run tests:**
   ```bash
   # Unit tests (no server required)
   cargo test
   ./dev.sh test
   
   # Integration tests (requires running server)
   ./dev.sh dev                    # Start server in one terminal
   ./dev.sh test-integration       # Run integration tests in another
   
   # All tests
   ./dev.sh test-all
   ```

## Development Commands

```bash
./dev.sh dev              # Start with auto-reload
./dev.sh build            # Build project
./dev.sh test             # Run unit tests
./dev.sh test-integration # Run integration tests (requires server)
./dev.sh test-all         # Run all tests
./dev.sh stop             # Stop all servers
./dev.sh clean            # Clean build artifacts
```

Or use cargo aliases:
```bash
cargo dev             # Start with auto-reload
cargo w               # Same as above (short)
cargo t               # Run unit tests
cargo test-integration # Run integration tests
cargo test-all        # Run all tests
cargo c               # Check code
cargo watch-test      # Watch and run tests on file changes
```

## Network Access

The server binds to `0.0.0.0:3000` (HTTP) and `0.0.0.0:3001` (WebSocket), making it accessible from:

- **Local machine**: http://localhost:3000
- **Local network**: http://192.168.1.215:3000 (replace with your IP)
- **Mobile devices**: Same network IP from phones/tablets
- **Other computers**: Same network IP from any device

The client automatically connects to the same host that served the page, so network access works seamlessly.

## Architecture

- **Server (Rust)**: Simple WebSocket server that serves static files and manages game state
- **Client (JavaScript)**: Vanilla JS with Canvas 2D rendering
- **Protocol**: Simple JSON messages over WebSocket
- **Identity**: Window-scoped using sessionStorage (each tab = separate tank)

## Game Controls

- **WASD**: Move tank body
- **Arrow Keys**: Rotate turret independently
- **Space**: Fire (logged to server console)
- **Blue Tank**: Your tank
- **Red Tanks**: NPCs
- **Green Tanks**: Other players

## Multiple Players

- **Same device**: Open multiple browser tabs for multiple tanks
- **Different devices**: Connect from phones, tablets, other computers
- **Persistent identity**: Each browser tab maintains its tank across page reloads
- **Real-time sync**: All players see each other's movements and NPC activity

## Development

The entire game is contained in:
- `src/main.rs` - Rust server with WebSocket game logic (423 lines)
- `static/index.html` - Complete client with HTML, CSS, and JavaScript (278 lines)

No build tools, no complex dependencies, no configuration files needed.

## Testing

Run the connection test:
```bash
cargo test test_simple_connection
```

This verifies that the WebSocket server accepts connections, handles join requests, sends game state updates, and processes player input. 