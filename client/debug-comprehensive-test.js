const puppeteer = require('puppeteer');

async function runComprehensiveDebugTest() {
    console.log('🔍 Starting comprehensive debug test...');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
        ]
    });
    
    const page = await browser.newPage();
    
    // Collect all console messages
    const consoleMessages = [];
    page.on('console', msg => {
        const text = msg.text();
        const type = msg.type();
        consoleMessages.push({ type, text, timestamp: Date.now() });
        console.log(`Browser [${type}]: ${text}`);
    });
    
    // Collect errors
    const errors = [];
    page.on('error', error => {
        errors.push(error.message);
        console.error('Browser Error:', error.message);
    });
    
    page.on('pageerror', error => {
        errors.push(error.message);
        console.error('Browser Page Error:', error.message);
    });
    
    try {
        console.log('🌐 Navigating to client...');
        await page.goto('http://localhost:8000', { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });
        
        console.log('⏳ Waiting for client initialization...');
        
        // Wait for the game object to be available
        await page.waitForFunction(() => window.game, { timeout: 10000 });
        console.log('✅ Game object available');
        
        // Wait a bit more for initialization to complete
        await page.waitForTimeout(5000);
        
        // Get detailed game state
        const gameState = await page.evaluate(() => {
            const game = window.game;
            return {
                renderMode: game.renderMode,
                isRunning: game.isRunning,
                frameCount: game.frameCount,
                gameStateUpdateCount: game.gameStateUpdateCount,
                tankCreateCount: game.tankCreateCount,
                tanksSize: game.tanks.size,
                playerId: game.playerId,
                playerTank: !!game.playerTank,
                
                // Scene3D state
                scene3D: {
                    scene: !!game.scene3D?.scene,
                    camera: !!game.scene3D?.camera,
                    renderer: !!game.scene3D?.renderer,
                    sceneChildren: game.scene3D?.scene?.children?.length || 0
                },
                
                // Fallback2D state
                fallback2D: {
                    exists: !!game.fallback2D,
                    canvas: !!game.fallback2D?.canvas,
                    ctx: !!game.fallback2D?.ctx
                },
                
                // Network state
                network: {
                    connected: game.network?.isConnected() || false,
                    url: game.network?.url || 'unknown'
                },
                
                // Canvas state
                canvas: {
                    exists: !!game.canvas,
                    width: game.canvas?.width || 0,
                    height: game.canvas?.height || 0,
                    clientWidth: game.canvas?.clientWidth || 0,
                    clientHeight: game.canvas?.clientHeight || 0
                }
            };
        });
        
        console.log('\n📊 GAME STATE ANALYSIS:');
        console.log('========================');
        console.log('Render Mode:', gameState.renderMode);
        console.log('Game Running:', gameState.isRunning);
        console.log('Frame Count:', gameState.frameCount);
        console.log('Game State Updates:', gameState.gameStateUpdateCount);
        console.log('Tanks Created:', gameState.tankCreateCount);
        console.log('Active Tanks:', gameState.tanksSize);
        console.log('Player ID:', gameState.playerId);
        console.log('Player Tank:', gameState.playerTank);
        
        console.log('\n🎬 3D SCENE STATE:');
        console.log('==================');
        console.log('Scene Object:', gameState.scene3D.scene);
        console.log('Camera Object:', gameState.scene3D.camera);
        console.log('Renderer Object:', gameState.scene3D.renderer);
        console.log('Scene Children:', gameState.scene3D.sceneChildren);
        
        console.log('\n🎨 2D FALLBACK STATE:');
        console.log('=====================');
        console.log('Fallback2D Exists:', gameState.fallback2D.exists);
        console.log('Canvas Available:', gameState.fallback2D.canvas);
        console.log('Context Available:', gameState.fallback2D.ctx);
        
        console.log('\n🌐 NETWORK STATE:');
        console.log('=================');
        console.log('Connected:', gameState.network.connected);
        console.log('URL:', gameState.network.url);
        
        console.log('\n🖼️ CANVAS STATE:');
        console.log('================');
        console.log('Canvas Exists:', gameState.canvas.exists);
        console.log('Canvas Size:', `${gameState.canvas.width}x${gameState.canvas.height}`);
        console.log('Client Size:', `${gameState.canvas.clientWidth}x${gameState.canvas.clientHeight}`);
        
        // Check for specific tank-related logs
        const tankLogs = consoleMessages.filter(msg => 
            msg.text.includes('Tank') || 
            msg.text.includes('🚗') || 
            msg.text.includes('🆕') ||
            msg.text.includes('mesh')
        );
        
        console.log('\n🚗 TANK-RELATED LOGS:');
        console.log('=====================');
        tankLogs.forEach(log => {
            console.log(`[${log.type}] ${log.text}`);
        });
        
        // Check for rendering logs
        const renderLogs = consoleMessages.filter(msg => 
            msg.text.includes('Rendering') || 
            msg.text.includes('🎬') || 
            msg.text.includes('🎨') ||
            msg.text.includes('render')
        );
        
        console.log('\n🎬 RENDERING LOGS:');
        console.log('==================');
        renderLogs.forEach(log => {
            console.log(`[${log.type}] ${log.text}`);
        });
        
        // Check for WebGL/3D related logs
        const webglLogs = consoleMessages.filter(msg => 
            msg.text.includes('WebGL') || 
            msg.text.includes('3D') || 
            msg.text.includes('Scene') ||
            msg.text.includes('renderer')
        );
        
        console.log('\n🖥️ WEBGL/3D LOGS:');
        console.log('=================');
        webglLogs.forEach(log => {
            console.log(`[${log.type}] ${log.text}`);
        });
        
        // Take a screenshot for visual inspection
        console.log('\n📸 Taking screenshot...');
        await page.screenshot({ 
            path: 'debug-screenshot.png',
            fullPage: true 
        });
        console.log('✅ Screenshot saved as debug-screenshot.png');
        
        // Summary
        console.log('\n🔍 ANALYSIS SUMMARY:');
        console.log('====================');
        
        if (gameState.renderMode === '3d' && gameState.scene3D.renderer) {
            console.log('✅ 3D mode active with renderer');
        } else if (gameState.renderMode === '2d' && gameState.fallback2D.exists) {
            console.log('✅ 2D fallback mode active');
        } else {
            console.log('❌ No rendering mode active');
        }
        
        if (gameState.network.connected) {
            console.log('✅ Network connected');
        } else {
            console.log('❌ Network not connected');
        }
        
        if (gameState.gameStateUpdateCount > 0) {
            console.log('✅ Receiving game state updates');
        } else {
            console.log('❌ No game state updates received');
        }
        
        if (gameState.tankCreateCount > 0) {
            console.log('✅ Tanks have been created');
        } else {
            console.log('❌ No tanks created yet');
        }
        
        if (gameState.frameCount > 0) {
            console.log('✅ Game loop running');
        } else {
            console.log('❌ Game loop not running');
        }
        
        // Error summary
        if (errors.length > 0) {
            console.log('\n❌ ERRORS DETECTED:');
            console.log('===================');
            errors.forEach(error => console.log('Error:', error));
        } else {
            console.log('\n✅ No JavaScript errors detected');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

// Run the test
runComprehensiveDebugTest().catch(console.error); 