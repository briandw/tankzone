const puppeteer = require('puppeteer');

async function testConnectionStatus() {
    let browser = null;
    
    try {
        console.log('🎯 Testing Connection Status (Headless Mode)\n');
        
        // Launch headless browser
        console.log('🌐 Starting headless browser...');
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        
        // Capture console messages
        const consoleMessages = [];
        page.on('console', msg => {
            const message = msg.text();
            consoleMessages.push(message);
            console.log(`Browser: ${message}`);
        });
        
        page.on('pageerror', error => {
            console.error('Page Error:', error.message);
        });

        // Navigate to the client
        console.log('📱 Loading http://localhost:3000...');
        await page.goto('http://localhost:3000', { 
            waitUntil: 'domcontentloaded',
            timeout: 20000 
        });

        console.log('✅ Page loaded');

        // Wait for client initialization
        console.log('⏱️  Waiting for client initialization...');
        await page.waitForTimeout(3000);

        // Check if HUD elements exist
        const hudCheck = await page.evaluate(() => {
            const elements = {
                connectionStatus: document.getElementById('connectionStatus'),
                healthBar: document.getElementById('healthBar'),
                healthFill: document.getElementById('healthFill'),
                instructions: document.getElementById('instructions')
            };
            
            return {
                connectionStatusExists: !!elements.connectionStatus,
                connectionStatusText: elements.connectionStatus?.textContent?.trim() || 'NOT FOUND',
                healthBarExists: !!elements.healthBar,
                healthFillExists: !!elements.healthFill,
                instructionsExists: !!elements.instructions,
                instructionsText: elements.instructions?.textContent?.trim() || 'NOT FOUND'
            };
        });

        console.log('\n🔍 HUD Elements Check:');
        console.log(`  Connection Status Element: ${hudCheck.connectionStatusExists ? '✅' : '❌'}`);
        console.log(`  Connection Status Text: "${hudCheck.connectionStatusText}"`);
        console.log(`  Health Bar: ${hudCheck.healthBarExists ? '✅' : '❌'}`);
        console.log(`  Health Fill: ${hudCheck.healthFillExists ? '✅' : '❌'}`);
        console.log(`  Instructions: ${hudCheck.instructionsExists ? '✅' : '❌'}`);

        // Monitor connection status for 15 seconds
        console.log('\n⏱️  Monitoring connection status for 15 seconds...');
        const statusHistory = [hudCheck.connectionStatusText];
        let connectedDetected = false;

        for (let i = 0; i < 15; i++) {
            await page.waitForTimeout(1000);
            
            const currentStatus = await page.evaluate(() => {
                const element = document.getElementById('connectionStatus');
                return element ? element.textContent.trim() : 'NOT FOUND';
            });

            if (currentStatus !== statusHistory[statusHistory.length - 1]) {
                console.log(`📊 Status changed: "${statusHistory[statusHistory.length - 1]}" → "${currentStatus}"`);
                statusHistory.push(currentStatus);
                
                if (currentStatus.toLowerCase().includes('connected')) {
                    console.log('🎉 CONNECTED STATUS DETECTED!');
                    connectedDetected = true;
                    break;
                }
            }
            
            // Show progress every 5 seconds
            if ((i + 1) % 5 === 0) {
                console.log(`   ${i + 1}s elapsed - Current: "${currentStatus}"`);
            }
        }

        // Final status check
        const finalStatus = await page.evaluate(() => {
            const element = document.getElementById('connectionStatus');
            return element ? element.textContent.trim() : 'NOT FOUND';
        });

        console.log('\n📈 Connection Status Analysis:');
        console.log(`  Status History: ${JSON.stringify(statusHistory)}`);
        console.log(`  Final Status: "${finalStatus}"`);
        console.log(`  Connected Detected: ${connectedDetected ? '✅' : '❌'}`);

        // Check for specific status patterns
        const hasInitializing = statusHistory.some(s => s.toLowerCase().includes('initializing'));
        const hasConnecting = statusHistory.some(s => s.toLowerCase().includes('connecting') || s.toLowerCase().includes('joining'));
        const hasConnected = statusHistory.some(s => s.toLowerCase().includes('connected'));

        console.log('\n✅ Status Pattern Analysis:');
        console.log(`  Had "Initializing": ${hasInitializing ? '✅' : '❌'}`);
        console.log(`  Had "Connecting/Joining": ${hasConnecting ? '✅' : '❌'}`);
        console.log(`  Had "Connected": ${hasConnected ? '✅' : '❌'}`);

        // Check for WebSocket-related console messages
        const wsMessages = consoleMessages.filter(msg => 
            msg.toLowerCase().includes('websocket') || 
            msg.toLowerCase().includes('connected') ||
            msg.toLowerCase().includes('connection') ||
            msg.toLowerCase().includes('network')
        );

        if (wsMessages.length > 0) {
            console.log('\n🔗 WebSocket/Network Messages:');
            wsMessages.forEach(msg => console.log(`  ${msg}`));
        }

        // Take a screenshot for debugging
        await page.screenshot({ 
            path: 'headless-connection-test.png',
            fullPage: true 
        });
        console.log('\n📸 Screenshot saved as headless-connection-test.png');

        // Return results
        const success = hasConnected || finalStatus.toLowerCase().includes('connected');
        
        console.log('\n🏆 TEST RESULTS:');
        console.log('================');
        console.log(`Success: ${success ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Final Status: "${finalStatus}"`);
        console.log(`Connected Text Found: ${hasConnected ? 'YES' : 'NO'}`);

        if (success) {
            console.log('\n🎉 SUCCESS: Browser displays "Connected" status!');
        } else {
            console.log('\n❌ FAILURE: No "Connected" status detected');
            console.log('\n🔧 Possible Issues:');
            console.log('- Game server not running or not accessible');
            console.log('- WebSocket connection failing');
            console.log('- Protocol buffer issues');
            console.log('- Client initialization problems');
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
testConnectionStatus().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 