const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 HUD Debug Test');
  console.log('=================');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  const page = await browser.newPage();
  
  // Log all console messages
  page.on('console', msg => {
    const text = msg.text();
    console.log(`[BROWSER] ${text}`);
  });
  
  page.on('pageerror', error => {
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
    
    // Check DOM elements and their visibility
    const hudInfo = await page.evaluate(() => {
      const elements = {
        canvas: document.getElementById('gameCanvas'),
        healthBar: document.querySelector('.health-bar'),
        connectionStatus: document.querySelector('.connection-status'),
        instructions: document.querySelector('.instructions'),
        hud: document.querySelector('.hud')
      };
      
      const getElementInfo = (el, name) => {
        if (!el) return { exists: false };
        
        const styles = window.getComputedStyle(el);
        return {
          exists: true,
          visible: styles.display !== 'none' && styles.visibility !== 'hidden',
          text: el.textContent || el.innerText || '',
          classes: Array.from(el.classList),
          styles: {
            display: styles.display,
            visibility: styles.visibility,
            opacity: styles.opacity,
            position: styles.position,
            top: styles.top,
            right: styles.right
          }
        };
      };
      
      return {
        canvas: getElementInfo(elements.canvas, 'canvas'),
        healthBar: getElementInfo(elements.healthBar, 'healthBar'),
        connectionStatus: getElementInfo(elements.connectionStatus, 'connectionStatus'),
        instructions: getElementInfo(elements.instructions, 'instructions'),
        hud: getElementInfo(elements.hud, 'hud'),
        bodyClasses: Array.from(document.body.classList),
        gameState: {
          hasGame: !!window.game,
          connected: window.game?.network?.isConnected(),
          playerId: window.game?.playerId,
          hudInitialized: !!window.game?.hud
        }
      };
    });
    
    console.log('\n📊 DOM Elements Status:');
    console.log('========================');
    
    Object.entries(hudInfo).forEach(([key, info]) => {
      if (key === 'gameState') return;
      
      console.log(`\n${key.toUpperCase()}:`);
      if (!info.exists) {
        console.log('  ❌ Element not found in DOM');
      } else {
        console.log(`  ✅ Exists: ${info.visible ? 'Visible' : 'Hidden'}`);
        console.log(`  📝 Text: "${info.text}"`);
        console.log(`  🎨 Classes: [${info.classes.join(', ')}]`);
        console.log(`  📐 Styles:`, info.styles);
      }
    });
    
    console.log('\n🎮 Game State:');
    console.log('==============');
    console.log('  Game Object:', hudInfo.gameState.hasGame ? '✅' : '❌');
    console.log('  Connected:', hudInfo.gameState.connected ? '✅' : '❌');
    console.log('  Player ID:', hudInfo.gameState.playerId || 'None');
    console.log('  HUD Initialized:', hudInfo.gameState.hudInitialized ? '✅' : '❌');
    
    // Check if HUD methods are working
    const hudMethods = await page.evaluate(() => {
      if (!window.game?.hud) return { error: 'No HUD object' };
      
      try {
        // Try to manually update connection status
        window.game.hud.updateConnectionStatus('TEST CONNECTION', 'connected');
        
        return {
          hasUpdateMethod: typeof window.game.hud.updateConnectionStatus === 'function',
          hasShowError: typeof window.game.hud.showError === 'function',
          hasUpdateHealth: typeof window.game.hud.updateHealth === 'function'
        };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log('\n🔧 HUD Methods:');
    console.log('===============');
    if (hudMethods.error) {
      console.log('  ❌ Error:', hudMethods.error);
    } else {
      console.log('  updateConnectionStatus:', hudMethods.hasUpdateMethod ? '✅' : '❌');
      console.log('  showError:', hudMethods.hasShowError ? '✅' : '❌');
      console.log('  updateHealth:', hudMethods.hasUpdateHealth ? '✅' : '❌');
    }
    
    // Wait a bit more and check again
    await page.waitForTimeout(3000);
    
    const finalStatus = await page.evaluate(() => {
      const connectionEl = document.querySelector('.connection-status');
      return {
        connectionText: connectionEl ? connectionEl.textContent : 'Element not found',
        connected: window.game?.network?.isConnected(),
        playerId: window.game?.playerId
      };
    });
    
    console.log('\n🏁 Final Status:');
    console.log('================');
    console.log('  Connection Text:', finalStatus.connectionText);
    console.log('  Actually Connected:', finalStatus.connected ? '✅' : '❌');
    console.log('  Player ID:', finalStatus.playerId || 'None');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})(); 