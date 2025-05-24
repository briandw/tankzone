
# TankZone
Vibe coded multiplayer 3D Tank Battle Game

A multiplayer 3D tank battle game inspired by the classic Battlezone arcade game, built with Three.js and Node.js with Socket.IO for real-time multiplayer communication.

## Features

- **Multiplayer Support**: Real-time multiplayer battles with WebSocket communication
- **3D Graphics**: Vector-style 3D graphics using Three.js
- **First-Person View**: Tank cockpit perspective with mouse look controls
- **Real-time Chat**: In-game chat system for player communication
- **Health System**: Tank damage and respawn mechanics
- **Connection Status**: Visual connection indicator
- **Responsive Controls**: WASD movement with mouse aiming

## Project Structure

```
battlezone/
├── server.js              # Main Node.js server with Socket.IO
├── package.json           # Node.js dependencies
├── public/                # Client-side files
│   ├── index.html        # Main HTML page
│   ├── styles.css        # Game styling
│   └── game.js           # Client-side game logic
└── README.md             # This file
```

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Server**:
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Open the Game**:
   Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

### For Multiple Players

- Each player should open the same URL in their browser
- Players can join from different computers on the same network using the server's IP address
- For internet play, you'll need to deploy to a cloud service or configure port forwarding

## Game Controls

- **W/S**: Move forward/backward
- **A/D**: Strafe left/right
- **Mouse**: Look around (first-person view)
- **SPACE**: Fire projectiles
- **ENTER**: Open chat
- **ESC**: Release mouse lock

## Multiplayer Features

### Real-time Communication
- Player positions and rotations are synchronized in real-time
- Bullet firing and collision detection
- Health system with damage and respawn
- Player join/leave notifications

### Chat System
- Press ENTER to open chat
- Type messages and press ENTER to send
- System messages for game events
- Player identification with shortened IDs

### Connection Management
- Visual connection status indicator
- Automatic reconnection handling
- Player state synchronization on join

## Technical Details

### Client-Side (`public/game.js`)
- **MultiplayerBattlezoneGame**: Main game class
- **Three.js Integration**: 3D rendering and scene management
- **Socket.IO Client**: Real-time communication with server
- **Input Handling**: Keyboard and mouse controls
- **UI Management**: HUD, chat, and status displays

### Server-Side (`server.js`)
- **Express Server**: Serves static files
- **Socket.IO Server**: Handles real-time multiplayer communication
- **Game State Management**: Tracks players, bullets, and game events
- **Collision Detection**: Server-side hit detection
- **Room Management**: Single game room for all players

### WebSocket Events

#### Client to Server:
- `playerUpdate`: Send player position and rotation
- `bulletFired`: Fire a bullet
- `bulletHit`: Report bullet collision
- `chatMessage`: Send chat message

#### Server to Client:
- `gameStateUpdate`: Initial game state on connect
- `playerJoined`: New player joined
- `playerLeft`: Player disconnected
- `playerMoved`: Player position update
- `bulletSpawned`: New bullet created
- `bulletDestroyed`: Bullet removed
- `bulletHitConfirmed`: Damage applied
- `playerDestroyed`: Player defeated
- `playerRespawned`: Player respawned
- `chatMessage`: Chat message broadcast

## Deployment

### Local Network
1. Find your computer's IP address
2. Start the server with `npm start`
3. Other players connect to `http://YOUR_IP:3000`

### Cloud Deployment
The game can be deployed to platforms like:
- **Heroku**: Easy deployment with Git
- **DigitalOcean**: VPS hosting
- **AWS**: EC2 or Elastic Beanstalk
- **Vercel/Netlify**: For static hosting (requires separate WebSocket server)

### Environment Variables
- `PORT`: Server port (default: 3000)

## Customization

### Game Settings
Edit `server.js` to modify:
- Update intervals (currently 100ms for server updates)
- Bullet lifetime (currently 5 seconds)
- Respawn time (currently 3 seconds)
- Player health (default: 100)
- Damage per hit (default: 25)

### Visual Settings
Edit `public/styles.css` and `public/game.js` to modify:
- Colors and visual effects
- UI layout and styling
- Tank models and environment
- Network update frequency (currently 30 FPS)

## Troubleshooting

### Common Issues

1. **Connection Problems**:
   - Check if port 3000 is available
   - Verify firewall settings
   - Ensure Node.js is properly installed

2. **Performance Issues**:
   - Reduce the number of players
   - Lower the update frequency
   - Check network latency

3. **Browser Compatibility**:
   - Use modern browsers (Chrome, Firefox, Safari, Edge)
   - Ensure WebGL support is enabled
   - Check for JavaScript errors in console

### Debugging
- Open browser developer tools (F12)
- Check console for error messages
- Monitor network tab for WebSocket connections
- Server logs show connection events

## License

MIT License - Feel free to modify and distribute as needed.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test multiplayer functionality
5. Submit a pull request

## Future Enhancements

- Multiple game rooms/lobbies
- Different tank types and weapons
- Power-ups and special abilities
- Spectator mode
- Leaderboards and statistics
- Mobile device support
- Chat integration 
