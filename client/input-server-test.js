const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Testing Input-to-Server Communication...');
  
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] 
  });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Browser Error:', msg.text());
    } else if (msg.text().includes('🎮') || msg.text().includes('✅') || msg.text().includes('❌')) {
      console.log('📝 Browser:', msg.text());
    }
  });
  
  page.on('pageerror', error => console.error('💥 Page Error:', error.message));
  
  try {
    console.log('🌐 Loading client...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    
    console.log('⏳ Waiting for game initialization...');
    await page.waitForFunction(() => {
      return window.game && window.game.network && window.game.input;
    }, { timeout: 15000 });
    
    console.log('✅ Game components loaded');
    
    // Wait a bit for potential connection
    await page.waitForTimeout(2000);
    
    // Check connection status
    const connectionStatus = await page.evaluate(() => {
      return {
        connected: window.game.network.isConnected(),
        serverUrl: window.game.network.serverUrl,
        hasPlayerTank: !!window.game.playerTank
      };
    });
    
    console.log('🔗 Connection status:', connectionStatus);
    
    // Set up message tracking
    console.log('📡 Setting up message tracking...');
    await page.evaluate(() => {
      window.testData = {
        messagesSent: 0,
        inputMessages: [],
        networkEvents: []
      };
      
      // Track network events
      const originalEmit = window.game.network.emit;
      window.game.network.emit = function(event, data) {
        window.testData.networkEvents.push({ event, data, timestamp: Date.now() });
        return originalEmit.call(this, event, data);
      };
      
      // Track sent messages
      const originalSendMessage = window.game.network.sendMessage;
      window.game.network.sendMessage = function(messageType, payload) {
        if (messageType === 'playerInput') {
          window.testData.messagesSent++;
          window.testData.inputMessages.push({ messageType, payload, timestamp: Date.now() });
        }
        return originalSendMessage.call(this, messageType, payload);
      };
      
      console.log('🎮 Message tracking enabled');
    });
    
    // Test input system directly
    console.log('🎮 Testing input system...');
    await page.evaluate(() => {
      // Simulate key press directly
      window.game.input.simulateKeyPress('KeyW');
      console.log('🎮 Simulated KeyW press');
    });
    
    await page.waitForTimeout(100);
    
    const inputState = await page.evaluate(() => {
      return window.game.input.getState();
    });
    
    console.log('📝 Input state after simulation:', inputState);
    
    // Test message sending
    console.log('📡 Testing message sending...');
    await page.evaluate(() => {
      // Force send a test input message
      const success = window.game.network.sendPlayerInput({
        forward: true,
        backward: false,
        rotateLeft: false,
        rotateRight: false,
        fire: false,
        turretAngle: 0,
        timestamp: Date.now(),
        sequenceNumber: 1
      });
      console.log('🎮 Test message sent:', success);
    });
    
    await page.waitForTimeout(500);
    
    // Get test results
    const testResults = await page.evaluate(() => window.testData);
    
    console.log('📊 Test Results:');
    console.log('  Messages sent:', testResults.messagesSent);
    console.log('  Input messages:', testResults.inputMessages.length);
    console.log('  Network events:', testResults.networkEvents.length);
    
    if (testResults.networkEvents.length > 0) {
      console.log('  Recent events:', testResults.networkEvents.slice(-3));
    }
    
    if (testResults.inputMessages.length > 0) {
      console.log('  Last input message:', testResults.inputMessages[testResults.inputMessages.length - 1]);
    }
    
    // Summary
    if (inputState.forward || testResults.messagesSent > 0) {
      console.log('🎉 SUCCESS: Input system and/or message sending working!');
    } else {
      console.log('⚠️  Input system needs investigation, but client is functional');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
    console.log('🧹 Test completed');
  }
})(); 