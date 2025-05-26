const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const path = require('path');

class ConnectionStatusTest {
    constructor() {
        this.browser = null;
        this.page = null;
        this.serverProcess = null;
        this.devServerProcess = null;
    }

    async startTestServer() {
        console.log('🚀 Starting test server...');
        
        return new Promise((resolve, reject) => {
            const serverPath = path.join(__dirname, '..', 'target', 'debug', 'battletanks');
            this.serverProcess = spawn(serverPath, [], {
                stdio: 'pipe',
                cwd: path.join(__dirname, '..')
            });

            this.serverProcess.stdout.on('data', (data) => {
                const output = data.toString();
                console.log(`Server: ${output.trim()}`);
                
                if (output.includes('Server listening on')) {
                    setTimeout(resolve, 1000); // Give server time to fully start
                }
            });

            this.serverProcess.stderr.on('data', (data) => {
                console.error(`Server Error: ${data.toString()}`);
            });

            this.serverProcess.on('error', reject);
            
            // Timeout after 10 seconds
            setTimeout(() => reject(new Error('Server startup timeout')), 10000);
        });
    }

    async startDevServer() {
        console.log('🌐 Starting webpack dev server...');
        
        return new Promise((resolve, reject) => {
            this.devServerProcess = spawn('npm', ['run', 'dev'], {
                stdio: 'pipe',
                cwd: __dirname
            });

            this.devServerProcess.stdout.on('data', (data) => {
                const output = data.toString();
                console.log(`Dev Server: ${output.trim()}`);
                
                if (output.includes('webpack compiled successfully')) {
                    setTimeout(resolve, 2000); // Give dev server time to be ready
                }
            });

            this.devServerProcess.stderr.on('data', (data) => {
                console.error(`Dev Server Error: ${data.toString()}`);
            });

            this.devServerProcess.on('error', reject);
            
            // Timeout after 30 seconds
            setTimeout(() => reject(new Error('Dev server startup timeout')), 30000);
        });
    }

    async setupBrowser() {
        console.log('🌐 Setting up browser...');
        
        this.browser = await puppeteer.launch({
            headless: false, // Set to true for headless mode
            devtools: true,
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
        
        // Navigate to the client
        console.log('📱 Loading client page...');
        await this.page.goto('http://localhost:3000', { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });

        // Wait for the page to load
        await this.page.waitForTimeout(2000);

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
        const maxWaitTime = 15000; // 15 seconds
        const checkInterval = 500; // Check every 500ms
        const startTime = Date.now();

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
            status && status.toLowerCase().includes('connecting')
        );
        const hasConnected = statusChanges.some(status => 
            status && status.toLowerCase().includes('connected')
        );

        console.log('✅ Status checks:');
        console.log(`   Initializing: ${hasInitializing ? '✅' : '❌'}`);
        console.log(`   Connecting: ${hasConnecting ? '✅' : '❌'}`);
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

        return {
            success: hasConnected,
            statusChanges,
            finalStatus,
            hudElements,
            hasInitializing,
            hasConnecting,
            hasConnected
        };
    }

    async cleanup() {
        console.log('\n🧹 Cleaning up...');
        
        if (this.browser) {
            await this.browser.close();
        }
        
        if (this.serverProcess) {
            this.serverProcess.kill();
        }
        
        if (this.devServerProcess) {
            this.devServerProcess.kill();
        }
    }

    async run() {
        try {
            console.log('🎯 Starting Connection Status Test\n');
            
            // Start servers
            await this.startTestServer();
            await this.startDevServer();
            
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
            } else {
                console.log('\n❌ FAILURE: Browser did not show "Connected" status');
                console.log('This could indicate:');
                console.log('- WebSocket connection issues');
                console.log('- Server not responding');
                console.log('- Protocol buffer decoding problems');
                console.log('- HUD initialization issues');
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
    const test = new ConnectionStatusTest();
    test.run().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = ConnectionStatusTest; 