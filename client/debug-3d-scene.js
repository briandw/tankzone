const puppeteer = require('puppeteer');

async function debug3DScene() {
    let browser = null;
    
    try {
        console.log('🎬 Debugging 3D Scene Rendering\n');
        
        browser = await puppeteer.launch({
            headless: false,
            devtools: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--enable-webgl',
                '--use-gl=desktop'
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
        console.log('📱 Loading client...');
        await page.goto('http://localhost:3000', { 
            waitUntil: 'domcontentloaded',
            timeout: 15000 
        });

        // Wait for initialization
        await page.waitForTimeout(3000);

        // Check WebGL support
        const webglSupport = await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return {
                supported: !!gl,
                vendor: gl ? gl.getParameter(gl.VENDOR) : null,
                renderer: gl ? gl.getParameter(gl.RENDERER) : null,
                version: gl ? gl.getParameter(gl.VERSION) : null
            };
        });

        console.log('\n🔍 WebGL Support Check:');
        console.log('  Supported:', webglSupport.supported ? '✅' : '❌');
        if (webglSupport.supported) {
            console.log('  Vendor:', webglSupport.vendor);
            console.log('  Renderer:', webglSupport.renderer);
            console.log('  Version:', webglSupport.version);
        }

        // Check 3D scene status
        const sceneStatus = await page.evaluate(() => {
            if (!window.game) return { error: 'Game not found' };
            
            const scene3D = window.game.scene3D;
            if (!scene3D) return { error: 'Scene3D not found' };
            
            return {
                hasScene: !!scene3D.scene,
                hasCamera: !!scene3D.camera,
                hasRenderer: !!scene3D.renderer,
                hasCanvas: !!scene3D.canvas,
                canvasSize: scene3D.canvas ? {
                    width: scene3D.canvas.width,
                    height: scene3D.canvas.height,
                    clientWidth: scene3D.canvas.clientWidth,
                    clientHeight: scene3D.canvas.clientHeight
                } : null,
                sceneChildren: scene3D.scene ? scene3D.scene.children.length : 0,
                cameraPosition: scene3D.camera ? {
                    x: scene3D.camera.position.x,
                    y: scene3D.camera.position.y,
                    z: scene3D.camera.position.z
                } : null,
                rendererInfo: scene3D.renderer ? {
                    clearColor: scene3D.renderer.getClearColor().getHex(),
                    size: scene3D.renderer.getSize(new THREE.Vector2())
                } : null
            };
        });

        console.log('\n🎬 3D Scene Status:');
        console.log('  Scene:', sceneStatus.hasScene ? '✅' : '❌');
        console.log('  Camera:', sceneStatus.hasCamera ? '✅' : '❌');
        console.log('  Renderer:', sceneStatus.hasRenderer ? '✅' : '❌');
        console.log('  Canvas:', sceneStatus.hasCanvas ? '✅' : '❌');
        
        if (sceneStatus.canvasSize) {
            console.log('  Canvas Size:', sceneStatus.canvasSize);
        }
        
        if (sceneStatus.sceneChildren !== undefined) {
            console.log('  Scene Children:', sceneStatus.sceneChildren);
        }
        
        if (sceneStatus.cameraPosition) {
            console.log('  Camera Position:', sceneStatus.cameraPosition);
        }
        
        if (sceneStatus.rendererInfo) {
            console.log('  Clear Color:', `0x${sceneStatus.rendererInfo.clearColor.toString(16)}`);
            console.log('  Renderer Size:', sceneStatus.rendererInfo.size);
        }

        // Check if tanks are being rendered
        const tankStatus = await page.evaluate(() => {
            if (!window.game) return { error: 'Game not found' };
            
            return {
                tankCount: window.game.tanks.size,
                playerTank: !!window.game.playerTank,
                playerId: window.game.playerId,
                tanks: Array.from(window.game.tanks.entries()).map(([id, tank]) => ({
                    id,
                    hasModel: !!tank.mesh,
                    position: tank.mesh ? {
                        x: tank.mesh.position.x,
                        y: tank.mesh.position.y,
                        z: tank.mesh.position.z
                    } : null
                }))
            };
        });

        console.log('\n🚗 Tank Status:');
        console.log('  Tank Count:', tankStatus.tankCount);
        console.log('  Player Tank:', tankStatus.playerTank ? '✅' : '❌');
        console.log('  Player ID:', tankStatus.playerId);
        
        if (tankStatus.tanks && tankStatus.tanks.length > 0) {
            console.log('  Tanks:');
            tankStatus.tanks.forEach(tank => {
                console.log(`    Tank ${tank.id}: Model ${tank.hasModel ? '✅' : '❌'}, Position:`, tank.position);
            });
        }

        // Force a render and check for errors
        const renderTest = await page.evaluate(() => {
            if (!window.game || !window.game.scene3D || !window.game.scene3D.renderer) {
                return { error: 'No renderer available' };
            }
            
            try {
                window.game.scene3D.render();
                return { success: true };
            } catch (error) {
                return { error: error.message };
            }
        });

        console.log('\n🖼️  Render Test:', renderTest.success ? '✅' : `❌ ${renderTest.error}`);

        // Take a screenshot
        await page.screenshot({ 
            path: 'debug-3d-scene.png',
            fullPage: true 
        });
        console.log('\n📸 Screenshot saved as debug-3d-scene.png');

        // Try to manually add a test object to the scene
        console.log('\n🧪 Adding test cube to scene...');
        const testCubeResult = await page.evaluate(() => {
            if (!window.game || !window.game.scene3D || !window.game.scene3D.scene) {
                return { error: 'No scene available' };
            }
            
            try {
                // Create a bright test cube
                const geometry = new THREE.BoxGeometry(5, 5, 5);
                const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(0, 2.5, 0);
                
                window.game.scene3D.scene.add(cube);
                window.game.scene3D.render();
                
                return { success: true, position: cube.position };
            } catch (error) {
                return { error: error.message };
            }
        });

        console.log('Test Cube Result:', testCubeResult.success ? '✅' : `❌ ${testCubeResult.error}`);
        if (testCubeResult.position) {
            console.log('Test Cube Position:', testCubeResult.position);
        }

        // Wait a bit and take another screenshot
        await page.waitForTimeout(2000);
        await page.screenshot({ 
            path: 'debug-3d-scene-with-cube.png',
            fullPage: true 
        });
        console.log('📸 Screenshot with test cube saved as debug-3d-scene-with-cube.png');

        // Check if the issue is camera positioning
        console.log('\n📷 Testing camera positions...');
        const cameraTests = [
            { name: 'Default', pos: [0, 20, 30], lookAt: [0, 0, 0] },
            { name: 'Top Down', pos: [0, 50, 0], lookAt: [0, 0, 0] },
            { name: 'Close Up', pos: [0, 5, 10], lookAt: [0, 0, 0] },
            { name: 'Side View', pos: [30, 10, 0], lookAt: [0, 0, 0] }
        ];

        for (const test of cameraTests) {
            await page.evaluate((testData) => {
                if (window.game && window.game.scene3D && window.game.scene3D.camera) {
                    window.game.scene3D.camera.position.set(...testData.pos);
                    window.game.scene3D.camera.lookAt(...testData.lookAt);
                    window.game.scene3D.render();
                }
            }, test);
            
            await page.waitForTimeout(500);
            await page.screenshot({ 
                path: `debug-camera-${test.name.toLowerCase().replace(' ', '-')}.png`,
                fullPage: true 
            });
            console.log(`📸 ${test.name} camera view saved`);
        }

        console.log('\n🏆 3D Scene Debug Complete');
        return sceneStatus;

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
debug3DScene().then(results => {
    if (results) {
        console.log('\n📊 Summary:');
        console.log('3D Scene Working:', results.hasScene && results.hasCamera && results.hasRenderer ? '✅' : '❌');
    }
    process.exit(0);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 