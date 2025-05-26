import protobuf from '@proto/messages.js';
const { battletanks } = protobuf;

class NetworkManager {
    constructor(serverUrl = null) {
        this.serverUrl = serverUrl || this.getServerUrl();
        this.ws = null;
        this.connected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        
        this.eventHandlers = new Map();
        this.NetworkMessage = battletanks.NetworkMessage;
        
        console.log('🌐 NetworkManager initialized for:', this.serverUrl);
    }
    
    getServerUrl() {
        // Auto-detect server URL based on current page
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname;
        const port = process.env.NODE_ENV === 'development' ? '8080' : window.location.port;
        return `${protocol}//${host}:${port}`;
    }
    
    async connect() {
        return new Promise((resolve, reject) => {
            console.log(`🔌 Connecting to server: ${this.serverUrl}`);
            
            try {
                this.ws = new WebSocket(this.serverUrl);
                this.ws.binaryType = 'arraybuffer'; // Ensure we receive binary data as ArrayBuffer
                
                this.ws.onopen = () => {
                    console.log('✅ WebSocket connected');
                    this.connected = true;
                    this.reconnectAttempts = 0;
                    this.emit('connected');
                    resolve();
                };
                
                this.ws.onmessage = (event) => {
                    this.handleMessage(event.data);
                };
                
                this.ws.onclose = (event) => {
                    console.log('🔌 WebSocket closed:', event.code, event.reason);
                    this.connected = false;
                    this.emit('disconnected', { code: event.code, reason: event.reason });
                    
                    // Auto-reconnect if not a clean close
                    if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.scheduleReconnect();
                    }
                };
                
                this.ws.onerror = (error) => {
                    console.error('❌ WebSocket error:', error);
                    this.emit('error', error);
                    reject(error);
                };
                
                // Connection timeout
                setTimeout(() => {
                    if (!this.connected) {
                        reject(new Error('Connection timeout'));
                    }
                }, 5000);
                
            } catch (error) {
                console.error('❌ Failed to create WebSocket:', error);
                reject(error);
            }
        });
    }
    
    scheduleReconnect() {
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        
        console.log(`🔄 Scheduling reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
        
        setTimeout(() => {
            if (!this.connected) {
                this.connect().catch(error => {
                    console.error('❌ Reconnect failed:', error);
                });
            }
        }, delay);
    }
    
    handleMessage(data) {
        try {
            let buffer;
            
            // Handle different data types from WebSocket
            if (data instanceof ArrayBuffer) {
                buffer = new Uint8Array(data);
            } else if (data instanceof Blob) {
                // For Blob data, we need to read it asynchronously
                data.arrayBuffer().then(arrayBuffer => {
                    this.handleMessage(arrayBuffer);
                });
                return;
            } else if (typeof data === 'string') {
                // If it's a string, it might be base64 encoded
                console.warn('⚠️ Received string data, expected binary');
                return;
            } else if (data instanceof Uint8Array) {
                buffer = data;
            } else {
                console.error('❌ Unknown data type:', typeof data, data);
                return;
            }
            
            console.log('📦 Received message, buffer length:', buffer.length);
            
            // Decode Protocol Buffer message
            const message = this.NetworkMessage.decode(buffer);
            console.log('✅ Decoded message:', message.messageType);
            
            // Emit event based on message type
            if (message.messageType) {
                this.emit(message.messageType, message[message.messageType]);
            }
            
        } catch (error) {
            console.error('❌ Failed to decode message:', error);
            console.error('   Data type:', typeof data);
            console.error('   Data:', data);
        }
    }
    
    sendMessage(messageType, payload) {
        if (!this.connected || !this.ws) {
            console.warn('⚠️ Cannot send message: not connected');
            return false;
        }
        
        try {
            // Create message object
            const messageData = {
                timestamp: Date.now(),
                messageType: messageType,
                [messageType]: payload
            };
            
            // Verify message structure
            const errMsg = this.NetworkMessage.verify(messageData);
            if (errMsg) {
                throw new Error(`Message verification failed: ${errMsg}`);
            }
            
            // Encode and send
            const message = this.NetworkMessage.create(messageData);
            const buffer = this.NetworkMessage.encode(message).finish();
            
            this.ws.send(buffer);
            return true;
            
        } catch (error) {
            console.error(`❌ Failed to send ${messageType} message:`, error);
            return false;
        }
    }
    
    // Game-specific message methods
    joinGame(displayName, clientVersion) {
        return this.sendMessage('joinGameRequest', {
            displayName: displayName,
            clientVersion: clientVersion
        });
    }
    
    sendPlayerInput(input) {
        return this.sendMessage('playerInput', input);
    }
    
    sendPing() {
        return this.sendMessage('pingRequest', {
            clientTimestamp: Date.now(),
            sequenceNumber: Math.floor(Math.random() * 1000000)
        });
    }
    
    sendChatMessage(message) {
        return this.sendMessage('chatMessage', {
            playerId: 'web-client',
            displayName: 'WebClient',
            message: message,
            timestamp: Date.now()
        });
    }
    
    // Event system
    on(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event).push(handler);
    }
    
    off(event, handler) {
        if (this.eventHandlers.has(event)) {
            const handlers = this.eventHandlers.get(event);
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }
    
    emit(event, data) {
        if (this.eventHandlers.has(event)) {
            for (const handler of this.eventHandlers.get(event)) {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`❌ Error in event handler for ${event}:`, error);
                }
            }
        }
    }
    
    isConnected() {
        return this.connected && this.ws && this.ws.readyState === WebSocket.OPEN;
    }
    
    disconnect() {
        if (this.ws) {
            this.ws.close(1000, 'Client disconnect');
        }
    }
}

export { NetworkManager }; 