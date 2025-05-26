const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 Full Input-to-Server Connection Test');
  console.log('=====================================');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  const page = await browser.newPage();
  
  const logs = [];
  const errors = [];
  
  // Capture all browser logs
  page.on('console', msg => {
    const text = msg.text();
    logs.push(text);
    if (text.includes('NetworkManager') || text.includes('connected') || text.includes('WebSocket') || 
        text.includes('Joining') || text.includes('Player') || text.includes('Failed') || 
        text.includes('decode') || text.includes('send')) {
      console.log(`[BROWSER] ${text}`);
    }
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
    console.error(`[ERROR] ${error.message}`);
  });
  
  try {
    console.log('🌐 Loading client...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle0',
      timeout: 15000 
    });
    
    console.log('⏳ Waiting for initialization...');
    await page.waitForTimeout(8000);
    
    // Check initial connection status
    const initialStatus = await page.evaluate(() => {
      return {
        hasGame: !!window.game,
        hasNetwork: !!window.game?.network,
        connected: window.game?.network?.isConnected(),
        playerId: window.game?.playerId,
        serverUrl: window.game?.network?.serverUrl,
        networkMessage: window.game?.network?.NetworkMessage ? 'Available' : 'Missing'
      };
    });
    
    console.log('\n📊 Initial Status:');
    console.log('  Game Object:', initialStatus.hasGame ? '✅' : '❌');
    console.log('  Network Manager:', initialStatus.hasNetwork ? '✅' : '❌');
    console.log('  Connected:', initialStatus.connected ? '✅' : '❌');
    console.log('  Player ID:', initialStatus.playerId || 'None');
    console.log('  Server URL:', initialStatus.serverUrl);
    console.log('  NetworkMessage:', initialStatus.networkMessage);
    
    if (!initialStatus.connected) {
      console.log('\n❌ Not connected - cannot proceed with command test');
      return;
    }
    
    console.log('\n🎮 Testing Game Commands...');
    
    // Test 1: Send Join Game Request
    console.log('\n1️⃣ Testing Join Game Request...');
    const joinResult = await page.evaluate(() => {
      try {
        const result = window.game.network.joinGame('TestPlayer', '1.0.0');
        return { success: true, result: result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    console.log('   Join Game:', joinResult.success ? '✅ Sent' : `❌ Failed: ${joinResult.error}`);
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Test 2: Send Player Input
    console.log('\n2️⃣ Testing Player Input...');
    const inputResult = await page.evaluate(() => {
      try {
        const result = window.game.network.sendPlayerInput({
          forward: true,
          backward: false,
          rotate_left: false,
          rotate_right: false,
          fire: false,
          turret_angle: 0,
          timestamp: Date.now(),
          sequence_number: 1
        });
        return { success: true, result: result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    console.log('   Player Input:', inputResult.success ? '✅ Sent' : `❌ Failed: ${inputResult.error}`);
    
    // Test 3: Send Ping
    console.log('\n3️⃣ Testing Ping Request...');
    const pingResult = await page.evaluate(() => {
      try {
        const result = window.game.network.sendPing();
        return { success: true, result: result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    console.log('   Ping:', pingResult.success ? '✅ Sent' : `❌ Failed: ${pingResult.error}`);
    
    // Wait for any responses
    await page.waitForTimeout(3000);
    
    // Check final status
    const finalStatus = await page.evaluate(() => {
      return {
        connected: window.game?.network?.isConnected(),
        playerId: window.game?.playerId,
        hasPlayerTank: !!window.game?.playerTank,
        tankCount: window.game?.tanks?.size || 0
      };
    });
    
    console.log('\n📊 Final Status:');
    console.log('  Still Connected:', finalStatus.connected ? '✅' : '❌');
    console.log('  Player ID:', finalStatus.playerId || 'None');
    console.log('  Has Player Tank:', finalStatus.hasPlayerTank ? '✅' : '❌');
    console.log('  Tank Count:', finalStatus.tankCount);
    
    // Analyze message decode errors
    const decodeErrors = logs.filter(log => log.includes('Failed to decode message')).length;
    console.log('  Decode Errors:', decodeErrors);
    
    // Summary
    console.log('\n🎯 Test Summary:');
    console.log('================');
    
    const allCommandsSent = joinResult.success && inputResult.success && pingResult.success;
    const hasPlayerId = !!finalStatus.playerId;
    const stayedConnected = finalStatus.connected;
    
    if (allCommandsSent && hasPlayerId && stayedConnected) {
      console.log('🎉 SUCCESS: Full input-to-server loop working!');
    } else if (allCommandsSent && stayedConnected) {
      console.log('⚠️  PARTIAL: Commands sent but no player ID received');
      console.log('   This might indicate server-side processing issues');
    } else if (stayedConnected) {
      console.log('❌ FAILED: Connected but commands not sending properly');
    } else {
      console.log('❌ FAILED: Connection lost during testing');
    }
    
    if (decodeErrors > 0) {
      console.log(`⚠️  WARNING: ${decodeErrors} message decode errors detected`);
      console.log('   This suggests Protocol Buffer compatibility issues');
    }
    
    // Show recent relevant logs
    console.log('\n📝 Recent Relevant Logs:');
    const relevantLogs = logs.filter(log => 
      log.includes('connected') || log.includes('Player') || log.includes('decode') || 
      log.includes('send') || log.includes('join') || log.includes('response')
    ).slice(-10);
    
    relevantLogs.forEach(log => console.log(`   ${log}`));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})(); 