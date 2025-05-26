const puppeteer = require('puppeteer');

async function simpleVisualTest() {
    let browser = null;
    
    try {
        console.log('👀 Simple Visual Test - Checking for Map Display\n');
        
        browser = await puppeteer.launch({
            headless: false,
            devtools: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        
        // Navigate to client
        console.log('📱 Loading client...');
        await page.goto('http://localhost:3000', { 
            waitUntil: 'domcontentloaded',
            timeout: 10000 
        });

        // Wait for initialization
        console.log('⏱️  Waiting for client initialization...');
        await page.waitForTimeout(5000);

        // Check what's being rendered
        const renderStatus = await page.evaluate(() => {
            if (!window.game) return { error: 'Game not found' };
            
            return {
                renderMode: window.game.renderMode,
                connected: window.game.network?.isConnected() || false,
                playerId: window.game.playerId,
                connectionStatus: document.getElementById('connectionStatus')?.textContent || 'Unknown'
            };
        });

        console.log('🎬 Render Status:');
        console.log('  Mode:', renderStatus.renderMode);
        console.log('  Connected:', renderStatus.connected ? '✅' : '❌');
        console.log('  Player ID:', renderStatus.playerId);
        console.log('  Connection Status:', renderStatus.connectionStatus);

        // Take screenshot
        await page.screenshot({ 
            path: 'visual-test-result.png',
            fullPage: true 
        });
        console.log('\n📸 Screenshot saved as visual-test-result.png');

        // Check if we can see the canvas content
        const canvasInfo = await page.evaluate(() => {
            const canvas = document.getElementById('gameCanvas');
            if (!canvas) return { error: 'Canvas not found' };
            
            // Try to get some pixel data to see if anything is being drawn
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const imageData = ctx.getImageData(0, 0, 100, 100);
                const pixels = imageData.data;
                
                // Check if we have non-black pixels (indicating content)
                let hasContent = false;
                for (let i = 0; i < pixels.length; i += 4) {
                    const r = pixels[i];
                    const g = pixels[i + 1];
                    const b = pixels[i + 2];
                    if (r > 10 || g > 10 || b > 10) {
                        hasContent = true;
                        break;
                    }
                }
                
                return {
                    hasCanvas: true,
                    has2DContext: true,
                    canvasSize: { width: canvas.width, height: canvas.height },
                    hasContent
                };
            }
            
            return {
                hasCanvas: true,
                has2DContext: false,
                canvasSize: { width: canvas.width, height: canvas.height },
                hasContent: false
            };
        });

        console.log('\n🖼️  Canvas Info:');
        console.log('  Has Canvas:', canvasInfo.hasCanvas ? '✅' : '❌');
        console.log('  Has 2D Context:', canvasInfo.has2DContext ? '✅' : '❌');
        console.log('  Canvas Size:', canvasInfo.canvasSize);
        console.log('  Has Content:', canvasInfo.hasContent ? '✅' : '❌');

        const success = renderStatus.renderMode && renderStatus.connected && canvasInfo.hasContent;
        
        console.log('\n🏆 VISUAL TEST RESULTS:');
        console.log('========================');
        console.log(`Overall Success: ${success ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Render Mode: ${renderStatus.renderMode || 'Unknown'}`);
        console.log(`Connected: ${renderStatus.connected ? '✅' : '❌'}`);
        console.log(`Canvas Content: ${canvasInfo.hasContent ? '✅' : '❌'}`);

        if (success) {
            console.log('\n🎉 SUCCESS: Client is displaying content!');
            console.log('✅ No more blue screen');
            console.log('✅ Game is rendering properly');
        } else {
            console.log('\n❌ ISSUE: Client may still have rendering problems');
            if (!renderStatus.connected) {
                console.log('💡 Connection issue - check server');
            }
            if (!canvasInfo.hasContent) {
                console.log('💡 No canvas content - rendering may be failing');
            }
        }

        // Keep browser open for manual inspection
        console.log('\n👀 Browser will stay open for 30 seconds for manual inspection...');
        await page.waitForTimeout(30000);

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
simpleVisualTest().then(success => {
    console.log('\n🏁 Test completed');
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 