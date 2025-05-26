const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 Debugging client initialization...');
  
  const browser = await puppeteer.launch({ 
    headless: false,  // Show browser for debugging
    devtools: true,   // Open DevTools
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  const page = await browser.newPage();
  
  // Log all console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[${type.toUpperCase()}] ${text}`);
  });
  
  // Log page errors
  page.on('pageerror', error => {
    console.error('💥 PAGE ERROR:', error.message);
  });
  
  // Log network failures
  page.on('requestfailed', request => {
    console.error('🌐 REQUEST FAILED:', request.url(), request.failure().errorText);
  });
  
  try {
    console.log('🌐 Loading http://localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('✅ Page loaded, waiting for game object...');
    
    // Wait and check what's happening
    await page.waitForTimeout(5000);
    
    const status = await page.evaluate(() => {
      return {
        hasWindow: typeof window !== 'undefined',
        hasGame: typeof window.game !== 'undefined',
        gameKeys: window.game ? Object.keys(window.game) : null,
        hasNetwork: window.game ? !!window.game.network : false,
        networkConnected: window.game?.network ? window.game.network.isConnected() : false,
        networkUrl: window.game?.network ? window.game.network.serverUrl : null,
        errors: window.errors || []
      };
    });
    
    console.log('📊 Client Status:', JSON.stringify(status, null, 2));
    
    if (!status.hasGame) {
      console.log('❌ Game object not created - checking for errors...');
    } else if (!status.networkConnected) {
      console.log('❌ Network not connected - checking connection...');
    } else {
      console.log('✅ Everything looks good!');
    }
    
    console.log('🔍 Keeping browser open for manual inspection...');
    console.log('Press Ctrl+C to close when done debugging.');
    
    // Keep browser open for manual debugging
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
})(); 