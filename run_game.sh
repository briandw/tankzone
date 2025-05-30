#!/bin/bash

# BattleX One - Launch Server and Client
echo "🚀 Starting BattleX One..."

# Kill any existing server processes
echo "🧹 Cleaning up existing processes..."
pkill -f "target/debug/server" 2>/dev/null || true
pkill -f "cargo run --bin server" 2>/dev/null || true

# Start the server in the background
echo "🔧 Starting server..."
cargo run --bin server &
SERVER_PID=$!

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    kill $SERVER_PID 2>/dev/null || true
    pkill -f "target/debug/server" 2>/dev/null || true
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for server to be ready
echo "⏳ Waiting for server to start..."
for i in {1..10}; do
    if lsof -i :3001 >/dev/null 2>&1; then
        echo "✅ Server is ready on port 3001!"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "❌ Server failed to start within 10 seconds"
        cleanup
    fi
    sleep 1
done

# Small delay to ensure server is fully ready
sleep 1

# Start the client
echo "🎮 Launching client..."
echo "🎯 Controls: WASD (move), Arrow Keys (turret), Space (fire)"
echo "🔗 Server running at http://localhost:3000 (web client) and ws://localhost:3001 (native client)"
echo ""

cargo run --bin client

# Cleanup when client exits
cleanup 