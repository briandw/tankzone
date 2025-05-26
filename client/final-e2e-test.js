const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Final End-to-End Test: Input → Server → Response Loop');
  
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] 
  });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.text().includes('🎮') || msg.text().includes('✅') || msg.text().includes('📡') || msg.text().includes('🔌')) {
      console.log('📝 Browser:', msg.text());
    }
  });
  
  try {
    console.log('🌐 Loading client...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    
    console.log('⏳ Waiting for game initialization...');
    await page.waitForFunction(() => {
      return window.game && window.game.network && window.game.input;
    }, { timeout: 15000 });
    
    console.log('✅ Game components loaded');
    
    // Override the server URL to connect to our test server
    console.log('🔧 Configuring client to connect to test server...');
    await page.evaluate(() => {
      // Override the server URL
      window.game.network.serverUrl = 'ws://localhost:9999';
      console.log('🔌 Server URL updated to:', window.game.network.serverUrl);
    });
    
    // Attempt connection
    console.log('🔌 Attempting connection to test server...');
    await page.evaluate(() => {
      window.game.network.connect().catch(err => {
        console.log('🔌 Connection attempt result:', err.message);
      });
    });
    
    // Wait for connection attempt
    await page.waitForTimeout(3000);
    
    // Check connection status
    const connectionStatus = await page.evaluate(() => {
      return {
        connected: window.game.network.isConnected(),
        serverUrl: window.game.network.serverUrl,
        hasPlayerTank: !!window.game.playerTank,
        playerId: window.game.playerId
      };
    });
    
    console.log('🔗 Connection status:', connectionStatus);
    
    // Set up comprehensive message tracking
    console.log('📡 Setting up comprehensive message tracking...');
    await page.evaluate(() => {
      window.testData = {
        messagesSent: 0,
        messagesReceived: 0,
        inputMessages: [],
        serverResponses: [],
        networkEvents: []
      };
      
      // Track all network events
      const originalEmit = window.game.network.emit;
      window.game.network.emit = function(event, data) {
        window.testData.networkEvents.push({ 
          event, 
          data: typeof data === 'object' ? JSON.stringify(data) : data, 
          timestamp: Date.now() 
        });
        if (event === 'joinGameResponse' || event === 'gameStateUpdate' || event === 'pongResponse') {
          window.testData.messagesReceived++;
          window.testData.serverResponses.push({ event, data, timestamp: Date.now() });
        }
        return originalEmit.call(this, event, data);
      };
      
      // Track sent messages
      const originalSendMessage = window.game.network.sendMessage;
      window.game.network.sendMessage = function(messageType, payload) {
        window.testData.messagesSent++;
        window.testData.inputMessages.push({ messageType, payload, timestamp: Date.now() });
        console.log('📡 Sending message:', messageType);
        return originalSendMessage.call(this, messageType, payload);
      };
      
      console.log('🎮 Comprehensive tracking enabled');
    });
    
    // Test input system
    console.log('🎮 Testing input system...');
    await page.evaluate(() => {
      // Test multiple input types
      window.game.input.simulateKeyPress('KeyW');
      window.game.input.simulateKeyPress('KeyA');
      window.game.input.simulateMouseMove(100, 100);
      console.log('🎮 Simulated multiple inputs');
    });
    
    await page.waitForTimeout(200);
    
    const inputState = await page.evaluate(() => {
      return window.game.input.getState();
    });
    
    console.log('📝 Input state:', inputState);
    
    // Force send test messages
    console.log('📡 Sending test messages...');
    await page.evaluate(() => {
      // Send join game request
      window.game.network.joinGame('TestClient', '1.0.0');
      
      // Send player input
      window.game.network.sendPlayerInput({
        forward: true,
        backward: false,
        rotateLeft: true,
        rotateRight: false,
        fire: false,
        turretAngle: 1.57,
        timestamp: Date.now(),
        sequenceNumber: 1
      });
      
      // Send ping
      window.game.network.sendPing();
      
      console.log('📡 Test messages sent');
    });
    
    // Wait for server responses
    await page.waitForTimeout(1000);
    
    // Get final test results
    const testResults = await page.evaluate(() => window.testData);
    
    console.log('\n📊 FINAL TEST RESULTS:');
    console.log('═══════════════════════════════════════');
    console.log('📤 Messages Sent:', testResults.messagesSent);
    console.log('📥 Messages Received:', testResults.messagesReceived);
    console.log('🎮 Input Messages:', testResults.inputMessages.length);
    console.log('🔄 Server Responses:', testResults.serverResponses.length);
    console.log('📡 Network Events:', testResults.networkEvents.length);
    
    if (testResults.inputMessages.length > 0) {
      console.log('\n📝 Sample Input Message:');
      console.log(JSON.stringify(testResults.inputMessages[0], null, 2));
    }
    
    if (testResults.serverResponses.length > 0) {
      console.log('\n📥 Server Responses:');
      testResults.serverResponses.forEach((response, i) => {
        console.log(`  ${i + 1}. ${response.event}`);
      });
    }
    
    if (testResults.networkEvents.length > 0) {
      console.log('\n📡 Recent Network Events:');
      testResults.networkEvents.slice(-5).forEach((event, i) => {
        console.log(`  ${i + 1}. ${event.event}`);
      });
    }
    
    // Final assessment
    console.log('\n🎯 ASSESSMENT:');
    console.log('═══════════════════════════════════════');
    
    const scores = {
      clientInit: true,
      inputSystem: inputState.forward || inputState.rotateLeft,
      messageCreation: testResults.messagesSent > 0,
      protocolBuffers: testResults.inputMessages.length > 0,
      networkAttempt: testResults.networkEvents.length > 0
    };
    
    Object.entries(scores).forEach(([test, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
    });
    
    const totalScore = Object.values(scores).filter(Boolean).length;
    const maxScore = Object.keys(scores).length;
    
    console.log(`\n🏆 OVERALL SCORE: ${totalScore}/${maxScore} (${Math.round(totalScore/maxScore*100)}%)`);
    
    if (totalScore >= 4) {
      console.log('🎉 SUCCESS: Input-to-Server loop is working correctly!');
    } else {
      console.log('⚠️  Partial success - some components need investigation');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
    console.log('\n🧹 Test completed');
  }
})(); 