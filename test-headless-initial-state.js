const puppeteer = require('puppeteer');
const protobuf = require('./client/src/proto/messages.js'); // Assuming this path is correct from root
const { NetworkMessage, JoinGameRequest } = protobuf.battletanks;

async function testHeadlessInitialState() {
    console.log('🤖 Testing headless client for initial state reception...\n');
    let browser;
    let page;

    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote',
                '--single-process' // May help with stability in some environments
            ]
        });
        page = await browser.newPage();

        // Capture all console messages from the browser page
        page.on('console', msg => {
            const type = msg.type().substr(0, 3).toUpperCase();
            const text = msg.text();
            // Filter for our specific client logs, or errors/warnings
            if (text.includes('BattleTanksClient') || text.includes('NetworkManager') || 
                text.includes('Fallback2D') || text.includes('HUD') || 
                type === 'ERR' || type === 'WAR') {
                console.log(`📄 BROWSER [${type}]: ${text}`);
            }
        });

        console.log('Navigating to http://localhost:3000...');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });
        console.log('Page loaded.');

        console.log('Waiting for 10 seconds to observe connection and initial messages...');
        // The client should automatically connect and join from its `main.js` init.
        // We are primarily interested in the console logs from the page during this time.
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds

        const connectionStatus = await page.evaluate(() => {
            const el = document.getElementById('connection-status');
            return el ? el.textContent : 'Connection status element not found';
        });
        console.log(`Final connection status from HUD: "${connectionStatus}"`);

        const errorMessages = await page.evaluate(() => {
            const errorEl = document.getElementById('error-message');
            return errorEl ? errorEl.textContent : 'No error message displayed';
        });
         console.log(`Error message display from HUD: "${errorMessages}"`);

        console.log('\n✅ Headless initial state test finished.');

    } catch (e) {
        console.error('❌ Test failed:', e);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

testHeadlessInitialState(); 