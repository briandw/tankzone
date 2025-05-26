const puppeteer = require('puppeteer');

async function checkConnectedText() {
    let browser = null;
    
    try {
        console.log('🎯 Checking for "Connected" text in browser\n');
        
        // Launch browser
        console.log('🌐 Opening browser...');
        browser = await puppeteer.launch({
            headless: false,
            devtools: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        
        // Listen to console messages
        page.on('console', msg => {
            console.log(`Browser: ${msg.text()}`);
        });
        
        page.on('pageerror', error => {
            console.error('Page Error:', error.message);
        });

        // Navigate to the client
        console.log('📱 Loading http://localhost:3000...');
        await page.goto('http://localhost:3000', { 
            waitUntil: 'networkidle0',
            timeout: 15000 
        });

        console.log('✅ Page loaded successfully');

        // Wait a bit for the client to initialize
        console.log('⏱️  Waiting 5 seconds for client initialization...');
        await page.waitForTimeout(5000);

        // Check for connection status element
        const connectionStatus = await page.evaluate(() => {
            const element = document.getElementById('connectionStatus');
            return element ? element.textContent.trim() : null;
        });

        console.log(`📊 Connection Status: "${connectionStatus}"`);

        // Check if it contains "connected"
        const isConnected = connectionStatus && connectionStatus.toLowerCase().includes('connected');
        
        // Check all HUD elements
        const hudElements = await page.evaluate(() => {
            return {
                connectionStatus: document.getElementById('connectionStatus')?.textContent || 'NOT FOUND',
                healthBar: !!document.getElementById('healthBar'),
                healthFill: !!document.getElementById('healthFill'),
                instructions: document.getElementById('instructions')?.textContent || 'NOT FOUND'
            };
        });

        console.log('\n🔍 HUD Elements:');
        console.log('  Connection Status:', hudElements.connectionStatus);
        console.log('  Health Bar:', hudElements.healthBar ? '✅ Found' : '❌ Missing');
        console.log('  Health Fill:', hudElements.healthFill ? '✅ Found' : '❌ Missing');
        console.log('  Instructions:', hudElements.instructions.includes('NOT FOUND') ? '❌ Missing' : '✅ Found');

        // Take screenshot
        await page.screenshot({ 
            path: 'connected-text-check.png',
            fullPage: true 
        });
        console.log('📸 Screenshot saved as connected-text-check.png');

        // Wait a bit longer to see if status changes
        console.log('\n⏱️  Waiting 10 more seconds to monitor status changes...');
        for (let i = 0; i < 10; i++) {
            await page.waitForTimeout(1000);
            const currentStatus = await page.evaluate(() => {
                const element = document.getElementById('connectionStatus');
                return element ? element.textContent.trim() : null;
            });
            
            if (currentStatus !== connectionStatus) {
                console.log(`📊 Status changed to: "${currentStatus}"`);
                
                if (currentStatus && currentStatus.toLowerCase().includes('connected')) {
                    console.log('🎉 CONNECTED STATUS DETECTED!');
                    
                    // Final screenshot
                    await page.screenshot({ 
                        path: 'connected-final.png',
                        fullPage: true 
                    });
                    console.log('📸 Final screenshot saved as connected-final.png');
                    
                    console.log('\n✅ SUCCESS: Browser shows "Connected" text!');
                    return true;
                }
            }
        }

        // Final check
        const finalStatus = await page.evaluate(() => {
            const element = document.getElementById('connectionStatus');
            return element ? element.textContent.trim() : null;
        });

        console.log(`📊 Final status: "${finalStatus}"`);
        
        if (finalStatus && finalStatus.toLowerCase().includes('connected')) {
            console.log('\n✅ SUCCESS: Browser shows "Connected" text!');
            return true;
        } else {
            console.log('\n❌ FAILURE: Browser does not show "Connected" text');
            console.log('Current status:', finalStatus);
            return false;
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        return false;
    } finally {
        if (browser) {
            console.log('\n🧹 Closing browser...');
            await browser.close();
        }
    }
}

// Run the check
checkConnectedText().then(success => {
    console.log('\n🏆 RESULT:', success ? 'PASS ✅' : 'FAIL ❌');
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 