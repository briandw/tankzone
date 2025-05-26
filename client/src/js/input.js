class InputManager {
    constructor() {
        this.keys = new Set();
        this.mousePosition = { x: 0, y: 0 };
        this.canvas = null;
        
        this.currentState = {
            forward: false,
            backward: false,
            rotateLeft: false,
            rotateRight: false,
            fire: false,
            turretAngle: 0,
            hasChanges: false
        };
        
        this.previousState = { ...this.currentState };
        this.sequenceNumber = 0;
        
        // Key mappings
        this.keyMap = {
            'KeyW': 'forward',
            'KeyS': 'backward',
            'KeyA': 'rotateLeft',
            'KeyD': 'rotateRight',
            'Space': 'fire'
        };
        
        console.log('🎮 InputManager initialized');
    }
    
    init() {
        this.canvas = document.getElementById('gameCanvas');
        
        // Keyboard events
        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        document.addEventListener('keyup', (event) => this.onKeyUp(event));
        
        // Mouse events
        this.canvas.addEventListener('mousemove', (event) => this.onMouseMove(event));
        this.canvas.addEventListener('click', () => this.requestPointerLock());
        
        // Pointer lock events
        document.addEventListener('pointerlockchange', () => this.onPointerLockChange());
        
        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (event) => event.preventDefault());
        
        console.log('✅ Input system initialized');
    }
    
    onKeyDown(event) {
        // Prevent default for game keys
        if (this.keyMap[event.code]) {
            event.preventDefault();
        }
        
        this.keys.add(event.code);
        this.updateInputState();
    }
    
    onKeyUp(event) {
        // Prevent default for game keys
        if (this.keyMap[event.code]) {
            event.preventDefault();
        }
        
        this.keys.delete(event.code);
        this.updateInputState();
    }
    
    onMouseMove(event) {
        if (document.pointerLockElement === this.canvas) {
            // Use movement delta when pointer is locked
            this.mousePosition.x += event.movementX;
            this.mousePosition.y += event.movementY;
        } else {
            // Use absolute position when pointer is not locked
            const rect = this.canvas.getBoundingClientRect();
            this.mousePosition.x = event.clientX - rect.left;
            this.mousePosition.y = event.clientY - rect.top;
        }
        
        this.updateTurretAngle();
    }
    
    requestPointerLock() {
        if (this.canvas.requestPointerLock) {
            this.canvas.requestPointerLock();
        }
    }
    
    onPointerLockChange() {
        if (document.pointerLockElement === this.canvas) {
            console.log('🔒 Pointer locked');
        } else {
            console.log('🔓 Pointer unlocked');
        }
    }
    
    updateInputState() {
        // Store previous state
        this.previousState = { ...this.currentState };
        
        // Update current state based on keys
        this.currentState.forward = this.keys.has('KeyW');
        this.currentState.backward = this.keys.has('KeyS');
        this.currentState.rotateLeft = this.keys.has('KeyA');
        this.currentState.rotateRight = this.keys.has('KeyD');
        this.currentState.fire = this.keys.has('Space');
        
        // Check for changes
        this.currentState.hasChanges = this.hasStateChanged();
        
        if (this.currentState.hasChanges) {
            this.sequenceNumber++;
        }
    }
    
    updateTurretAngle() {
        if (document.pointerLockElement === this.canvas) {
            // Calculate angle from center when pointer is locked
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            
            // Clamp mouse position to reasonable bounds
            const maxDistance = Math.min(this.canvas.width, this.canvas.height) / 2;
            const distance = Math.sqrt(this.mousePosition.x * this.mousePosition.x + this.mousePosition.y * this.mousePosition.y);
            
            if (distance > maxDistance) {
                const scale = maxDistance / distance;
                this.mousePosition.x *= scale;
                this.mousePosition.y *= scale;
            }
            
            this.currentState.turretAngle = Math.atan2(this.mousePosition.y, this.mousePosition.x);
        } else {
            // Calculate angle from canvas center when pointer is not locked
            const rect = this.canvas.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = this.mousePosition.x - centerX;
            const deltaY = this.mousePosition.y - centerY;
            
            this.currentState.turretAngle = Math.atan2(deltaY, deltaX);
        }
        
        // Check if turret angle changed significantly
        const angleDiff = Math.abs(this.currentState.turretAngle - this.previousState.turretAngle);
        if (angleDiff > 0.05) { // ~3 degrees
            this.currentState.hasChanges = true;
            this.sequenceNumber++;
        }
    }
    
    hasStateChanged() {
        return (
            this.currentState.forward !== this.previousState.forward ||
            this.currentState.backward !== this.previousState.backward ||
            this.currentState.rotateLeft !== this.previousState.rotateLeft ||
            this.currentState.rotateRight !== this.previousState.rotateRight ||
            this.currentState.fire !== this.previousState.fire
        );
    }
    
    getState() {
        return { ...this.currentState };
    }
    
    getSequenceNumber() {
        return this.sequenceNumber;
    }
    
    resetChanges() {
        this.currentState.hasChanges = false;
    }
    
    // For testing
    simulateKeyPress(key) {
        this.keys.add(key);
        this.updateInputState();
    }
    
    simulateKeyRelease(key) {
        this.keys.delete(key);
        this.updateInputState();
    }
    
    simulateMouseMove(x, y) {
        this.mousePosition.x = x;
        this.mousePosition.y = y;
        this.updateTurretAngle();
    }
}

export { InputManager }; 