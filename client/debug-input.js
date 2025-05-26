const puppeteer = require('puppeteer');

async function debugInput() {
    let browser = null;
    
    try {
        console.log('🔍 Debugging Input System\n');
        
        browser = await puppeteer.launch({
            headless: false,
            devtools: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        
        // Capture console messages
        page.on('console', msg => {
            console.log(`Browser: ${msg.text()}`);
        });
        
        await page.goto('http://localhost:3000');
        await page.waitForTimeout(5000);

        // Check input system status
        const status = await page.evaluate(() => {
            if (!window.game) return { error: 'No game object' };
            
            return {
                hasInput: !!window.game.input,
                isConnected: window.game.network?.isConnected(),
                playerTank: !!window.game.playerTank,
                playerId: window.game.playerId,
                renderMode: window.game.renderMode,
                inputState: window.game.input ? {
                    forward: window.game.input.keys?.forward || false,
                    backward: window.game.input.keys?.backward || false,
                    rotateLeft: window.game.input.keys?.rotateLeft || false,
                    rotateRight: window.game.input.keys?.rotateRight || false
                } : null
            };
        });

        console.log('🎮 Game Status:');
        console.log('  Has Input System:', status.hasInput ? '✅' : '❌');
        console.log('  Connected:', status.isConnected ? '✅' : '❌');
        console.log('  Player Tank:', status.playerTank ? '✅' : '❌');
        console.log('  Player ID:', status.playerId);
        console.log('  Render Mode:', status.renderMode);
        console.log('  Input State:', status.inputState);

        // Test manual key press
        console.log('\n🧪 Testing manual W key press...');
        await page.evaluate(() => {
            console.log('🔧 Simulating W key press...');
            const event = new KeyboardEvent('keydown', { 
                key: 'w', 
                code: 'KeyW',
                bubbles: true 
            });
            document.dispatchEvent(event);
            
            // Also try direct input update
            if (window.game && window.game.input && window.game.input.keys) {
                console.log('🔧 Direct input state update...');
                window.game.input.keys.forward = true;
                window.game.input.hasChanges = true;
            }
        });

        await page.waitForTimeout(2000);

        // Check if input state changed
        const afterInput = await page.evaluate(() => {
            if (!window.game || !window.game.input) return null;
            
            return {
                inputState: {
                    forward: window.game.input.keys?.forward || false,
                    hasChanges: window.game.input.hasChanges || false
                },
                lastSequence: window.game.input.sequenceNumber || 0
            };
        });

        console.log('📊 After Input Test:', afterInput);

        // Check updateInput method
        const inputMethodTest = await page.evaluate(() => {
            if (!window.game) return { error: 'No game' };
            
            try {
                // Force call updateInput
                window.game.updateInput(0.016); // 60fps delta
                return { success: true };
            } catch (error) {
                return { error: error.message };
            }
        });

        console.log('🔧 Update Input Test:', inputMethodTest);

        console.log('\n👀 Browser will stay open for manual testing...');
        console.log('Try pressing W, A, S, D keys and watch the console');
        
        await page.waitForTimeout(30000);

    } catch (error) {
        console.error('❌ Debug Error:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

debugInput(); 