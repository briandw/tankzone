const puppeteer = require('puppeteer');

(async () => {
  console.log('📸 Visual Web Client Test');
  console.log('========================');
  
  const browser = await puppeteer.launch({ 
    headless: false,  // Show the browser
    devtools: true,   // Open DevTools
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1200, height: 800 }
  });
  
  const page = await browser.newPage();
  
  // Log what we see
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('✅') || text.includes('❌') || text.includes('connected') || text.includes('Joining')) {
      console.log(`[BROWSER] ${text}`);
    }
  });
  
  try {
    console.log('🌐 Loading client at http://localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle0',
      timeout: 15000 
    });
    
    console.log('⏳ Waiting for initialization...');
    await page.waitForTimeout(8000);
    
    // Check what's visible
    const pageInfo = await page.evaluate(() => {
      const canvas = document.getElementById('gameCanvas');
      const healthBar = document.querySelector('.health-bar');
      const connectionStatus = document.querySelector('.connection-status');
      const instructions = document.querySelector('.instructions');
      
      return {
        hasCanvas: !!canvas,
        canvasSize: canvas ? `${canvas.width}x${canvas.height}` : 'None',
        hasHealthBar: !!healthBar,
        healthText: healthBar ? healthBar.textContent : 'None',
        hasConnectionStatus: !!connectionStatus,
        connectionText: connectionStatus ? connectionStatus.textContent : 'None',
        hasInstructions: !!instructions,
        instructionsVisible: instructions ? !instructions.classList.contains('hidden') : false,
        gameState: {
          connected: window.game?.network?.isConnected(),
          playerId: window.game?.playerId,
          tankCount: window.game?.tanks?.size || 0,
          hasPlayerTank: !!window.game?.playerTank
        }
      };
    });
    
    console.log('\n📊 Visual Elements:');
    console.log('  Canvas:', pageInfo.hasCanvas ? `✅ ${pageInfo.canvasSize}` : '❌ Missing');
    console.log('  Health Bar:', pageInfo.hasHealthBar ? `✅ "${pageInfo.healthText}"` : '❌ Missing');
    console.log('  Connection Status:', pageInfo.hasConnectionStatus ? `✅ "${pageInfo.connectionText}"` : '❌ Missing');
    console.log('  Instructions:', pageInfo.hasInstructions ? (pageInfo.instructionsVisible ? '👁️ Visible' : '🙈 Hidden') : '❌ Missing');
    
    console.log('\n🎮 Game State:');
    console.log('  Connected:', pageInfo.gameState.connected ? '✅' : '❌');
    console.log('  Player ID:', pageInfo.gameState.playerId || 'None');
    console.log('  Tank Count:', pageInfo.gameState.tankCount);
    console.log('  Has Player Tank:', pageInfo.gameState.hasPlayerTank ? '✅' : '❌');
    
    // Take a screenshot
    console.log('\n📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'client-screenshot.png', 
      fullPage: true 
    });
    console.log('   Screenshot saved as client-screenshot.png');
    
    console.log('\n🎯 What you should see:');
    console.log('  1. Dark background with starfield');
    console.log('  2. 3D canvas with grid floor');
    console.log('  3. Health bar showing "Health: 100/100" (if connected)');
    console.log('  4. Connection status showing "Connected" in green');
    console.log('  5. Your tank as a geometric shape on the grid');
    console.log('  6. Smooth camera movement when you move mouse');
    
    console.log('\n⌨️ Try these controls:');
    console.log('  - WASD: Move your tank');
    console.log('  - Mouse: Look around');
    console.log('  - Check browser console (F12) for detailed logs');
    
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser will stay open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})(); 