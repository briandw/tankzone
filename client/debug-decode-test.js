const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 Protocol Buffer Decode Debug Test');
  console.log('====================================');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  const page = await browser.newPage();
  
  // Capture detailed decode errors
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('decode') || text.includes('NetworkMessage') || text.includes('connected')) {
      console.log(`[BROWSER] ${text}`);
    }
  });
  
  page.on('pageerror', error => {
    console.error(`[ERROR] ${error.message}`);
  });
  
  try {
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });
    
    await page.waitForTimeout(3000);
    
    // Test Protocol Buffer decoding directly
    const decodeTest = await page.evaluate(() => {
      try {
        // Check if NetworkMessage is available
        const NetworkMessage = window.game?.network?.NetworkMessage;
        if (!NetworkMessage) {
          return { error: 'NetworkMessage not available' };
        }
        
        // Test creating and encoding a simple message
        const testMessage = {
          timestamp: Date.now(),
          joinGameRequest: {
            displayName: 'TestPlayer',
            clientVersion: '1.0.0'
          }
        };
        
        // Verify the message structure
        const verifyResult = NetworkMessage.verify(testMessage);
        if (verifyResult) {
          return { error: 'Message verification failed: ' + verifyResult };
        }
        
        // Try to encode the message
        const message = NetworkMessage.create(testMessage);
        const buffer = NetworkMessage.encode(message).finish();
        
        // Try to decode it back
        const decoded = NetworkMessage.decode(buffer);
        
        return {
          success: true,
          originalMessage: testMessage,
          encodedSize: buffer.length,
          decodedMessage: {
            timestamp: decoded.timestamp?.toString(),
            messageType: decoded.messageType,
            hasJoinGameRequest: !!decoded.joinGameRequest
          }
        };
        
      } catch (error) {
        return { error: error.message, stack: error.stack };
      }
    });
    
    console.log('\n📊 Protocol Buffer Test Results:');
    if (decodeTest.error) {
      console.log('❌ Error:', decodeTest.error);
    } else {
      console.log('✅ Encode/Decode Test: SUCCESS');
      console.log('  Encoded Size:', decodeTest.encodedSize, 'bytes');
      console.log('  Message Type:', decodeTest.decodedMessage.messageType);
      console.log('  Has Join Request:', decodeTest.decodedMessage.hasJoinGameRequest);
    }
    
    // Test the actual network message handling
    console.log('\n🔍 Testing Network Message Handling...');
    
    const networkTest = await page.evaluate(() => {
      return new Promise((resolve) => {
        let messageCount = 0;
        let decodeErrors = 0;
        let successfulDecodes = 0;
        
        // Override the handleMessage function to capture details
        const originalHandleMessage = window.game.network.handleMessage;
        window.game.network.handleMessage = function(data) {
          messageCount++;
          
          try {
            const buffer = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
            console.log(`📦 Received message ${messageCount}: ${buffer.length} bytes`);
            
            // Try to decode
            const message = this.NetworkMessage.decode(buffer);
            successfulDecodes++;
            console.log(`✅ Decoded message ${messageCount}: type=${message.messageType}`);
            
            // Call original handler
            originalHandleMessage.call(this, data);
            
          } catch (error) {
            decodeErrors++;
            console.log(`❌ Decode error ${messageCount}: ${error.message}`);
            console.log(`   Buffer: [${Array.from(buffer.slice(0, 10)).join(', ')}...]`);
          }
        };
        
        // Wait for some messages
        setTimeout(() => {
          resolve({
            messageCount,
            decodeErrors,
            successfulDecodes
          });
        }, 5000);
      });
    });
    
    console.log('\n📊 Network Message Results:');
    console.log('  Total Messages:', networkTest.messageCount);
    console.log('  Successful Decodes:', networkTest.successfulDecodes);
    console.log('  Decode Errors:', networkTest.decodeErrors);
    
    if (networkTest.decodeErrors > 0) {
      console.log('\n🔍 The server is sending messages in an incompatible format!');
      console.log('   This suggests the server and client Protocol Buffer schemas differ.');
    } else if (networkTest.successfulDecodes > 0) {
      console.log('\n✅ Protocol Buffer decoding is working correctly!');
    } else {
      console.log('\n⚠️  No messages received from server.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})(); 