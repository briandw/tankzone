import * as THREE from 'three';

class Tank {
    constructor(entityId) {
        console.log(`🏗️ Tank constructor called for entity ${entityId}`);
        this.entityId = entityId;
        this.mesh = null;
        this.bodyMesh = null;
        this.turretMesh = null;
        
        this.position = new THREE.Vector3();
        this.rotation = 0;
        this.turretRotation = 0;
        this.health = 100;
        this.maxHealth = 100;
        
        // Interpolation
        this.targetPosition = new THREE.Vector3();
        this.targetRotation = 0;
        this.targetTurretRotation = 0;
        
        console.log(`✅ Tank ${entityId} constructor completed`);
    }
    
    init(scene) {
        console.log(`🎬 Initializing tank ${this.entityId} in 3D scene...`);
        console.log(`🎬 Scene object:`, scene ? 'provided' : 'NULL');
        
        try {
            // Create tank group
            console.log(`🔧 Creating tank group...`);
            this.mesh = new THREE.Group();
            console.log(`✅ Tank group created:`, this.mesh ? 'success' : 'FAILED');
            
            // Create tank body
            console.log(`🚗 Creating tank body...`);
            this.createBody();
            console.log(`✅ Tank body created:`, this.bodyMesh ? 'success' : 'FAILED');
            
            // Create turret
            console.log(`🔫 Creating tank turret...`);
            this.createTurret();
            console.log(`✅ Tank turret created:`, this.turretMesh ? 'success' : 'FAILED');
            
            // Add to scene
            console.log(`🎭 Adding tank to scene...`);
            scene.add(this.mesh);
            console.log(`✅ Tank added to scene. Scene children count:`, scene.children.length);
            
            console.log(`🎉 Tank ${this.entityId} initialization completed successfully`);
        } catch (error) {
            console.error(`❌ Tank ${this.entityId} initialization failed:`, error);
            throw error;
        }
    }
    
    createBody() {
        console.log(`🔧 Creating tank body geometry...`);
        
        try {
            // Tank body geometry (rectangular with rounded edges)
            const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 6);
            console.log(`✅ Body geometry created`);
            
            // Tank body material with team color (default blue)
            const bodyMaterial = new THREE.MeshLambertMaterial({
                color: 0x0066ff,
                transparent: true,
                opacity: 0.9
            });
            console.log(`✅ Body material created`);
            
            this.bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
            this.bodyMesh.position.y = 0.75; // Half height above ground
            this.bodyMesh.castShadow = true;
            this.bodyMesh.receiveShadow = true;
            console.log(`✅ Body mesh created and positioned`);
            
            // Add neon edge glow effect
            console.log(`✨ Adding neon edges...`);
            this.addNeonEdges(this.bodyMesh, bodyGeometry, 0x00ffff);
            console.log(`✅ Neon edges added`);
            
            this.mesh.add(this.bodyMesh);
            console.log(`✅ Body mesh added to tank group`);
        } catch (error) {
            console.error(`❌ Tank body creation failed:`, error);
            throw error;
        }
    }
    
    createTurret() {
        console.log(`🔧 Creating tank turret...`);
        
        try {
            // Turret group (can rotate independently)
            this.turretMesh = new THREE.Group();
            console.log(`✅ Turret group created`);
            
            // Turret base (cylinder)
            const turretBaseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 16);
            const turretBaseMaterial = new THREE.MeshLambertMaterial({
                color: 0x004499,
                transparent: true,
                opacity: 0.9
            });
            const turretBase = new THREE.Mesh(turretBaseGeometry, turretBaseMaterial);
            turretBase.position.y = 1.9; // On top of body
            turretBase.castShadow = true;
            console.log(`✅ Turret base created`);
            
            // Turret barrel
            const barrelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4, 8);
            const barrelMaterial = new THREE.MeshLambertMaterial({
                color: 0x666666
            });
            const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
            barrel.rotation.z = Math.PI / 2; // Point forward
            barrel.position.set(2, 1.9, 0); // Extend from turret
            barrel.castShadow = true;
            console.log(`✅ Turret barrel created`);
            
            // Add neon glow to turret
            console.log(`✨ Adding turret neon edges...`);
            this.addNeonEdges(turretBase, turretBaseGeometry, 0x00ff00);
            console.log(`✅ Turret neon edges added`);
            
            this.turretMesh.add(turretBase);
            this.turretMesh.add(barrel);
            this.mesh.add(this.turretMesh);
            console.log(`✅ Turret assembled and added to tank`);
        } catch (error) {
            console.error(`❌ Tank turret creation failed:`, error);
            throw error;
        }
    }
    
    addNeonEdges(mesh, geometry, color) {
        try {
            // Create wireframe for neon edge effect
            const edges = new THREE.EdgesGeometry(geometry);
            const lineMaterial = new THREE.LineBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.6,
                linewidth: 2
            });
            const wireframe = new THREE.LineSegments(edges, lineMaterial);
            mesh.add(wireframe);
        } catch (error) {
            console.warn(`⚠️ Failed to add neon edges:`, error);
        }
    }
    
    updateFromServer(tankData) {
        console.log(`🔄 Tank ${this.entityId} updating from server data:`, {
            position: tankData.position,
            rotation: tankData.rotation,
            turretRotation: tankData.turretRotation,
            health: tankData.health
        });
        
        // Update target values for interpolation
        this.targetPosition.set(tankData.position.x, 0, tankData.position.z);
        this.targetRotation = tankData.rotation;
        this.targetTurretRotation = tankData.turretRotation || 0;
        this.health = tankData.health || 100;
        this.maxHealth = tankData.maxHealth || 100;
        
        // Set team color based on player ID
        if (tankData.playerId) {
            const teamColor = this.getTeamColorFromPlayerId(tankData.playerId);
            console.log(`🎨 Setting team color for player ${tankData.playerId}: 0x${teamColor.toString(16)}`);
            this.setTeamColor(teamColor);
        }
    }
    
    getTeamColorFromPlayerId(playerId) {
        // Simple hash to generate consistent colors per player
        let hash = 0;
        for (let i = 0; i < playerId.length; i++) {
            hash = playerId.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const colors = [
            0x0066ff, // Blue
            0xff6600, // Orange
            0x00ff66, // Green
            0xff0066, // Pink
            0x6600ff, // Purple
            0xffff00, // Yellow
        ];
        
        return colors[Math.abs(hash) % colors.length];
    }
    
    setTeamColor(color) {
        if (this.bodyMesh && this.bodyMesh.material) {
            console.log(`🎨 Applying team color: 0x${color.toString(16)}`);
            this.bodyMesh.material.color.setHex(color);
        } else {
            console.warn(`⚠️ Cannot set team color - bodyMesh or material not available`);
        }
    }
    
    update(deltaTime) {
        if (!this.mesh) {
            console.warn(`⚠️ Tank ${this.entityId} update called but mesh is null`);
            return;
        }
        
        // Interpolate position
        this.position.lerp(this.targetPosition, deltaTime * 10);
        this.mesh.position.copy(this.position);
        
        // Interpolate body rotation
        const rotationDiff = this.targetRotation - this.rotation;
        this.rotation += rotationDiff * deltaTime * 10;
        this.mesh.rotation.y = this.rotation;
        
        // Interpolate turret rotation
        if (this.turretMesh) {
            const turretDiff = this.targetTurretRotation - this.turretRotation;
            this.turretRotation += turretDiff * deltaTime * 10;
            this.turretMesh.rotation.y = this.turretRotation;
        }
    }
    
    destroy() {
        console.log(`💥 Destroying tank ${this.entityId}...`);
        if (this.mesh && this.mesh.parent) {
            this.mesh.parent.remove(this.mesh);
            console.log(`✅ Tank ${this.entityId} removed from scene`);
        } else {
            console.warn(`⚠️ Tank ${this.entityId} destroy called but mesh not in scene`);
        }
    }
    
    // Animation methods
    playFireAnimation() {
        if (!this.turretMesh) return;
        
        console.log(`💥 Tank ${this.entityId} playing fire animation`);
        
        // Simple recoil animation
        const originalPosition = this.turretMesh.position.clone();
        this.turretMesh.position.x -= 0.2;
        
        setTimeout(() => {
            if (this.turretMesh) {
                this.turretMesh.position.copy(originalPosition);
            }
        }, 100);
    }
    
    playHitAnimation() {
        if (!this.mesh) return;
        
        console.log(`💢 Tank ${this.entityId} playing hit animation`);
        
        // Flash red briefly
        const originalColor = this.bodyMesh.material.color.clone();
        this.bodyMesh.material.color.setHex(0xff0000);
        
        setTimeout(() => {
            if (this.bodyMesh && this.bodyMesh.material) {
                this.bodyMesh.material.color.copy(originalColor);
            }
        }, 200);
    }
    
    // For testing
    getPosition() {
        return this.position.clone();
    }
    
    setPosition(x, y, z) {
        this.position.set(x, y, z);
        this.targetPosition.set(x, y, z);
        if (this.mesh) {
            this.mesh.position.copy(this.position);
        }
    }
    
    getRotation() {
        return this.rotation;
    }
    
    setRotation(rotation) {
        this.rotation = rotation;
        this.targetRotation = rotation;
        if (this.mesh) {
            this.mesh.rotation.y = rotation;
        }
    }
}

export { Tank }; 