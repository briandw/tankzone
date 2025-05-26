const puppeteer = require('puppeteer');
const path = require('path');
const { spawn } = require('child_process');
const { promisify } = require('util');

const sleep = promisify(setTimeout);

describe('Input-to-Server Loop E2E Tests', () => {
  let browser;
  let page;
  let devServer;
  let devServerPort = 3000;

  beforeAll(async () => {
    console.log('🚀 Starting E2E test suite...');
    
    // Start webpack dev server for client
    console.log('📦 Starting client development server...');
    devServer = spawn('npm', ['run', 'dev'], {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NODE_ENV: 'development' }
    });
    
    // Wait for dev server to start
    await sleep(5000);
    
    // Launch browser
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
    
    console.log('🌐 Browser launched');
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
      console.log('🌐 Browser closed');
    }
    
    if (devServer) {
      devServer.kill('SIGTERM');
      console.log('📦 Dev server stopped');
    }
  });

  beforeEach(async () => {
    page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 720 });
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Browser Error:', msg.text());
      } else if (msg.type() === 'warn') {
        console.log('⚠️ Browser Warning:', msg.text());
      } else {
        console.log('📝 Browser Log:', msg.text());
      }
    });
    
    // Handle page errors
    page.on('pageerror', error => {
      console.error('💥 Page Error:', error.message);
    });
  });

  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  test('Client loads and connects to server', async () => {
    console.log('🧪 Test: Client connection...');
    
    // Navigate to client
    await page.goto(`http://localhost:${devServerPort}`, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for game to initialize
    await page.waitForFunction(() => {
      return window.game && window.game.network && window.game.network.isConnected();
    }, { timeout: 15000 });
    
    // Check connection status
    const isConnected = await page.evaluate(() => {
      return window.game.network.isConnected();
    });
    
    expect(isConnected).toBe(true);
    console.log('✅ Client connected to server');
  });

  test('Input system captures keyboard events', async () => {
    console.log('🧪 Test: Input system...');
    
    await page.goto(`http://localhost:${devServerPort}`, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for game to initialize
    await page.waitForFunction(() => {
      return window.game && window.game.input;
    }, { timeout: 15000 });
    
    // Test keyboard input
    await page.keyboard.down('KeyW');
    await sleep(100);
    
    const inputState = await page.evaluate(() => {
      return window.game.input.getState();
    });
    
    expect(inputState.forward).toBe(true);
    
    await page.keyboard.up('KeyW');
    await sleep(100);
    
    const inputStateAfter = await page.evaluate(() => {
      return window.game.input.getState();
    });
    
    expect(inputStateAfter.forward).toBe(false);
    console.log('✅ Input system working correctly');
  });

  test('Input messages are sent to server', async () => {
    console.log('🧪 Test: Input-to-server communication...');
    
    await page.goto(`http://localhost:${devServerPort}`, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for game to initialize and connect
    await page.waitForFunction(() => {
      return window.game && 
             window.game.network && 
             window.game.network.isConnected() && 
             window.game.playerTank;
    }, { timeout: 15000 });
    
    // Set up message tracking
    await page.evaluate(() => {
      window.testData = {
        messagesSent: 0,
        lastInputMessage: null
      };
      
      // Override sendMessage to track calls
      const originalSendMessage = window.game.network.sendMessage;
      window.game.network.sendMessage = function(messageType, payload) {
        if (messageType === 'playerInput') {
          window.testData.messagesSent++;
          window.testData.lastInputMessage = payload;
        }
        return originalSendMessage.call(this, messageType, payload);
      };
    });
    
    // Send input
    await page.keyboard.down('KeyW');
    await sleep(200); // Wait for input to be processed
    await page.keyboard.up('KeyW');
    await sleep(200);
    
    // Check if messages were sent
    const testData = await page.evaluate(() => window.testData);
    
    expect(testData.messagesSent).toBeGreaterThan(0);
    expect(testData.lastInputMessage).toBeTruthy();
    expect(testData.lastInputMessage.forward).toBe(true);
    
    console.log(`✅ Sent ${testData.messagesSent} input messages to server`);
  });

  test('Mouse input controls turret angle', async () => {
    console.log('🧪 Test: Mouse input for turret control...');
    
    await page.goto(`http://localhost:${devServerPort}`, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for game to initialize
    await page.waitForFunction(() => {
      return window.game && window.game.input;
    }, { timeout: 15000 });
    
    // Get canvas element
    const canvas = await page.$('#gameCanvas');
    expect(canvas).toBeTruthy();
    
    // Move mouse to different positions and check turret angle
    await page.mouse.move(640, 360); // Center
    await sleep(100);
    
    const centerAngle = await page.evaluate(() => {
      return window.game.input.getState().turretAngle;
    });
    
    await page.mouse.move(800, 360); // Right
    await sleep(100);
    
    const rightAngle = await page.evaluate(() => {
      return window.game.input.getState().turretAngle;
    });
    
    // Turret angle should change when mouse moves
    expect(Math.abs(rightAngle - centerAngle)).toBeGreaterThan(0.1);
    
    console.log('✅ Mouse input controls turret angle correctly');
  });

  test('Complete input-to-server-to-client loop', async () => {
    console.log('🧪 Test: Complete input loop...');
    
    await page.goto(`http://localhost:${devServerPort}`, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for game to fully initialize
    await page.waitForFunction(() => {
      return window.game && 
             window.game.network && 
             window.game.network.isConnected() && 
             window.game.playerTank &&
             window.game.scene3D;
    }, { timeout: 15000 });
    
    // Get initial tank position
    const initialPosition = await page.evaluate(() => {
      return {
        x: window.game.playerTank.position.x,
        z: window.game.playerTank.position.z
      };
    });
    
    // Send movement input
    await page.keyboard.down('KeyW');
    await sleep(1000); // Hold for 1 second
    await page.keyboard.up('KeyW');
    
    // Wait for server response and tank movement
    await sleep(500);
    
    // Get final tank position
    const finalPosition = await page.evaluate(() => {
      return {
        x: window.game.playerTank.position.x,
        z: window.game.playerTank.position.z
      };
    });
    
    // Tank should have moved
    const distance = Math.sqrt(
      Math.pow(finalPosition.x - initialPosition.x, 2) + 
      Math.pow(finalPosition.z - initialPosition.z, 2)
    );
    
    expect(distance).toBeGreaterThan(0.1);
    
    console.log(`✅ Tank moved ${distance.toFixed(2)} units in response to input`);
  });

  test('Multiple input types work simultaneously', async () => {
    console.log('🧪 Test: Multiple simultaneous inputs...');
    
    await page.goto(`http://localhost:${devServerPort}`, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for game to initialize
    await page.waitForFunction(() => {
      return window.game && 
             window.game.network && 
             window.game.network.isConnected() && 
             window.game.playerTank;
    }, { timeout: 15000 });
    
    // Set up message tracking
    await page.evaluate(() => {
      window.testData = {
        inputMessages: []
      };
      
      const originalSendMessage = window.game.network.sendMessage;
      window.game.network.sendMessage = function(messageType, payload) {
        if (messageType === 'playerInput') {
          window.testData.inputMessages.push(payload);
        }
        return originalSendMessage.call(this, messageType, payload);
      };
    });
    
    // Perform multiple inputs simultaneously
    await page.keyboard.down('KeyW'); // Forward
    await page.keyboard.down('KeyA'); // Rotate left
    await page.mouse.move(800, 300);  // Aim turret
    await page.keyboard.down('Space'); // Fire
    
    await sleep(300);
    
    await page.keyboard.up('KeyW');
    await page.keyboard.up('KeyA');
    await page.keyboard.up('Space');
    
    await sleep(200);
    
    // Check captured input messages
    const testData = await page.evaluate(() => window.testData);
    
    expect(testData.inputMessages.length).toBeGreaterThan(0);
    
    // Find a message with multiple inputs active
    const multiInputMessage = testData.inputMessages.find(msg => 
      msg.forward && msg.rotateLeft && msg.fire
    );
    
    expect(multiInputMessage).toBeTruthy();
    expect(multiInputMessage.turretAngle).toBeDefined();
    
    console.log('✅ Multiple simultaneous inputs captured and sent correctly');
  });

  test('Input rate limiting works correctly', async () => {
    console.log('🧪 Test: Input rate limiting...');
    
    await page.goto(`http://localhost:${devServerPort}`, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for game to initialize
    await page.waitForFunction(() => {
      return window.game && 
             window.game.network && 
             window.game.network.isConnected() && 
             window.game.playerTank;
    }, { timeout: 15000 });
    
    // Set up message tracking
    await page.evaluate(() => {
      window.testData = {
        messageCount: 0,
        startTime: Date.now()
      };
      
      const originalSendMessage = window.game.network.sendMessage;
      window.game.network.sendMessage = function(messageType, payload) {
        if (messageType === 'playerInput') {
          window.testData.messageCount++;
        }
        return originalSendMessage.call(this, messageType, payload);
      };
    });
    
    // Rapidly press and release keys
    for (let i = 0; i < 20; i++) {
      await page.keyboard.down('KeyW');
      await page.keyboard.up('KeyW');
      await sleep(10); // Very fast input
    }
    
    await sleep(500); // Wait for any pending messages
    
    const testData = await page.evaluate(() => ({
      messageCount: window.testData.messageCount,
      duration: Date.now() - window.testData.startTime
    }));
    
    // Should not send excessive messages (rate limiting should apply)
    const messagesPerSecond = (testData.messageCount / testData.duration) * 1000;
    
    expect(messagesPerSecond).toBeLessThan(100); // Reasonable rate limit
    expect(testData.messageCount).toBeGreaterThan(0); // But some messages should get through
    
    console.log(`✅ Rate limiting working: ${testData.messageCount} messages in ${testData.duration}ms (${messagesPerSecond.toFixed(1)} msg/s)`);
  });
}); 