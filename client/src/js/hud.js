class HUD {
    constructor() {
        this.elements = {
            connectionStatus: null,
            healthBar: null,
            healthFill: null,
            instructions: null
        };
        
        this.latency = 0;
        this.frameRate = 0;
        this.frameCount = 0;
        this.lastFrameTime = 0;
        
        console.log('🖥️ HUD initialized');
    }
    
    init() {
        // Wait for DOM to be ready if needed
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initElements());
        } else {
            this.initElements();
        }
    }
    
    initElements() {
        // Get DOM elements
        this.elements.connectionStatus = document.getElementById('connectionStatus');
        this.elements.healthBar = document.getElementById('healthBar');
        this.elements.healthFill = document.getElementById('healthFill');
        this.elements.instructions = document.getElementById('instructions');
        
        // Debug: Check if elements were found
        console.log('🔍 HUD DOM elements:', {
            connectionStatus: !!this.elements.connectionStatus,
            healthBar: !!this.elements.healthBar,
            healthFill: !!this.elements.healthFill,
            instructions: !!this.elements.instructions
        });
        
        // Verify all elements were found
        const missingElements = [];
        if (!this.elements.connectionStatus) missingElements.push('connectionStatus');
        if (!this.elements.healthBar) missingElements.push('healthBar');
        if (!this.elements.healthFill) missingElements.push('healthFill');
        if (!this.elements.instructions) missingElements.push('instructions');
        
        if (missingElements.length > 0) {
            console.error('❌ Missing HUD elements:', missingElements);
            console.log('📋 Available elements:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
        } else {
            console.log('✅ All HUD elements found');
        }
        
        // Add latency display to connection status
        this.updateConnectionStatus('Initializing...', 'connecting');
        
        console.log('✅ HUD initialized');
    }
    
    updateConnectionStatus(message, status = 'connected') {
        if (!this.elements.connectionStatus) return;
        
        // Update text with latency info
        const latencyText = this.latency > 0 ? ` (${this.latency}ms)` : '';
        this.elements.connectionStatus.textContent = message + latencyText;
        
        // Update CSS class for styling
        this.elements.connectionStatus.className = `neon-text ${status}`;
    }
    
    updateLatency(latency) {
        this.latency = latency;
        
        // Update connection status with new latency
        const currentText = this.elements.connectionStatus.textContent.split(' (')[0];
        this.updateConnectionStatus(currentText, this.getConnectionStatusClass());
    }
    
    getConnectionStatusClass() {
        if (this.latency === 0) return 'connecting';
        if (this.latency < 50) return 'connected';
        if (this.latency < 150) return 'connecting';
        return 'disconnected';
    }
    
    updateHealth(health, maxHealth = 100) {
        if (!this.elements.healthFill) return;
        
        const percentage = Math.max(0, Math.min(100, (health / maxHealth) * 100));
        this.elements.healthFill.style.width = `${percentage}%`;
        
        // Change color based on health percentage
        if (percentage > 60) {
            this.elements.healthFill.style.background = 'linear-gradient(90deg, #00ff00, #88ff00)';
        } else if (percentage > 30) {
            this.elements.healthFill.style.background = 'linear-gradient(90deg, #ffff00, #ff8800)';
        } else {
            this.elements.healthFill.style.background = 'linear-gradient(90deg, #ff0000, #ff4400)';
        }
    }
    
    hideInstructions() {
        if (this.elements.instructions) {
            this.elements.instructions.classList.add('hidden');
        }
    }
    
    showInstructions() {
        if (this.elements.instructions) {
            this.elements.instructions.classList.remove('hidden');
        }
    }
    
    showError(message) {
        // Create or update error message
        let errorElement = document.getElementById('errorMessage');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'errorMessage';
            errorElement.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 0, 0, 0.8);
                color: white;
                padding: 20px;
                border-radius: 10px;
                font-family: 'Courier New', monospace;
                text-align: center;
                z-index: 1000;
                max-width: 400px;
                box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
            `;
            document.body.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorElement && errorElement.parentNode) {
                errorElement.parentNode.removeChild(errorElement);
            }
        }, 5000);
    }
    
    update(deltaTime) {
        // Update frame rate calculation
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastFrameTime >= 1000) {
            this.frameRate = Math.round(this.frameCount * 1000 / (currentTime - this.lastFrameTime));
            this.frameCount = 0;
            this.lastFrameTime = currentTime;
            
            // Update FPS display in connection status if needed
            this.updateFrameRateDisplay();
        }
    }
    
    updateFrameRateDisplay() {
        // Only show FPS in development mode
        if (process.env.NODE_ENV === 'development' && this.elements.connectionStatus) {
            const baseText = this.elements.connectionStatus.textContent.split(' |')[0];
            const latencyText = this.latency > 0 ? ` (${this.latency}ms)` : '';
            const fpsText = ` | ${this.frameRate} FPS`;
            
            this.elements.connectionStatus.textContent = baseText + latencyText + fpsText;
        }
    }
    
    // Radar functionality (placeholder for now)
    updateRadar(tanks, playerPosition, range = 150) {
        // This would update a radar display showing nearby tanks
        // For now, just log the information
        if (process.env.NODE_ENV === 'development') {
            const nearbyTanks = tanks.filter(tank => {
                const distance = Math.sqrt(
                    Math.pow(tank.position.x - playerPosition.x, 2) +
                    Math.pow(tank.position.z - playerPosition.z, 2)
                );
                return distance <= range;
            });
            
            console.log(`Radar: ${nearbyTanks.length} tanks in range`);
        }
    }
    
    // Score display (placeholder)
    updateScore(score) {
        // This would update a score display
        console.log(`Score: ${score}`);
    }
    
    // Chat functionality (placeholder)
    addChatMessage(playerName, message) {
        // This would add a message to a chat window
        console.log(`[${playerName}]: ${message}`);
    }
    
    // For testing
    getLatency() {
        return this.latency;
    }
    
    getFrameRate() {
        return this.frameRate;
    }
    
    isInstructionsVisible() {
        return this.elements.instructions && !this.elements.instructions.classList.contains('hidden');
    }
}

export { HUD }; 