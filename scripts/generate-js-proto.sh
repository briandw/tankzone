#!/bin/bash

# Script to generate JavaScript Protocol Buffer files for client development
# This script generates both CommonJS and ES6 modules from the proto files

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Generating JavaScript Protocol Buffer files...${NC}"

# Check if protoc is installed
if ! command -v protoc &> /dev/null; then
    echo -e "${RED}Error: protoc is not installed. Please install Protocol Buffers compiler.${NC}"
    echo "On macOS: brew install protobuf"
    echo "On Ubuntu: sudo apt-get install protobuf-compiler"
    exit 1
fi

# Check if protoc-gen-js is available
if ! command -v protoc-gen-js &> /dev/null; then
    echo -e "${YELLOW}Warning: protoc-gen-js not found. Installing...${NC}"
    npm install -g protoc-gen-js
fi

# Create output directories
mkdir -p client/src/proto/commonjs
mkdir -p client/src/proto/es6

# Generate CommonJS modules
echo -e "${YELLOW}Generating CommonJS modules...${NC}"
protoc \
    --js_out=import_style=commonjs,binary:client/src/proto/commonjs \
    --proto_path=proto \
    proto/messages.proto

# Generate ES6 modules (if protoc-gen-js supports it)
echo -e "${YELLOW}Generating ES6 modules...${NC}"
protoc \
    --js_out=import_style=commonjs,binary:client/src/proto/es6 \
    --proto_path=proto \
    proto/messages.proto

# Create TypeScript definitions if ts-protoc-gen is available
if command -v protoc-gen-ts &> /dev/null; then
    echo -e "${YELLOW}Generating TypeScript definitions...${NC}"
    mkdir -p client/src/proto/typescript
    protoc \
        --ts_out=client/src/proto/typescript \
        --proto_path=proto \
        proto/messages.proto
else
    echo -e "${YELLOW}Note: protoc-gen-ts not found. Skipping TypeScript generation.${NC}"
    echo "To generate TypeScript definitions, install: npm install -g ts-protoc-gen"
fi

# Create index files for easier imports
echo -e "${YELLOW}Creating index files...${NC}"

# CommonJS index
cat > client/src/proto/commonjs/index.js << 'EOF'
// Auto-generated index file for Protocol Buffer messages
const messages = require('./messages_pb.js');

module.exports = {
    // Network Messages
    ProtoNetworkMessage: messages.ProtoNetworkMessage,
    
    // Player Messages
    ProtoPlayerInput: messages.ProtoPlayerInput,
    JoinGameRequest: messages.JoinGameRequest,
    JoinGameResponse: messages.JoinGameResponse,
    
    // Game State
    ProtoGameStateUpdate: messages.ProtoGameStateUpdate,
    TankState: messages.TankState,
    ProjectileState: messages.ProjectileState,
    PowerUpState: messages.PowerUpState,
    
    // Ping/Pong
    PingRequest: messages.PingRequest,
    PongResponse: messages.PongResponse,
    
    // Configuration
    ProtoGameConfig: messages.ProtoGameConfig,
    
    // Utility types
    ProtoVector2: messages.ProtoVector2,
    ProtoVector3: messages.ProtoVector3,
    
    // Enums
    TeamColor: messages.TeamColor,
    PowerUpType: messages.PowerUpType,
    GameEventType: messages.GameEventType,
};
EOF

# ES6 index
cat > client/src/proto/es6/index.js << 'EOF'
// Auto-generated index file for Protocol Buffer messages (ES6)
import * as messages from './messages_pb.js';

export const {
    // Network Messages
    ProtoNetworkMessage,
    
    // Player Messages
    ProtoPlayerInput,
    JoinGameRequest,
    JoinGameResponse,
    
    // Game State
    ProtoGameStateUpdate,
    TankState,
    ProjectileState,
    PowerUpState,
    
    // Ping/Pong
    PingRequest,
    PongResponse,
    
    // Configuration
    ProtoGameConfig,
    
    // Utility types
    ProtoVector2,
    ProtoVector3,
    
    // Enums
    TeamColor,
    PowerUpType,
    GameEventType,
} = messages;
EOF

# Create package.json for the proto module
cat > client/src/proto/package.json << 'EOF'
{
  "name": "@battletanks/proto",
  "version": "1.0.0",
  "description": "Protocol Buffer definitions for Battle Tanks game",
  "main": "commonjs/index.js",
  "module": "es6/index.js",
  "types": "typescript/messages_pb.d.ts",
  "scripts": {
    "build": "../../scripts/generate-js-proto.sh"
  },
  "dependencies": {
    "google-protobuf": "^3.21.0"
  },
  "devDependencies": {
    "@types/google-protobuf": "^3.15.0"
  }
}
EOF

# Create README for the proto module
cat > client/src/proto/README.md << 'EOF'
# Battle Tanks Protocol Buffers

This directory contains the generated JavaScript/TypeScript Protocol Buffer files for the Battle Tanks game.

## Usage

### CommonJS
```javascript
const { ProtoNetworkMessage, ProtoPlayerInput } = require('./commonjs');

const input = new ProtoPlayerInput();
input.setForward(true);
input.setFire(true);
```

### ES6 Modules
```javascript
import { ProtoNetworkMessage, ProtoPlayerInput } from './es6';

const input = new ProtoPlayerInput();
input.setForward(true);
input.setFire(true);
```

### TypeScript
```typescript
import { ProtoNetworkMessage, ProtoPlayerInput } from './typescript/messages_pb';

const input = new ProtoPlayerInput();
input.setForward(true);
input.setFire(true);
```

## Regenerating Files

To regenerate the Protocol Buffer files after updating the .proto definitions:

```bash
npm run build
# or
../../scripts/generate-js-proto.sh
```

## Message Types

- **ProtoNetworkMessage**: Main wrapper for all network messages
- **ProtoPlayerInput**: Player input (movement, firing, etc.)
- **JoinGameRequest/Response**: Game joining flow
- **ProtoGameStateUpdate**: Server state updates
- **TankState**: Individual tank state
- **ProjectileState**: Projectile state
- **PowerUpState**: Power-up state
- **PingRequest/PongResponse**: Latency measurement

## WebSocket Usage Example

```javascript
import { ProtoNetworkMessage, ProtoPlayerInput } from './es6';

const ws = new WebSocket('ws://localhost:8080');

// Send player input
const input = new ProtoPlayerInput();
input.setForward(true);
input.setTimestamp(Date.now());

const message = new ProtoNetworkMessage();
message.setTimestamp(Date.now());
message.setPlayerInput(input);

ws.send(message.serializeBinary());

// Receive messages
ws.onmessage = (event) => {
    const data = new Uint8Array(event.data);
    const message = ProtoNetworkMessage.deserializeBinary(data);
    
    if (message.hasGameStateUpdate()) {
        const gameState = message.getGameStateUpdate();
        console.log('Received game state for tick:', gameState.getTick());
    }
};
```
EOF

echo -e "${GREEN}✅ JavaScript Protocol Buffer files generated successfully!${NC}"
echo -e "${GREEN}📁 Files created in: client/src/proto/${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "   1. Install dependencies: cd client && npm install google-protobuf"
echo "   2. For TypeScript: npm install @types/google-protobuf"
echo "   3. Import and use the generated files in your client code"
echo ""
echo -e "${GREEN}🎮 Ready for Milestone 3: Three.js Client Implementation!${NC}" 