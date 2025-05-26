const puppeteer = require('puppeteer');

describe('Simple Client Connection Test', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--allow-running-insecure-content'
      ]
    });
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // Enable console logging
    page.on('console', msg => {
      console.log('📝 Browser:', msg.text());
    });
    
    page.on('pageerror', error => {
      console.error('💥 Page Error:', error.message);
    });
  });

  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  test('Client loads and initializes', async () => {
    console.log('🧪 Testing client initialization...');
    
    // Navigate to client (assuming dev server is running on 3000)
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for game object to be created
    await page.waitForFunction(() => {
      return window.game !== undefined;
    }, { timeout: 10000 });
    
    // Check if game components are initialized
    const gameState = await page.evaluate(() => {
      return {
        hasGame: !!window.game,
        hasNetwork: !!window.game?.network,
        hasInput: !!window.game?.input,
        hasScene3D: !!window.game?.scene3D,
        hasHUD: !!window.game?.hud
      };
    });
    
    expect(gameState.hasGame).toBe(true);
    expect(gameState.hasNetwork).toBe(true);
    expect(gameState.hasInput).toBe(true);
    expect(gameState.hasScene3D).toBe(true);
    expect(gameState.hasHUD).toBe(true);
    
    console.log('✅ Client initialized successfully');
  });

  test('Input system responds to keyboard events', async () => {
    console.log('🧪 Testing input system...');
    
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for input system to be ready
    await page.waitForFunction(() => {
      return window.game?.input;
    }, { timeout: 10000 });
    
    // Test keyboard input
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(100);
    
    const inputState = await page.evaluate(() => {
      return window.game.input.getState();
    });
    
    expect(inputState.forward).toBe(true);
    
    await page.keyboard.up('KeyW');
    await page.waitForTimeout(100);
    
    const inputStateAfter = await page.evaluate(() => {
      return window.game.input.getState();
    });
    
    expect(inputStateAfter.forward).toBe(false);
    
    console.log('✅ Input system working correctly');
  });

  test('Network manager attempts connection', async () => {
    console.log('🧪 Testing network connection attempt...');
    
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for network manager to be created
    await page.waitForFunction(() => {
      return window.game?.network;
    }, { timeout: 10000 });
    
    // Check network manager state
    const networkState = await page.evaluate(() => {
      return {
        hasNetworkManager: !!window.game.network,
        serverUrl: window.game.network.serverUrl,
        connected: window.game.network.connected
      };
    });
    
    expect(networkState.hasNetworkManager).toBe(true);
    expect(networkState.serverUrl).toContain('ws://');
    
    console.log('✅ Network manager initialized with URL:', networkState.serverUrl);
  });
}); 