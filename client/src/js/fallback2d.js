class Fallback2D {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = null;
        this.tanks = new Map(); // Stores { id, x, y, rotation, turretAngle, health, maxHealth, team, isPlayer }
        this.playerTankId = null;
        this.cameraX = 0;
        this.cameraY = 0;
        this.scale = 1.5; // Adjusted default zoom
        
        console.log('🎨 Fallback2D initialized (Simplified)');
    }
    
    init() {
        // Get 2D context
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error('2D canvas context not available');
        }
        
        // Set canvas size
        this.resize();
        
        // Handle window resize
        window.addEventListener('resize', () => this.resize());
        
        console.log('✅ 2D Fallback renderer initialized');
    }
    
    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        console.log(`🎨 Canvas resized to: ${this.canvas.width}x${this.canvas.height}`);
    }
    
    clearTanks() {
        this.tanks.clear();
    }
    
    addOrUpdateTank(tankId, tankData, isPlayer) {
        // Server provides: entityId, playerId, position {x,y,z}, body_rotation, turret_rotation, health, team
        const tank = {
            id: tankId,
            x: tankData.position?.x || 0,
            y: tankData.position?.z || 0, // Use Z from 3D space as Y in 2D top-down
            rotation: tankData.body_rotation || 0, // Expecting this from server
            turretAngle: tankData.turret_rotation || 0, // Expecting this from server
            health: tankData.health || 100,
            maxHealth: tankData.maxHealth || 100, // Assuming server might send this or default to 100
            team: tankData.team || 'default', // Expecting team info for color
            isPlayer: isPlayer
        };
        this.tanks.set(tankId, tank);

        if (isPlayer) {
            this.playerTankId = tankId;
            // Update camera to follow player smoothly (or directly in render)
        }
    }
    
    removeTank(tankId) {
        this.tanks.delete(tankId);
        if (this.playerTankId === tankId) {
            this.playerTankId = null;
        }
    }
    
    render(playerTankIdToCenter) { // playerTankIdToCenter passed from main.js
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas with dark background
        ctx.fillStyle = '#001122';
        ctx.fillRect(0, 0, width, height);
        
        // Save context for transformations
        ctx.save();
        
        // Center the view on the player tank if it exists
        const playerTank = this.tanks.get(playerTankIdToCenter);
        if (playerTank) {
            this.cameraX = playerTank.x;
            this.cameraY = playerTank.y;
        } else {
            // Default camera position if player tank not found (e.g., center of map)
            this.cameraX = 0; 
            this.cameraY = 0;
        }

        ctx.translate(width / 2, height / 2);
        ctx.scale(this.scale, this.scale);
        ctx.translate(-this.cameraX, -this.cameraY);
        
        // Draw grid
        this.drawGrid(ctx);
        
        // Draw tanks
        for (const tank of this.tanks.values()) {
            this.drawTank(ctx, tank);
        }
        
        // Restore context
        ctx.restore();
        
        // Draw UI overlay
        this.drawUI(ctx, width, height);
    }
    
    drawGrid(ctx) {
        const gridSize = 10;
        const gridRange = 100;
        
        ctx.strokeStyle = '#004400';
        ctx.lineWidth = 0.5;
        
        // Vertical lines
        for (let x = -gridRange; x <= gridRange; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, -gridRange);
            ctx.lineTo(x, gridRange);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = -gridRange; y <= gridRange; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(-gridRange, y);
            ctx.lineTo(gridRange, y);
            ctx.stroke();
        }
        
        // Center lines (brighter)
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.moveTo(0, -gridRange);
        ctx.lineTo(0, gridRange);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-gridRange, 0);
        ctx.lineTo(gridRange, 0);
        ctx.stroke();
    }
    
    drawTank(ctx, tank) {
        ctx.save();
        
        // Move to tank position
        ctx.translate(tank.x, tank.y);
        
        // Tank body rotation
        ctx.rotate(tank.rotation); // This should be body_rotation from server
        
        let bodyColor = '#808080'; // Default NPC/Other
        let turretColor = '#606060';

        if (tank.isPlayer) {
            bodyColor = '#00BFFF'; // Player is Blue (as per overview.md for a team color)
            turretColor = '#009FCC';
        } else {
            // Example: Distinguish other teams or default non-player color
            // For simplicity, let's use a generic enemy color if not player
            // Later, this can use tank.team for Red/Blue/NPC colors
            bodyColor = '#FF0040'; // Enemy is Red
            turretColor = '#CC0030';
        }
        // TODO: Use tank.team to set colors based on Red/Blue/NPC from overview.md
        // switch (tank.team) {
        //     case 'RED': bodyColor = '#FF0040'; turretColor = '#CC0030'; break;
        //     case 'BLUE': bodyColor = '#00BFFF'; turretColor = '#009FCC'; break;
        //     case 'NPC': bodyColor = '#808080'; turretColor = '#606060'; break;
        // }

        // Draw tank body (rectangle)
        ctx.fillStyle = bodyColor;
        ctx.fillRect(-2, -1.5, 4, 3);
        
        // Draw tank outline
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.2;
        ctx.strokeRect(-2, -1.5, 4, 3);
        
        // Draw turret
        ctx.save();
        // Turret angle is absolute from server (turret_rotation), 
        // so rotate relative to current body rotation to get correct orientation.
        ctx.rotate(tank.turretAngle - tank.rotation);
        
        ctx.fillStyle = turretColor;
        ctx.fillRect(-0.5, -0.5, 3, 1); // Turret barrel
        
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(-0.5, -0.5, 3, 1);
        
        // Turret base (circle)
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
        
        // Health bar above tank
        if (tank.health < tank.maxHealth) {
            const healthPercent = tank.health / tank.maxHealth;
            const barWidth = 3;
            const barHeight = 0.3;
            
            // Background
            ctx.fillStyle = '#660000';
            ctx.fillRect(-barWidth/2, -3, barWidth, barHeight);
            
            // Health
            ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
            ctx.fillRect(-barWidth/2, -3, barWidth * healthPercent, barHeight);
            
            // Border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 0.1;
            ctx.strokeRect(-barWidth/2, -3, barWidth, barHeight);
        }
        
        // Player indicator
        if (tank.isPlayer) {
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 0.3;
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    drawUI(ctx, width, height) {
        // Draw 2D mode indicator
        ctx.fillStyle = '#ffff00';
        ctx.font = '16px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('2D Mode (WebGL unavailable)', 10, 30);
        
        // Draw controls
        ctx.fillStyle = '#00ff00';
        ctx.font = '12px monospace';
        ctx.fillText('WASD: Move | Mouse: Aim | Space: Fire', 10, height - 20);
        
        // Draw scale info
        ctx.fillStyle = '#888888';
        ctx.textAlign = 'right';
        ctx.fillText(`Scale: ${this.scale.toFixed(1)}x`, width - 10, height - 20);
    }
    
    // Camera controls
    setCameraPosition(x, y) {
        this.cameraX = x;
        this.cameraY = y;
    }
    
    setScale(scale) {
        this.scale = Math.max(0.5, Math.min(5, scale));
    }
    
    // Handle zoom with mouse wheel
    handleWheel(event) {
        const delta = event.deltaY > 0 ? -0.1 : 0.1;
        this.setScale(this.scale + delta);
        event.preventDefault();
    }
}

export { Fallback2D }; 