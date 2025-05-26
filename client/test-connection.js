const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 Testing client connection...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  const page = await browser.newPage();
  
  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    logs.push(text);
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
    
    const status = await page.evaluate(() => {
      return {
        hasGame: typeof window.game !== 'undefined',
        hasNetwork: window.game ? !!window.game.network : false,
        connected: window.game?.network ? window.game.network.isConnected() : false,
        serverUrl: window.game?.network ? window.game.network.serverUrl : null,
        playerId: window.game ? window.game.playerId : null
      };
    });
    
    console.log('\n📊 Final Status:');
    console.log('  Game Object:', status.hasGame ? '✅' : '❌');
    console.log('  Network Manager:', status.hasNetwork ? '✅' : '❌');
    console.log('  Connected:', status.connected ? '✅' : '❌');
    console.log('  Server URL:', status.serverUrl);
    console.log('  Player ID:', status.playerId);
    
    if (status.connected && status.playerId) {
      console.log('\n🎉 SUCCESS: Client is fully connected and joined the game!');
    } else if (status.connected) {
      console.log('\n⚠️  PARTIAL: Connected but not joined game yet');
    } else {
      console.log('\n❌ FAILED: Client not connected');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})(); 