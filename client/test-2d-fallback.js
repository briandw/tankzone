const puppeteer = require('puppeteer');

async function test2DFallback() {
    let browser = null;
    
    try {
        console.log('🎨 Testing 2D Fallback Renderer\n');
        
        browser = await puppeteer.launch({
            headless: false,
            devtools: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-webgl',  // Force WebGL to fail
                '--disable-webgl2'
            ]
        });

        const page = await browser.newPage();
        
        // Capture console messages
        page.on('console', msg => {
            const type = msg.type();
            const text = msg.text();
            console.log(`Browser ${type.toUpperCase()}: ${text}`);
        });
        
        page.on('pageerror', error => {
            console.error('Page Error:', error.message);
        });

        // Navigate to client
        console.log('📱 Loading client with WebGL disabled...');
        await page.goto('http://localhost:3000', { 
            waitUntil: 'domcontentloaded',
            timeout: 15000 
        });

        // Wait for initialization
        await page.waitForTimeout(5000);

        // Check render mode
        const renderInfo = await page.evaluate(() => {
            if (!window.game) return { error: 'Game not found' };
            
            return {
                renderMode: window.game.renderMode,
                has3D: !!window.game.scene3D?.renderer,
                has2D: !!window.game.fallback2D?.ctx,
                canvasSize: {
                    width: window.game.canvas.width,
                    height: window.game.canvas.height
                },
                tankCount: window.game.tanks.size,
                playerId: window.game.playerId
            };
        });

        console.log('\n🎬 Render Mode Check:');
        console.log('  Render Mode:', renderInfo.renderMode);
        console.log('  3D Renderer:', renderInfo.has3D ? '✅' : '❌');
        console.log('  2D Renderer:', renderInfo.has2D ? '✅' : '❌');
        console.log('  Canvas Size:', renderInfo.canvasSize);
        console.log('  Tank Count:', renderInfo.tankCount);
        console.log('  Player ID:', renderInfo.playerId);

        // Take screenshot
        await page.screenshot({ 
            path: 'test-2d-fallback.png',
            fullPage: true 
        });
        console.log('\n📸 Screenshot saved as test-2d-fallback.png');

        // Wait for game state updates
        console.log('\n⏱️  Waiting for game state updates...');
        await page.waitForTimeout(10000);

        // Check if tanks are being rendered in 2D
        const tankInfo = await page.evaluate(() => {
            if (!window.game || !window.game.fallback2D) return { error: 'No 2D renderer' };
            
            return {
                tanks2D: window.game.fallback2D.tanks.size,
                playerTankSet: Array.from(window.game.fallback2D.tanks.values()).some(t => t.isPlayer),
                cameraPosition: {
                    x: window.game.fallback2D.cameraX,
                    y: window.game.fallback2D.cameraY
                }
            };
        });

        console.log('\n🚗 2D Tank Rendering:');
        console.log('  Tanks in 2D:', tankInfo.tanks2D);
        console.log('  Player Tank Set:', tankInfo.playerTankSet ? '✅' : '❌');
        console.log('  Camera Position:', tankInfo.cameraPosition);

        // Take final screenshot
        await page.screenshot({ 
            path: 'test-2d-fallback-final.png',
            fullPage: true 
        });
        console.log('📸 Final screenshot saved as test-2d-fallback-final.png');

        // Test manual rendering
        console.log('\n🧪 Testing manual 2D render...');
        await page.evaluate(() => {
            if (window.game && window.game.fallback2D) {
                // Add a test tank manually
                window.game.fallback2D.addTank('test-tank', {
                    position: { x: 10, z: 10 },
                    rotation: 0,
                    turretAngle: 0.5,
                    health: 75,
                    maxHealth: 100,
                    playerId: 'test-player'
                });
                
                // Force a render
                window.game.fallback2D.render();
                console.log('🧪 Manual test tank added and rendered');
            }
        });

        await page.waitForTimeout(2000);
        await page.screenshot({ 
            path: 'test-2d-manual-tank.png',
            fullPage: true 
        });
        console.log('📸 Manual tank test screenshot saved');

        const success = renderInfo.renderMode === '2d' && renderInfo.has2D;
        
        console.log('\n🏆 TEST RESULTS:');
        console.log('================');
        console.log(`2D Fallback Working: ${success ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Render Mode: ${renderInfo.renderMode}`);
        console.log(`Canvas Rendering: ${renderInfo.has2D ? '✅' : '❌'}`);

        if (success) {
            console.log('\n🎉 SUCCESS: 2D fallback renderer is working!');
            console.log('✅ WebGL failure properly handled');
            console.log('✅ 2D canvas rendering active');
            console.log('✅ Game should show map instead of blue screen');
        } else {
            console.log('\n❌ FAILURE: 2D fallback not working properly');
        }

        return success;

    } catch (error) {
        console.error('❌ Test Error:', error.message);
        return false;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
test2DFallback().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 