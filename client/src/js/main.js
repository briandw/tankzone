// import * as THREE from 'three'; // Not needed if only 2D
import { NetworkManager } from './network.js';
import { InputManager } from './input.js';
// import { Scene3D } from './scene.js'; // Remove 3D
import { Fallback2D } from './fallback2d.js';
import { Tank } from './tank.js'; // Tank class might still be useful for data, or simplify
import { HUD } from './hud.js';

class BattleTanksClient {
    constructor() {
        console.log('🏗️ BattleTanksClient constructor called (2D Focus)');
        this.canvas = document.getElementById('gameCanvas');
        console.log('🖼️ Canvas element:', this.canvas ? 'found' : 'NOT FOUND');
        
        // this.scene3D = new Scene3D(this.canvas); // Remove 3D
        this.fallback2D = new Fallback2D(this.canvas);
        this.network = new NetworkManager('ws://localhost:8080');
        this.input = new InputManager();
        this.hud = new HUD();
        
        this.tanks = new Map(); // This might be managed by Fallback2D directly
        this.playerTankId = null; // Store ID instead of full object if Tank class is removed/simplified
        this.playerId = null;
        this.renderMode = '2d'; // Force 2D
        
        this.lastUpdateTime = 0;
        this.lastInputSent = 0;
        this.inputSendRate = 1000 / 20; // 20 messages per second max
        this.isRunning = false;
        
        // Debug counters
        this.frameCount = 0;
        this.gameStateUpdateCount = 0;
        this.tankCreateCount = 0;
        
        // Expose for testing
        window.game = this;
        console.log('✅ BattleTanksClient constructor completed');
    }
    
    async init() {
        console.log('🚀 Initializing Battle Tanks Client (2D Focus)...');
        
        let rendererReady = false;
        
        try {
            // Initialize 2D fallback
            try {
                console.log('🎨 Attempting to initialize 2D fallback...');
                this.fallback2D.init();
                console.log('✅ 2D Fallback renderer initialized successfully');
                rendererReady = true;
                this.renderMode = '2d'; // Explicitly set
                console.log('🎮 Render mode set to: 2D');
            } catch (fallbackError) {
                console.error('❌ 2D rendering failed:', fallbackError.message);
                this.hud.showError('Critical: 2D Renderer failed to initialize.');
                this.renderMode = 'network-only';
                // Optionally, prevent game from starting if 2D is essential
                // return; 
            }
            
            // Set up network event handlers BEFORE connecting
            console.log('🔗 Setting up network handlers...');
            this.setupNetworkHandlers();
            
            // Initialize network connection (critical)
            console.log('🌐 Connecting to network...');
            await this.network.connect();
            console.log('✅ Network connected');
            
            // Initialize input system
            console.log('🎮 Initializing input system...');
            this.input.init();
            console.log('✅ Input system initialized');
            
            // Initialize HUD
            console.log('📊 Initializing HUD...');
            this.hud.init();
            console.log('✅ HUD initialized');
            
            // Always start game loop (needed for network updates and HUD)
            console.log('🔄 Starting game loop...');
            this.start();
            
            if (rendererReady) {
                console.log('🎮 Battle Tanks Client ready with 2D rendering!');
            } else {
                console.log('🎮 Battle Tanks Client ready (network only mode)!');
                this.hud.showError('Rendering unavailable. Game running in network-only mode.');
            }
            
        } catch (error) {
            console.error('❌ Failed to initialize client:', error);
            this.hud.showError('Failed to connect to server. Please refresh to try again.');
        }
    }
    
    setupNetworkHandlers() {
        console.log('🔧 Setting up network event handlers...');
        
        this.network.on('joinGameResponse', (response) => {
            console.log('🎯 Join game response received:', response);
            if (response.success) {
                this.playerId = response.playerId;
                console.log(`🎮 Joined game as player ${this.playerId}`);
                this.hud.hideInstructions();
                this.hud.updateConnectionStatus('Connected', 'connected');
            } else {
                console.error('Failed to join game:', response.errorMessage);
                this.hud.showError(`Failed to join game: ${response.errorMessage}`);
            }
        });
        
        this.network.on('gameStateUpdate', (update) => {
            this.gameStateUpdateCount++;
            console.log(`📡 Game state update #${this.gameStateUpdateCount} received:`, {
                tankCount: update.tanks?.length || 0,
                tanks: update.tanks?.map(t => ({
                    id: t.entityId,
                    playerId: t.playerId,
                    position: { x: t.position?.x, y: t.position?.y },
                    health: t.health
                })) || []
            });
            this.handleGameStateUpdate(update);
        });
        
        this.network.on('pongResponse', (response) => {
            const latency = Date.now() - response.clientTimestamp;
            this.hud.updateLatency(latency);
        });
        
        this.network.on('connected', () => {
            console.log('🔗 Network connected event received');
            this.hud.updateConnectionStatus('Joining game...', 'connecting');
            // Auto-join game
            console.log('📤 Sending join game request...');
            this.network.joinGame('WebClient', '1.0.0');
        });
        
        this.network.on('disconnected', () => {
            console.log('💔 Network disconnected event received');
            this.hud.updateConnectionStatus('Disconnected', 'disconnected');
            this.hud.showError('Connection lost. Attempting to reconnect...');
        });
        
        this.network.on('error', (error) => {
            console.error('🚨 Network error:', error);
            this.hud.showError(`Network error: ${error.message}`);
        });
        
        console.log('✅ Network event handlers set up');
    }
    
    handleGameStateUpdate(update) {
        console.log(`🔄 Processing game state update with ${update.tanks?.length || 0} tanks (2D Focus)`);
        
        // Clear previous tank states from 2D renderer or update existing
        this.fallback2D.clearTanks(); // Example: or an update method

        for (const tankData of update.tanks) {
            // console.log(`🚗 Processing tank data for 2D:`, tankData); // Simplified logging

            // Directly manage tanks in fallback2D or update a simple map here
            this.fallback2D.addOrUpdateTank(tankData.entityId, tankData, tankData.playerId === this.playerId);

            if (tankData.playerId === this.playerId) {
                this.playerTankId = tankData.entityId;
            }
        }
        // No need for the old this.tanks map or complex Tank objects if fallback2D handles it
    }
    
    createOrUpdateTank(tankData) {
        // This method might be deprecated if fallback2D handles tank creation/updates directly
        console.warn('createOrUpdateTank is deprecated, Fallback2D should handle this.');
        this.fallback2D.addOrUpdateTank(tankData.entityId, tankData, tankData.playerId === this.playerId);
    }

    removeTank(tankId) {
        // This method might be deprecated if fallback2D handles tank removal directly
        console.warn('removeTank is deprecated, Fallback2D should handle this.');
        this.fallback2D.removeTank(tankId);
    }
    
    start() {
        console.log('▶️ Starting game loop...');
        this.isRunning = true;
        this.lastUpdateTime = performance.now();
        this.gameLoop();
    }
    
    stop() {
        console.log('⏹️ Stopping game loop...');
        this.isRunning = false;
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // Delta time in seconds
        this.lastUpdateTime = currentTime;
        this.frameCount++;
        
        // Process inputs (moved from updateInput for clarity, or keep separate)
        const playerInputState = this.input.getState();
        if (playerInputState && playerInputState.hasChanges && (currentTime - this.lastInputSent > this.inputSendRate)) {
            if (this.network.connected) {
                // Construct the input to send, excluding hasChanges
                const inputToSend = {
                    forward: playerInputState.forward,
                    backward: playerInputState.backward,
                    rotateLeft: playerInputState.rotateLeft,
                    rotateRight: playerInputState.rotateRight,
                    fire: playerInputState.fire,
                    turretAngle: playerInputState.turretAngle,
                    // sequenceNumber: this.input.getSequenceNumber() // Optional: if server needs it
                };
                console.log('📤 Sending player input (2D Focus):', inputToSend);
                this.network.sendPlayerInput(inputToSend);
                this.lastInputSent = currentTime;
                this.input.resetChanges(); // Reset the hasChanges flag
            }
        }
        
        // Update HUD
        this.hud.updateFps(this.calculateFps());
        if (this.network.latency !== null) {
             this.hud.updateLatency(this.network.latency);
        }

        // Render scene (2D only)
        if (this.renderMode === '2d' && this.fallback2D) {
            // console.log('�� Rendering 2D scene...'); // Can be too verbose
            this.fallback2D.render(this.playerTankId); // Pass playerTankId if needed for centering view
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    updateInput(deltaTime) {
        // Input sending logic is now in gameLoop or can be called from there
        // This method can be removed if input handling is simplified and integrated into gameLoop
        console.warn("updateInput is deprecated. Input handling moved to gameLoop.");
    }
}

// Initialize client when page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 DOM Content Loaded - initializing client...');
    const client = new BattleTanksClient();
    await client.init();
});

export { BattleTanksClient }; 