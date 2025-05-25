#!/bin/bash

# Generate JavaScript Protocol Buffer files from .proto definitions
# This ensures consistency between Rust and JavaScript implementations

set -e

echo "🔧 Generating JavaScript Protocol Buffer files..."

# Check if protoc is installed
if ! command -v protoc &> /dev/null; then
    echo "❌ protoc is not installed. Please install Protocol Buffers compiler:"
    echo "   macOS: brew install protobuf"
    echo "   Ubuntu: sudo apt-get install protobuf-compiler"
    echo "   Windows: Download from https://github.com/protocolbuffers/protobuf/releases"
    exit 1
fi

# Check if protobuf.js is installed
if ! command -v pbjs &> /dev/null; then
    echo "❌ protobuf.js is not installed. Installing..."
    npm install -g protobufjs-cli
fi

# Create output directory
mkdir -p client/src/proto

# Generate JavaScript files from the same .proto files used by Rust
echo "📦 Generating JavaScript Protocol Buffer files..."

# Generate static JavaScript modules
pbjs -t static-module -w commonjs -o client/src/proto/messages.js proto/*.proto

# Generate TypeScript definitions (optional but recommended)
pbts -o client/src/proto/messages.d.ts client/src/proto/messages.js

echo "✅ JavaScript Protocol Buffer files generated successfully!"
echo "   📁 Output: client/src/proto/"
echo "   📄 Files: messages.js, messages.d.ts"
echo ""
echo "💡 Usage in JavaScript:"
echo "   const { NetworkMessage } = require('./proto/messages.js');"
echo "   const message = NetworkMessage.create({ timestamp: Date.now() });"
echo "   const buffer = NetworkMessage.encode(message).finish();" 