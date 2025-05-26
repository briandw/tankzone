import * as THREE from 'three';

class Scene3D {
    constructor(canvas) {
        console.log('🎬 Scene3D constructor called');
        console.log('🖼️ Canvas provided:', canvas ? 'yes' : 'NO');
        console.log('🖼️ Canvas dimensions:', canvas ? `${canvas.clientWidth}x${canvas.clientHeight}` : 'N/A');
        
        this.canvas = canvas;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.target = null; // Camera target (player tank)
        
        this.cameraOffset = new THREE.Vector3(0, 10, 15);
        this.cameraLookOffset = new THREE.Vector3(0, 0, 0);
        
        console.log('✅ Scene3D constructor completed');
    }
    
    async init() {
        console.log('🚀 Scene3D initialization starting...');
        
        try {
            // Create scene
            console.log('🎭 Creating THREE.Scene...');
            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.Fog(0x000033, 50, 200);
            console.log('✅ Scene created with fog');
            
            // Create camera
            console.log('📷 Creating camera...');
            this.camera = new THREE.PerspectiveCamera(
                75, // FOV
                this.canvas.clientWidth / this.canvas.clientHeight, // Aspect ratio
                0.1, // Near plane
                1000 // Far plane
            );
            console.log('✅ Camera created with aspect ratio:', this.canvas.clientWidth / this.canvas.clientHeight);
            
            // Create renderer with fallback options
            console.log('🖥️ Creating WebGL renderer...');
            try {
                console.log('🔧 Attempting WebGL renderer with full settings...');
                this.renderer = new THREE.WebGLRenderer({
                    canvas: this.canvas,
                    antialias: true,
                    alpha: false,
                    powerPreference: "default",
                    failIfMajorPerformanceCaveat: false
                });
                console.log('✅ WebGL renderer created successfully (full settings)');
            } catch (webglError) {
                console.warn('⚠️ WebGL renderer failed, trying with reduced settings:', webglError.message);
                
                // Try with minimal settings
                try {
                    console.log('🔧 Attempting WebGL renderer with minimal settings...');
                    this.renderer = new THREE.WebGLRenderer({
                        canvas: this.canvas,
                        antialias: false,
                        alpha: false,
                        powerPreference: "low-power",
                        failIfMajorPerformanceCaveat: false
                    });
                    console.log('✅ WebGL renderer created successfully (minimal settings)');
                } catch (fallbackError) {
                    console.error('❌ All WebGL options failed:', fallbackError.message);
                    throw new Error(`WebGL not supported: ${fallbackError.message}`);
                }
            }
            
            console.log('🔧 Configuring renderer settings...');
            this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setClearColor(0x000033);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            console.log('✅ Renderer configured');
            
            // Set up lighting
            console.log('💡 Setting up lighting...');
            this.setupLighting();
            console.log('✅ Lighting setup complete');
            
            // Create environment
            console.log('🌍 Creating environment...');
            this.createEnvironment();
            console.log('✅ Environment created');
            
            // Set initial camera position
            console.log('📷 Setting initial camera position...');
            this.camera.position.set(0, 20, 30);
            this.camera.lookAt(0, 0, 0);
            console.log('✅ Camera positioned');
            
            // Handle window resize
            console.log('🔧 Setting up resize handler...');
            window.addEventListener('resize', () => this.onWindowResize());
            console.log('✅ Resize handler set up');
            
            console.log('🎉 Scene3D initialization completed successfully!');
            console.log('📊 Scene stats:', {
                sceneChildren: this.scene.children.length,
                rendererInfo: this.renderer.info,
                cameraPosition: this.camera.position
            });
            
        } catch (error) {
            console.error('❌ Scene3D initialization failed:', error);
            throw error;
        }
    }
    
    setupLighting() {
        console.log('💡 Creating ambient light...');
        // Ambient light (low intensity for cyberpunk mood)
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        console.log('✅ Ambient light added');
        
        console.log('☀️ Creating directional light...');
        // Main directional light (moonlight effect)
        const directionalLight = new THREE.DirectionalLight(0x8888ff, 0.8);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 200;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        this.scene.add(directionalLight);
        console.log('✅ Directional light added');
        
        console.log('✨ Creating neon accent lights...');
        // Neon accent lights
        const neonLight1 = new THREE.PointLight(0x00ff00, 0.5, 50);
        neonLight1.position.set(25, 5, 25);
        this.scene.add(neonLight1);
        
        const neonLight2 = new THREE.PointLight(0xff0080, 0.5, 50);
        neonLight2.position.set(-25, 5, -25);
        this.scene.add(neonLight2);
        console.log('✅ Neon lights added');
    }
    
    createEnvironment() {
        console.log('🌍 Creating environment components...');
        
        // Create grid floor
        console.log('🏗️ Creating grid floor...');
        this.createGridFloor();
        console.log('✅ Grid floor created');
        
        // Create starfield skybox
        console.log('⭐ Creating starfield...');
        this.createStarfield();
        console.log('✅ Starfield created');
        
        // Add some basic obstacles for visual reference
        console.log('🧱 Creating obstacles...');
        this.createObstacles();
        console.log('✅ Obstacles created');
    }
    
    createGridFloor() {
        const size = 200;
        const divisions = 40;
        
        console.log(`🔧 Creating grid helper (${size}x${size}, ${divisions} divisions)...`);
        // Main grid
        const gridHelper = new THREE.GridHelper(size, divisions, 0x00ff00, 0x004400);
        gridHelper.material.opacity = 0.3;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
        console.log('✅ Grid helper added');
        
        console.log('🔧 Creating floor plane...');
        // Create glowing floor plane
        const floorGeometry = new THREE.PlaneGeometry(size, size);
        const floorMaterial = new THREE.MeshLambertMaterial({
            color: 0x001122,
            transparent: true,
            opacity: 0.8
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
        console.log('✅ Floor plane added');
    }
    
    createStarfield() {
        console.log('⭐ Generating starfield geometry...');
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1000;
        const positions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 2000;     // x
            positions[i + 1] = Math.random() * 500 + 100;    // y (above ground)
            positions[i + 2] = (Math.random() - 0.5) * 2000; // z
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        console.log(`✅ Generated ${starCount} stars`);
        
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2,
            sizeAttenuation: false
        });
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
        console.log('✅ Starfield added to scene');
    }
    
    createObstacles() {
        console.log('🧱 Creating obstacle meshes...');
        // Create some basic geometric obstacles
        const obstacles = [
            { pos: [20, 2.5, 20], size: [5, 5, 5], color: 0x333333 },
            { pos: [-20, 2.5, -20], size: [5, 5, 5], color: 0x333333 },
            { pos: [30, 1, 0], size: [2, 2, 10], color: 0x444444 },
            { pos: [-30, 1, 0], size: [2, 2, 10], color: 0x444444 },
        ];
        
        obstacles.forEach((obstacle, index) => {
            console.log(`🔧 Creating obstacle ${index + 1}...`);
            const geometry = new THREE.BoxGeometry(...obstacle.size);
            const material = new THREE.MeshLambertMaterial({ color: obstacle.color });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(...obstacle.pos);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.scene.add(mesh);
        });
        console.log(`✅ Created ${obstacles.length} obstacles`);
    }
    
    setTarget(target) {
        console.log('🎯 Setting camera target:', target ? 'provided' : 'null');
        this.target = target;
        if (target) {
            console.log('📍 Target position:', target.position);
        }
    }
    
    update(deltaTime) {
        if (this.target) {
            // Smooth camera following
            const targetPosition = this.target.position.clone().add(this.cameraOffset);
            const lookAtPosition = this.target.position.clone().add(this.cameraLookOffset);
            
            // Lerp camera position for smooth following
            this.camera.position.lerp(targetPosition, deltaTime * 2);
            this.camera.lookAt(lookAtPosition);
        }
    }
    
    render() {
        if (!this.renderer || !this.scene || !this.camera) {
            console.warn('⚠️ Scene3D render called but components not ready:', {
                renderer: !!this.renderer,
                scene: !!this.scene,
                camera: !!this.camera
            });
            return;
        }
        
        try {
            this.renderer.render(this.scene, this.camera);
        } catch (error) {
            console.error('❌ Render error:', error);
        }
    }
    
    onWindowResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }
    
    // Utility methods for adding/removing objects
    addObject(object) {
        this.scene.add(object);
    }
    
    removeObject(object) {
        this.scene.remove(object);
    }
    
    // For testing
    getCameraPosition() {
        return this.camera.position.clone();
    }
    
    setCameraPosition(x, y, z) {
        this.camera.position.set(x, y, z);
    }
}

export { Scene3D }; 