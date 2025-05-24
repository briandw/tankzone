const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Game state
const gameState = {
    players: {},
    enemies: [],
    bullets: []
};

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);
    
    // Initialize new player
    const playerId = socket.id;
    gameState.players[playerId] = {
        id: playerId,
        position: { x: 0, y: 0.5, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        turretRotation: { x: 0, y: 0, z: 0 },
        health: 100,
        connected: true
    };
    
    // Send initial game state to new player
    socket.emit('gameStateUpdate', gameState);
    
    // Broadcast new player to all other players
    socket.broadcast.emit('playerJoined', gameState.players[playerId]);
    
    // Handle player movement updates
    socket.on('playerUpdate', (playerData) => {
        if (gameState.players[playerId]) {
            gameState.players[playerId].position = playerData.position;
            gameState.players[playerId].rotation = playerData.rotation;
            gameState.players[playerId].turretRotation = playerData.turretRotation;
            
            // Broadcast to all other players
            socket.broadcast.emit('playerMoved', {
                id: playerId,
                ...playerData
            });
        }
    });
    
    // Handle bullet firing
    socket.on('bulletFired', (bulletData) => {
        const bullet = {
            id: uuidv4(),
            playerId: playerId,
            position: bulletData.position,
            velocity: bulletData.velocity,
            timestamp: Date.now()
        };
        
        gameState.bullets.push(bullet);
        
        // Broadcast bullet to all players
        io.emit('bulletSpawned', bullet);
        
        // Remove bullet after 5 seconds
        setTimeout(() => {
            gameState.bullets = gameState.bullets.filter(b => b.id !== bullet.id);
            io.emit('bulletDestroyed', bullet.id);
        }, 5000);
    });
    
    // Handle bullet hits
    socket.on('bulletHit', (hitData) => {
        const { bulletId, targetPlayerId, damage } = hitData;
        
        // Remove bullet
        gameState.bullets = gameState.bullets.filter(b => b.id !== bulletId);
        
        // Apply damage if target exists
        if (gameState.players[targetPlayerId]) {
            gameState.players[targetPlayerId].health -= damage;
            
            if (gameState.players[targetPlayerId].health <= 0) {
                // Player destroyed
                io.emit('playerDestroyed', targetPlayerId);
                
                // Respawn player after 3 seconds
                setTimeout(() => {
                    if (gameState.players[targetPlayerId]) {
                        gameState.players[targetPlayerId].health = 100;
                        gameState.players[targetPlayerId].position = {
                            x: (Math.random() - 0.5) * 80,
                            y: 0.5,
                            z: (Math.random() - 0.5) * 80
                        };
                        io.emit('playerRespawned', gameState.players[targetPlayerId]);
                    }
                }, 3000);
            }
            
            // Broadcast hit to all players
            io.emit('bulletHitConfirmed', hitData);
        }
    });
    
    // Handle chat messages
    socket.on('chatMessage', (message) => {
        io.emit('chatMessage', {
            playerId: playerId,
            message: message,
            timestamp: Date.now()
        });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${playerId}`);
        
        if (gameState.players[playerId]) {
            delete gameState.players[playerId];
            socket.broadcast.emit('playerLeft', playerId);
        }
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Battlezone server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to play`);
});

// Game loop for enemy AI and cleanup
setInterval(() => {
    // Update enemy positions (simple AI)
    gameState.enemies.forEach(enemy => {
        if (!enemy.userData) {
            enemy.userData = {
                moveDirection: Math.random() * Math.PI * 2,
                speed: 0.02 + Math.random() * 0.03,
                lastMoveTime: Date.now()
            };
        }
        
        const currentTime = Date.now();
        if (currentTime - enemy.userData.lastMoveTime > 2000) {
            enemy.userData.moveDirection = Math.random() * Math.PI * 2;
            enemy.userData.lastMoveTime = currentTime;
        }
        
        const moveX = Math.cos(enemy.userData.moveDirection) * enemy.userData.speed;
        const moveZ = Math.sin(enemy.userData.moveDirection) * enemy.userData.speed;
        
        enemy.position.x += moveX;
        enemy.position.z += moveZ;
        
        // Keep enemies in bounds
        if (Math.abs(enemy.position.x) > 80 || Math.abs(enemy.position.z) > 80) {
            enemy.userData.moveDirection += Math.PI;
        }
    });
    
    // Broadcast enemy updates
    if (gameState.enemies.length > 0) {
        io.emit('enemiesUpdate', gameState.enemies);
    }
    
    // Clean up old bullets
    const now = Date.now();
    gameState.bullets = gameState.bullets.filter(bullet => {
        return (now - bullet.timestamp) < 5000;
    });
    
}, 100); // 10 FPS for server updates 