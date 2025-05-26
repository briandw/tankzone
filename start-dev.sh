#!/bin/bash

echo "🚀 Starting BattleTanks Development Environment"
echo "=============================================="

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down development environment..."
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null
        echo "   ✅ Server stopped"
    fi
    if [ ! -z "$CLIENT_PID" ]; then
        kill $CLIENT_PID 2>/dev/null
        echo "   ✅ Client dev server stopped"
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "📦 Building Protocol Buffers..."
npm run build

echo "🔧 Starting Rust server..."
cargo run --bin battletanks-server &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

echo "🌐 Starting client development server..."
cd client
npm run dev &
CLIENT_PID=$!
cd ..

echo ""
echo "🎮 Development Environment Ready!"
echo "================================="
echo "🔗 Server:     ws://localhost:8080"
echo "🌐 Client:     http://localhost:3000"
echo "🏥 Health:     http://localhost:8081/health"
echo ""
echo "📋 Available Commands:"
echo "   npm run test-full    - Run comprehensive connection test"
echo "   npm run test-client  - Run basic client test"
echo "   npm run test-e2e     - Run end-to-end tests"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for background processes
wait 