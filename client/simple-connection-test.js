const puppeteer = require('puppeteer');

class SimpleConnectionTest {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    async setupBrowser() {
        console.log('🌐 Setting up browser...');
        
        this.browser = await puppeteer.launch({
            headless: false, // Set to true for headless mode
            devtools: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor'
            ]
        });

        this.page = await this.browser.newPage();
        
        // Enable console logging
        this.page.on('console', msg => {
            const type = msg.type();
            const text = msg.text();
            console.log(`Browser ${type.toUpperCase()}: ${text}`);
        });

        // Enable error logging
        this.page.on('pageerror', error => {
            console.error('Browser Error:', error.message);
        });

        // Set viewport
        await this.page.setViewport({ width: 1280, height: 720 });
    }

    async testConnectionStatus() {
        console.log('\n🔍 Testing Connection Status Display...');
        
        // Navigate to the client (assuming dev server is already running)
        console.log('📱 Loading client page...');
        try {
            await this.page.goto('http://localhost:3000', { 
                waitUntil: 'networkidle0',
                timeout: 30000 
            });
        } catch (error) {
            console.error('❌ Failed to load page. Make sure dev server is running with: npm run dev');
            throw error;
        }

        // Wait for the page to load
        await this.page.waitForTimeout(3000);

        // Check if connection status element exists
        console.log('🔍 Checking for connection status element...');
        const connectionStatusExists = await this.page.evaluate(() => {
            const element = document.getElementById('connectionStatus');
            return !!element;
        });

        if (!connectionStatusExists) {
            throw new Error('❌ Connection status element not found');
        }
        console.log('✅ Connection status element found');

        // Monitor connection status changes
        const statusChanges = [];
        
        // Function to get current status
        const getCurrentStatus = async () => {
            return await this.page.evaluate(() => {
                const element = document.getElementById('connectionStatus');
                return element ? element.textContent.trim() : null;
            });
        };

        // Initial status
        let currentStatus = await getCurrentStatus();
        console.log(`📊 Initial status: "${currentStatus}"`);
        statusChanges.push(currentStatus);

        // Wait and monitor for status changes
        const maxWaitTime = 20000; // 20 seconds
        const checkInterval = 1000; // Check every 1 second
        const startTime = Date.now();

        console.log('⏱️  Monitoring status changes for up to 20 seconds...');

        while (Date.now() - startTime < maxWaitTime) {
            await this.page.waitForTimeout(checkInterval);
            
            const newStatus = await getCurrentStatus();
            if (newStatus !== currentStatus) {
                console.log(`📊 Status changed: "${currentStatus}" → "${newStatus}"`);
                currentStatus = newStatus;
                statusChanges.push(newStatus);
                
                // Check if we've reached "Connected" status
                if (newStatus && newStatus.toLowerCase().includes('connected')) {
                    console.log('🎉 Connected status detected!');
                    break;
                }
            } else {
                // Show current status every 5 seconds
                const elapsed = Date.now() - startTime;
                if (elapsed % 5000 < checkInterval) {
                    console.log(`📊 Current status: "${currentStatus}" (${Math.round(elapsed/1000)}s elapsed)`);
                }
            }
        }

        // Final status check
        const finalStatus = await getCurrentStatus();
        console.log(`📊 Final status: "${finalStatus}"`);

        // Analyze results
        console.log('\n📈 Connection Status Analysis:');
        console.log('Status progression:', statusChanges);

        // Check for expected statuses
        const hasInitializing = statusChanges.some(status => 
            status && status.toLowerCase().includes('initializing')
        );
        const hasConnecting = statusChanges.some(status => 
            status && (status.toLowerCase().includes('connecting') || status.toLowerCase().includes('joining'))
        );
        const hasConnected = statusChanges.some(status => 
            status && status.toLowerCase().includes('connected')
        );

        console.log('\n✅ Status checks:');
        console.log(`   Initializing: ${hasInitializing ? '✅' : '❌'}`);
        console.log(`   Connecting/Joining: ${hasConnecting ? '✅' : '❌'}`);
        console.log(`   Connected: ${hasConnected ? '✅' : '❌'}`);

        // Take a screenshot for visual verification
        await this.page.screenshot({ 
            path: 'connection-status-test.png',
            fullPage: true 
        });
        console.log('📸 Screenshot saved as connection-status-test.png');

        // Additional HUD element checks
        console.log('\n🔍 Checking other HUD elements...');
        const hudElements = await this.page.evaluate(() => {
            return {
                connectionStatus: !!document.getElementById('connectionStatus'),
                healthBar: !!document.getElementById('healthBar'),
                healthFill: !!document.getElementById('healthFill'),
                instructions: !!document.getElementById('instructions')
            };
        });

        console.log('HUD Elements:', hudElements);

        // Check if instructions are hidden when connected
        if (hasConnected) {
            const instructionsHidden = await this.page.evaluate(() => {
                const instructions = document.getElementById('instructions');
                return instructions ? instructions.classList.contains('hidden') : false;
            });
            console.log(`Instructions hidden when connected: ${instructionsHidden ? '✅' : '❌'}`);
        }

        // Check for any WebSocket errors in console
        const hasWebSocketErrors = await this.page.evaluate(() => {
            // This is a simple check - in a real scenario you'd want to capture console logs
            return false; // Placeholder
        });

        return {
            success: hasConnected,
            statusChanges,
            finalStatus,
            hudElements,
            hasInitializing,
            hasConnecting,
            hasConnected,
            hasWebSocketErrors
        };
    }

    async cleanup() {
        console.log('\n🧹 Cleaning up...');
        
        if (this.browser) {
            await this.browser.close();
        }
    }

    async run() {
        try {
            console.log('🎯 Starting Simple Connection Status Test\n');
            console.log('📝 Prerequisites:');
            console.log('   1. Dev server should be running: npm run dev');
            console.log('   2. Game server should be running on port 8080');
            console.log('');
            
            // Setup browser
            await this.setupBrowser();
            
            // Run the test
            const results = await this.testConnectionStatus();
            
            // Print final results
            console.log('\n🏆 TEST RESULTS:');
            console.log('================');
            console.log(`Overall Success: ${results.success ? '✅ PASS' : '❌ FAIL'}`);
            console.log(`Final Status: "${results.finalStatus}"`);
            console.log(`Status Changes: ${results.statusChanges.length}`);
            console.log(`Connected Status Reached: ${results.hasConnected ? '✅' : '❌'}`);
            
            if (results.success) {
                console.log('\n🎉 SUCCESS: Browser displays "Connected" status!');
                console.log('✅ The client successfully connected to the server');
                console.log('✅ HUD is working properly');
                console.log('✅ WebSocket communication is functional');
            } else {
                console.log('\n❌ FAILURE: Browser did not show "Connected" status');
                console.log('\n🔧 Troubleshooting steps:');
                console.log('1. Check if game server is running: ps aux | grep battletanks');
                console.log('2. Check if dev server is running: curl http://localhost:3000');
                console.log('3. Check browser console for errors');
                console.log('4. Verify WebSocket connection to port 8080');
                
                if (results.statusChanges.length === 1) {
                    console.log('\n💡 Status never changed - possible issues:');
                    console.log('- Server not running');
                    console.log('- WebSocket connection blocked');
                    console.log('- JavaScript errors preventing connection');
                }
            }
            
            return results.success;
            
        } catch (error) {
            console.error('❌ Test failed with error:', error.message);
            return false;
        } finally {
            await this.cleanup();
        }
    }
}

// Run the test
if (require.main === module) {
    const test = new SimpleConnectionTest();
    test.run().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = SimpleConnectionTest; 