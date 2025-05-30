#!/bin/bash

# Battle Tanks Development Script

case "$1" in
    "dev"|"watch")
        echo "🚀 Starting development server with auto-reload..."
        echo "📝 Server will restart automatically when you save Rust files"
        echo "🌐 HTTP: http://localhost:3000"
        echo "🔌 WebSocket: ws://localhost:3001"
        echo "📱 Network: http://$(ipconfig getifaddr en0 2>/dev/null || hostname -I | awk '{print $1}'):3000"
        echo ""
        cargo watch -x run
        ;;
    "build")
        echo "🔨 Building project..."
        cargo build
        ;;
    "test")
        echo "🧪 Running unit tests..."
        cargo test
        ;;
    "test-integration")
        echo "🧪 Running integration tests (requires server)..."
        echo "⚠️  Make sure server is running with: ./dev.sh dev"
        cargo test -- --ignored
        ;;
    "test-all")
        echo "🧪 Running all tests..."
        echo "⚠️  Integration tests require server to be running"
        cargo test -- --include-ignored
        ;;
    "clean")
        echo "🧹 Cleaning build artifacts..."
        cargo clean
        ;;
    "stop")
        echo "🛑 Stopping all battlexone processes..."
        pkill -f battlexone
        echo "✅ Stopped"
        ;;
    "install-tools")
        echo "🔧 Installing development tools..."
        cargo install cargo-watch
        echo "✅ Tools installed"
        ;;
    *)
        echo "🎮 Battle Tanks Development Commands:"
        echo ""
        echo "  ./dev.sh dev              - Start development server with auto-reload"
        echo "  ./dev.sh build            - Build the project"
        echo "  ./dev.sh test             - Run unit tests"
        echo "  ./dev.sh test-integration - Run integration tests (requires server)"
        echo "  ./dev.sh test-all         - Run all tests"
        echo "  ./dev.sh clean            - Clean build artifacts"
        echo "  ./dev.sh stop             - Stop all running servers"
        echo "  ./dev.sh install-tools    - Install cargo-watch"
        echo ""
        echo "🚀 Quick start: ./dev.sh dev"
        ;;
esac 