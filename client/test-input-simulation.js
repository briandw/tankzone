const puppeteer = require('puppeteer');
const path = require('path');

async function testInputSimulation() {
    console.log('🎮 Starting input simulation test...');
    
    const browser = await puppeteer.launch({
        headless: false, // Show browser for visual debugging
        devtools: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Enable console logging
        page.on('console', msg => {
            const type = msg.type();
            if (type === 'log') console.log('Browser [log]:', msg.text());
            else if (type === 'warn') console.log('Browser [warn]:', msg.text());
            else if (type === 'error') console.log('Browser [error]:', msg.text());
        });
        
        // Navigate to the client
        const clientUrl = 'http://localhost:3000';
        console.log(`🌐 Navigating to ${clientUrl}...`);
        await page.goto(clientUrl, { waitUntil: 'networkidle0', timeout: 30000 });
        
        // Wait for game to initialize
        console.log('⏳ Waiting for game initialization...');
        await page.waitForFunction(() => window.game && window.game.isRunning, { timeout: 10000 });
        
        // Wait a bit more for connection to stabilize
        await page.waitForTimeout(2000);
        
        // Check initial state
        const initialState = await page.evaluate(() => ({
            connected: window.game.network.isConnected(),
            playerId: window.game.playerId,
            tankCount: window.game.tanks.size,
            renderMode: window.game.renderMode
        }));
        
        console.log('📊 Initial state:', initialState);
        
        // Simulate key presses to trigger movement
        console.log('🎮 Simulating WASD input...');
        
        // Focus the canvas
        await page.click('#gameCanvas');
        
        // Send movement input
        console.log('⬆️ Pressing W (forward)...');
        await page.keyboard.down('KeyW');
        await page.waitForTimeout(500);
        await page.keyboard.up('KeyW');
        
        console.log('⬅️ Pressing A (turn left)...');
        await page.keyboard.down('KeyA');
        await page.waitForTimeout(500);
        await page.keyboard.up('KeyA');
        
        console.log('⬇️ Pressing S (backward)...');
        await page.keyboard.down('KeyS');
        await page.waitForTimeout(500);
        await page.keyboard.up('KeyS');
        
        console.log('➡️ Pressing D (turn right)...');
        await page.keyboard.down('KeyD');
        await page.waitForTimeout(500);
        await page.keyboard.up('KeyD');
        
        console.log('🔥 Pressing Space (fire)...');
        await page.keyboard.down('Space');
        await page.waitForTimeout(200);
        await page.keyboard.up('Space');
        
        // Wait for server response
        await page.waitForTimeout(2000);
        
        // Check state after input
        const afterInputState = await page.evaluate(() => ({
            connected: window.game.network.isConnected(),
            playerId: window.game.playerId,
            tankCount: window.game.tanks.size,
            renderMode: window.game.renderMode,
            playerTank: window.game.playerTank ? {
                id: window.game.playerTank.id,
                position: window.game.playerTank.position
            } : null,
            gameStateUpdates: window.game.gameStateUpdateCount,
            frameCount: window.game.frameCount
        }));
        
        console.log('📊 State after input:', afterInputState);
        
        // Check for any tanks in the game
        const tankDetails = await page.evaluate(() => {
            const tanks = [];
            for (const [id, tank] of window.game.tanks) {
                tanks.push({
                    id: id,
                    playerId: tank.playerId,
                    position: tank.position,
                    health: tank.health
                });
            }
            return tanks;
        });
        
        console.log('🚗 Tank details:', tankDetails);
        
        // Take a screenshot
        await page.screenshot({ path: 'input-simulation-test.png', fullPage: true });
        console.log('📸 Screenshot saved as input-simulation-test.png');
        
        // Keep browser open for manual inspection
        console.log('🔍 Browser will stay open for 30 seconds for manual inspection...');
        await page.waitForTimeout(30000);
        
        if (tankDetails.length > 0) {
            console.log('✅ SUCCESS: Tanks were created!');
        } else {
            console.log('❌ No tanks found. This might indicate a server-side issue.');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
}

testInputSimulation().catch(console.error); 