const puppeteer = require('puppeteer');

async function debugConnectionFlow() {
    let browser = null;
    
    try {
        console.log('🔍 Debugging Connection Flow\n');
        
        browser = await puppeteer.launch({
            headless: false,
            devtools: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        
        // Capture all console messages with timestamps
        const consoleLog = [];
        page.on('console', msg => {
            const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
            const message = `[${timestamp}] ${msg.text()}`;
            consoleLog.push(message);
            console.log(message);
        });
        
        page.on('pageerror', error => {
            console.error('Page Error:', error.message);
        });

        // Navigate to client
        console.log('📱 Loading client...');
        await page.goto('http://localhost:3000', { 
            waitUntil: 'domcontentloaded',
            timeout: 15000 
        });

        // Wait for initialization
        await page.waitForTimeout(2000);

        // Inject debugging code to monitor network events
        await page.evaluate(() => {
            // Hook into the network manager to log all events
            if (window.game && window.game.network) {
                const network = window.game.network;
                const originalEmit = network.emit.bind(network);
                
                network.emit = function(event, data) {
                    console.log(`🔔 Network Event: ${event}`, data);
                    return originalEmit(event, data);
                };
                
                console.log('🔧 Network event monitoring enabled');
            }
        });

        // Monitor connection status changes
        let statusHistory = [];
        
        for (let i = 0; i < 20; i++) {
            await page.waitForTimeout(1000);
            
            const currentStatus = await page.evaluate(() => {
                const element = document.getElementById('connectionStatus');
                return element ? element.textContent.trim() : 'NOT FOUND';
            });
            
            if (statusHistory.length === 0 || currentStatus !== statusHistory[statusHistory.length - 1]) {
                console.log(`📊 Status: "${currentStatus}"`);
                statusHistory.push(currentStatus);
                
                if (currentStatus.toLowerCase().includes('connected')) {
                    console.log('🎉 CONNECTED STATUS DETECTED!');
                    break;
                }
            }
            
            // Show progress
            if ((i + 1) % 5 === 0) {
                console.log(`   ${i + 1}s elapsed...`);
            }
        }

        // Force trigger network events to test the flow
        console.log('\n🔧 Testing network event flow...');
        await page.evaluate(() => {
            if (window.game && window.game.network) {
                console.log('🧪 Manually triggering connected event...');
                window.game.network.emit('connected');
                
                setTimeout(() => {
                    console.log('🧪 Manually triggering joinGameResponse...');
                    window.game.network.emit('joinGameResponse', {
                        success: true,
                        playerId: 'test-player-123'
                    });
                }, 2000);
            }
        });

        // Wait for manual events to process
        await page.waitForTimeout(5000);

        // Final status check
        const finalStatus = await page.evaluate(() => {
            const element = document.getElementById('connectionStatus');
            return element ? element.textContent.trim() : 'NOT FOUND';
        });

        console.log('\n📈 Connection Flow Analysis:');
        console.log('Status History:', statusHistory);
        console.log('Final Status:', finalStatus);
        
        // Check if manual events worked
        const manualEventsWorked = finalStatus.toLowerCase().includes('connected');
        console.log('Manual Events Worked:', manualEventsWorked ? '✅' : '❌');

        if (manualEventsWorked) {
            console.log('\n💡 DIAGNOSIS: Network event handlers work correctly');
            console.log('   The issue is that the server is not sending joinGameResponse');
            console.log('   or the WebSocket connected event is not being emitted properly');
        } else {
            console.log('\n💡 DIAGNOSIS: Network event handlers are not working');
            console.log('   There may be an issue with the event system or HUD updates');
        }

        // Take screenshot
        await page.screenshot({ 
            path: 'debug-connection-flow.png',
            fullPage: true 
        });
        console.log('\n📸 Screenshot saved as debug-connection-flow.png');

        // Wait a bit more to see the final state
        console.log('\n⏱️  Waiting 5 more seconds to observe...');
        await page.waitForTimeout(5000);

        return {
            statusHistory,
            finalStatus,
            manualEventsWorked,
            consoleLog
        };

    } catch (error) {
        console.error('❌ Debug Error:', error.message);
        return null;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the debug
debugConnectionFlow().then(results => {
    if (results) {
        console.log('\n🏆 DEBUG COMPLETE');
        console.log('Results:', {
            statusChanges: results.statusHistory.length,
            finalStatus: results.finalStatus,
            manualEventsWorked: results.manualEventsWorked
        });
    }
    process.exit(0);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 