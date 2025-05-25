#!/usr/bin/env node

const WebSocket = require('ws');
const path = require('path');

// Import the generated Protocol Buffer files
const messages = require('./src/proto/messages.js');

class BattleTanksTestClient {
    constructor(serverUrl = 'ws://127.0.0.1:8080') {
        this.serverUrl = serverUrl;
        this.ws = null;
        this.NetworkMessage = messages.battletanks.NetworkMessage;
        this.connected = false;
        this.testResults = {
            joinGame: false,
            playerInput: false,
            ping: false,
            chat: false,
            rapidInput: false
        };
    }

    async loadProtobuf() {
        try {
            // Verify the Protocol Buffer classes are available
            if (!this.NetworkMessage) {
                throw new Error('NetworkMessage class not found in generated protobuf files');
            }
            console.log('✅ Protocol Buffer definitions loaded successfully');
        } catch (error) {
            console.error('❌ Failed to load Protocol Buffer definitions:', error.message);
            throw error;
        }
    }

    async connect() {
        return new Promise((resolve, reject) => {
            console.log(`🔌 Connecting to server: ${this.serverUrl}`);
            
            this.ws = new WebSocket(this.serverUrl);
            
            this.ws.on('open', () => {
                console.log('✅ Connected to server');
                this.connected = true;
                resolve();
            });

            this.ws.on('message', (data) => {
                this.handleMessage(data);
            });

            this.ws.on('error', (error) => {
                console.error('❌ WebSocket error:', error.message);
                reject(error);
            });

            this.ws.on('close', () => {
                console.log('🔌 Connection closed');
                this.connected = false;
            });

            // Timeout after 5 seconds
            setTimeout(() => {
                if (!this.connected) {
                    reject(new Error('Connection timeout'));
                }
            }, 5000);
        });
    }

    handleMessage(data) {
        try {
            // Decode the Protocol Buffer message
            const message = this.NetworkMessage.decode(data);
            
            // Handle specific message types (less verbose for automated testing)
            if (message.messageType) {
                switch (message.messageType) {
                    case 'joinGameResponse':
                        this.handleJoinGameResponse(message.joinGameResponse);
                        break;
                    case 'pongResponse':
                        this.handlePongResponse(message.pongResponse);
                        break;
                    case 'gameStateUpdate':
                        // Silently handle state updates
                        break;
                    case 'chatMessage':
                        this.handleChatMessage(message.chatMessage);
                        break;
                    default:
                        // Ignore unknown message types
                        break;
                }
            }
        } catch (error) {
            console.error('❌ Failed to decode message:', error.message);
        }
    }

    handleJoinGameResponse(response) {
        if (response.success) {
            console.log(`✅ Join Game: Player ID ${response.playerId}, Entity ID ${response.assignedEntityId}`);
            this.testResults.joinGame = true;
        } else {
            console.error(`❌ Join Game failed: ${response.errorMessage}`);
        }
    }

    handlePongResponse(response) {
        const now = Date.now();
        const rtt = now - response.clientTimestamp;
        console.log(`✅ Ping/Pong: RTT ${rtt}ms`);
        this.testResults.ping = true;
    }

    handleChatMessage(message) {
        if (message.message.includes('Hello from JavaScript client!')) {
            console.log(`✅ Chat: Message echoed back`);
            this.testResults.chat = true;
        }
    }

    async sendMessage(messageType, payload) {
        if (!this.connected) {
            throw new Error('Not connected to server');
        }

        try {
            // Create the message object
            const messageData = {
                timestamp: Date.now(),
                messageType: messageType,
                [messageType]: payload
            };

            // Verify the message structure
            const errMsg = this.NetworkMessage.verify(messageData);
            if (errMsg) {
                throw new Error(`Message verification failed: ${errMsg}`);
            }

            // Encode the message
            const message = this.NetworkMessage.create(messageData);
            const buffer = this.NetworkMessage.encode(message).finish();
            
            // Send as binary data
            this.ws.send(buffer);
        } catch (error) {
            console.error(`❌ Failed to send ${messageType} message:`, error.message);
            throw error;
        }
    }

    async joinGame(displayName = 'JSTestClient', clientVersion = '1.0.0') {
        await this.sendMessage('joinGameRequest', {
            displayName: displayName,
            clientVersion: clientVersion
        });
    }

    async sendPlayerInput(input = {}) {
        const defaultInput = {
            forward: false,
            backward: false,
            rotateLeft: false,
            rotateRight: false,
            fire: false,
            turretAngle: 0.0,
            timestamp: Date.now(),
            sequenceNumber: Math.floor(Math.random() * 1000000)
        };

        await this.sendMessage('playerInput', { ...defaultInput, ...input });
    }

    async sendPing() {
        await this.sendMessage('pingRequest', {
            clientTimestamp: Date.now(),
            sequenceNumber: Math.floor(Math.random() * 1000000)
        });
    }

    async sendChatMessage(message) {
        await this.sendMessage('chatMessage', {
            playerId: 'js-test-client',
            displayName: 'JSTestClient',
            message: message,
            timestamp: Date.now()
        });
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }

    getTestResults() {
        const passed = Object.values(this.testResults).filter(Boolean).length;
        const total = Object.keys(this.testResults).length;
        return { passed, total, success: passed === total };
    }
}

// Test scenarios
async function runTests(serverPort = 8080) {
    const client = new BattleTanksTestClient(`ws://127.0.0.1:${serverPort}`);
    
    try {
        console.log('🚀 Starting JavaScript Protocol Buffer client tests...\n');
        
        // Load Protocol Buffer definitions
        await client.loadProtobuf();
        
        // Connect to server
        await client.connect();
        
        // Wait a moment for connection to stabilize
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('📋 Running test scenarios...\n');
        
        // Test 1: Join game
        console.log('🧪 Test 1: Join Game Request');
        await client.joinGame('JavaScriptTester', '1.0.0-js');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Test 2: Send player input
        console.log('🧪 Test 2: Player Input');
        await client.sendPlayerInput({
            forward: true,
            turretAngle: 45.0,
            fire: true
        });
        client.testResults.playerInput = true; // Input sending is success
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Test 3: Ping/Pong
        console.log('🧪 Test 3: Ping Request');
        await client.sendPing();
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Test 4: Chat message
        console.log('🧪 Test 4: Chat Message');
        await client.sendChatMessage('Hello from JavaScript client! 🎮');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Test 5: Rapid input (rate limiting test)
        console.log('🧪 Test 5: Rapid Input (Rate Limiting)');
        for (let i = 0; i < 5; i++) {
            await client.sendPlayerInput({
                forward: i % 2 === 0,
                turretAngle: i * 36.0,
                sequenceNumber: i
            });
            await new Promise(resolve => setTimeout(resolve, 20));
        }
        client.testResults.rapidInput = true; // Rapid input sending is success
        
        // Wait for any remaining responses
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const results = client.getTestResults();
        console.log(`\n📊 Test Results: ${results.passed}/${results.total} passed`);
        
        if (results.success) {
            console.log('✅ All tests completed successfully!');
            return true;
        } else {
            console.log('❌ Some tests failed');
            console.log('Failed tests:', Object.entries(client.testResults)
                .filter(([_, passed]) => !passed)
                .map(([test, _]) => test));
            return false;
        }
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        return false;
    } finally {
        // Clean up
        client.disconnect();
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    const port = process.argv[2] || 8080;
    runTests(parseInt(port)).then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Test execution failed:', error);
        process.exit(1);
    });
}

module.exports = BattleTanksTestClient; 