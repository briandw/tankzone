const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Starting simple client test...');
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('📝 Browser:', msg.text()));
  page.on('pageerror', error => console.error('💥 Error:', error.message));
  
  try {
    console.log('🌐 Loading page...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    console.log('✅ Page loaded');
    
    console.log('⏳ Waiting for game object...');
    await page.waitForFunction(() => window.game !== undefined, { timeout: 15000 });
    console.log('✅ Game object created');
    
    console.log('🔍 Checking game state...');
    const gameState = await page.evaluate(() => ({
      hasGame: !!window.game,
      hasNetwork: !!window.game?.network,
      hasInput: !!window.game?.input,
      hasScene3D: !!window.game?.scene3D,
      hasHUD: !!window.game?.hud,
      connected: window.game?.network?.connected,
      serverUrl: window.game?.network?.serverUrl
    }));
    
    console.log('🎮 Game state:', JSON.stringify(gameState, null, 2));
    
    if (gameState.hasGame && gameState.hasNetwork && gameState.hasInput) {
      console.log('🎉 SUCCESS: Client initialized correctly!');
      
      // Test input system
      console.log('🎮 Testing input system...');
      await page.keyboard.down('KeyW');
      await page.waitForTimeout(100);
      
      const inputState = await page.evaluate(() => window.game.input.getState());
      console.log('📝 Input state:', inputState);
      
      if (inputState.forward) {
        console.log('✅ Input system working!');
      } else {
        console.log('❌ Input system not responding');
      }
      
      await page.keyboard.up('KeyW');
      
    } else {
      console.log('❌ FAILED: Client not fully initialized');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
    console.log('🧹 Browser closed');
  }
})(); 