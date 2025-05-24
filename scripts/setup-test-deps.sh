#!/bin/bash

echo "Setting up test dependencies..."

# Check if ChromeDriver is installed
if ! command -v chromedriver &> /dev/null; then
    echo "ChromeDriver not found. Installing..."
    
    # Detect OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            echo "Installing ChromeDriver via Homebrew..."
            brew install chromedriver
        else
            echo "Please install Homebrew first: https://brew.sh/"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        echo "Installing ChromeDriver on Linux..."
        CHROME_DRIVER_VERSION=$(curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE)
        wget -O /tmp/chromedriver.zip "https://chromedriver.storage.googleapis.com/${CHROME_DRIVER_VERSION}/chromedriver_linux64.zip"
        unzip /tmp/chromedriver.zip -d /tmp/
        sudo mv /tmp/chromedriver /usr/local/bin/
        sudo chmod +x /usr/local/bin/chromedriver
        rm /tmp/chromedriver.zip
    else
        echo "Unsupported OS. Please install ChromeDriver manually."
        exit 1
    fi
else
    echo "ChromeDriver already installed: $(chromedriver --version)"
fi

echo "Test dependencies setup complete!"
echo ""
echo "To run tests:"
echo "1. Start ChromeDriver in background: chromedriver --port=9515 &"
echo "2. Run tests: cargo test" 