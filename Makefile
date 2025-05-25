# Battle Tanks - Unified Build System
# This Makefile coordinates building both Rust server and JavaScript client components

.PHONY: all build clean test dev install proto help

# Default target
all: build

# Install all dependencies
install:
	@echo "📦 Installing dependencies..."
	cargo fetch
	npm install
	@echo "✅ Dependencies installed"

# Generate Protocol Buffer files for both Rust and JavaScript
proto:
	@echo "🔧 Generating Protocol Buffer files..."
	cargo build --package battletanks-shared  # This generates Rust protobuf files
	./scripts/generate-js-proto.sh
	@echo "✅ Protocol Buffer files generated"

# Build everything (Rust + JS protobuf generation)
build: proto
	@echo "🔨 Building Rust server..."
	cargo build --workspace
	@echo "✅ Build completed"

# Build for production
build-release: proto
	@echo "🚀 Building for production..."
	cargo build --workspace --release
	@echo "✅ Production build completed"

# Run all tests
test: proto
	@echo "🧪 Running Rust tests..."
	cargo test --workspace
	@echo "🧪 Running end-to-end JavaScript ↔ Rust tests..."
	@$(MAKE) test-e2e
	@echo "✅ All tests completed"

# Test JavaScript client against Rust server (end-to-end)
test-e2e: build
	@echo "🔗 Running end-to-end JavaScript ↔ Rust Protocol Buffer tests..."
	@echo "🚀 Starting server on ephemeral port..."
	@PORT=$$(python3 -c "import socket; s=socket.socket(); s.bind(('',0)); print(s.getsockname()[1]); s.close()"); \
	echo "📡 Using port $$PORT"; \
	RUST_LOG=warn cargo run --bin battletanks-server -- --port $$PORT > /dev/null 2>&1 & \
	SERVER_PID=$$!; \
	echo "⏳ Waiting for server to start..."; \
	sleep 3; \
	echo "🧪 Running JavaScript client tests..."; \
	if node client/test-client.js $$PORT; then \
		echo "✅ End-to-end tests PASSED"; \
		kill $$SERVER_PID 2>/dev/null || true; \
		exit 0; \
	else \
		echo "❌ End-to-end tests FAILED"; \
		kill $$SERVER_PID 2>/dev/null || true; \
		exit 1; \
	fi

# Run integration tests (requires server to be running)
test-integration: build
	@echo "🔬 Running integration tests..."
	cargo test --package server --test integration_tests
	@echo "✅ Integration tests completed"

# Development mode - watch for changes and rebuild
dev:
	@echo "🔄 Starting development mode..."
	cargo watch -x "build --package server" -s "make proto"

# Start the server
run: build
	@echo "🚀 Starting Battle Tanks server..."
	cargo run --bin server

# Start server in release mode
run-release: build-release
	@echo "🚀 Starting Battle Tanks server (release mode)..."
	cargo run --bin server --release

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	cargo clean
	rm -rf client/src/proto/
	rm -rf node_modules/
	@echo "✅ Clean completed"

# Format code
fmt:
	@echo "🎨 Formatting Rust code..."
	cargo fmt --all
	@echo "✅ Code formatted"

# Run linter
lint:
	@echo "🔍 Running Rust linter..."
	cargo clippy --workspace -- -D warnings
	@echo "✅ Linting completed"

# Check everything (format, lint, test)
check: fmt lint test
	@echo "✅ All checks passed"

# Development workflow - install, build, test
setup: install build test
	@echo "🎉 Setup completed! Ready for development."
	@echo ""
	@echo "Next steps:"
	@echo "  make run          # Start the server"
	@echo "  make dev          # Development mode with auto-rebuild"
	@echo "  make test         # Run all tests"

# Show help
help:
	@echo "Battle Tanks Build System"
	@echo ""
	@echo "Available targets:"
	@echo "  install           Install all dependencies"
	@echo "  proto             Generate Protocol Buffer files"
	@echo "  build             Build everything (Rust + JS protobuf)"
	@echo "  build-release     Build for production"
	@echo "  test              Run all tests"
	@echo "  test-e2e          Run end-to-end JavaScript ↔ Rust tests"
	@echo "  test-integration  Run integration tests"
	@echo "  dev               Development mode with auto-rebuild"
	@echo "  run               Start the server"
	@echo "  run-release       Start server in release mode"
	@echo "  clean             Clean build artifacts"
	@echo "  fmt               Format code"
	@echo "  lint              Run linter"
	@echo "  check             Format, lint, and test"
	@echo "  setup             Complete setup (install + build + test)"
	@echo "  help              Show this help"
	@echo ""
	@echo "Development workflow:"
	@echo "  1. make setup     # First time setup"
	@echo "  2. make dev       # Development mode"
	@echo "  3. make test      # Run tests" 