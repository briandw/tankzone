const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 Quick connection test...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  const page = await browser.newPage();
  
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('NetworkManager') || text.includes('connected') || text.includes('error') || text.includes('Failed')) {
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
    
    await page.waitForTimeout(6000);
    
    const status = await page.evaluate(() => {
      return {
        hasGame: !!window.game,
        connected: window.game?.network?.isConnected(),
        playerId: window.game?.playerId,
        serverUrl: window.game?.network?.serverUrl
      };
    });
    
    console.log('\n📊 Status:');
    console.log('  Connected:', status.connected ? '✅' : '❌');
    console.log('  Player ID:', status.playerId || 'None');
    console.log('  Server URL:', status.serverUrl);
    
    if (status.connected && status.playerId) {
      console.log('\n🎉 SUCCESS: Client fully connected!');
    } else if (status.connected) {
      console.log('\n⚠️  Connected but no player ID yet');
    } else {
      console.log('\n❌ Connection failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})(); 