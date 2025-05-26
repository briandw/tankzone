const WebSocket = require('ws');
const protobuf = require('./client/src/proto/messages.js');
const { NetworkMessage, JoinGameRequest, PlayerInput } = protobuf.battletanks;

async function testSimpleConnection() {
    console.log('🚀 Starting simple Protocol Buffer connection test...\n');
    
    let testWs;
    
    try {
        // 1. Test direct WebSocket connection to server
        console.log('📡 Testing direct WebSocket connection...');
        testWs = new WebSocket('ws://localhost:8080');
        
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('WebSocket connection timeout'));
            }, 5000);
            
            testWs.on('open', () => {
                clearTimeout(timeout);
                console.log('✅ Direct WebSocket connection successful');
                resolve();
            });
            
            testWs.on('error', (error) => {
                clearTimeout(timeout);
                reject(error);
            });
        });
        
        // 2. Send join game request
        console.log('🎮 Sending join game request...');
        const joinRequest = NetworkMessage.create({
            timestamp: Date.now(),
            joinGameRequest: JoinGameRequest.create({
                displayName: 'TestPlayer',
                clientVersion: '1.0.0'
            })
        });
        
        const joinBuffer = NetworkMessage.encode(joinRequest).finish();
        testWs.send(joinBuffer);
        
        // 3. Wait for join response
        let joinResponse = null;
        let messageCount = 0;
        
        const joinResponsePromise = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Join response timeout'));
            }, 5000);
            
            testWs.on('message', (data) => {
                try {
                    const message = NetworkMessage.decode(new Uint8Array(data));
                    messageCount++;
                    
                    // Determine message type
                    let messageType = 'unknown';
                    if (message.joinGameResponse) messageType = 'joinGameResponse';
                    else if (message.gameStateUpdate) messageType = 'gameStateUpdate';
                    else if (message.pongResponse) messageType = 'pongResponse';
                    
                    console.log(`📨 Received message ${messageCount}: ${messageType}`);
                    
                    // Look for the join game response specifically
                    if (message.joinGameResponse) {
                        clearTimeout(timeout);
                        resolve(message);
                    }
                } catch (error) {
                    clearTimeout(timeout);
                    reject(error);
                }
            });
        });
        
        joinResponse = await joinResponsePromise;
        
        if (joinResponse.joinGameResponse) {
            const response = joinResponse.joinGameResponse;
            if (response.success) {
                console.log(`✅ Successfully joined game with entity ID: ${response.assignedEntityId}`);
                console.log(`👤 Player ID: ${response.playerId}`);
            } else {
                throw new Error(`Join failed: ${response.errorMessage}`);
            }
        }
        
        // 4. Send a test input
        console.log('⌨️  Sending test player input...');
        const inputMessage = NetworkMessage.create({
            timestamp: Date.now(),
            playerInput: PlayerInput.create({
                forward: true,
                backward: false,
                rotateLeft: false,
                rotateRight: false,
                fire: false,
                turretAngle: 0.0,
                timestamp: Date.now(),
                sequenceNumber: 1
            })
        });
        
        const inputBuffer = NetworkMessage.encode(inputMessage).finish();
        testWs.send(inputBuffer);
        console.log('✅ Input sent successfully');
        
        // 5. Wait a bit to receive game state updates
        console.log('⏳ Waiting for game state updates...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('\n🎉 Simple connection test completed successfully!');
        console.log('📊 Test Summary:');
        console.log('  ✅ Direct WebSocket connection');
        console.log('  ✅ Join game request/response');
        console.log('  ✅ Player input sending');
        console.log(`  ✅ Received ${messageCount} messages from server`);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    } finally {
        // Cleanup
        if (testWs && testWs.readyState === WebSocket.OPEN) {
            testWs.close();
        }
    }
}

// Run the test
testSimpleConnection().catch(console.error); 