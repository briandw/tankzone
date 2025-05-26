const { spawn } = require('child_process');
const { promisify } = require('util');
const net = require('net');

const sleep = promisify(setTimeout);

// Find an available port
async function findAvailablePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });
}

// Check if port is in use
async function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(false));
    });
    server.on('error', () => resolve(true));
  });
}

module.exports = async () => {
  console.log('🚀 Setting up E2E test environment...');
  
  // Find available port for server
  const serverPort = await findAvailablePort();
  console.log(`📡 Using server port: ${serverPort}`);
  
  // Start the Rust server
  const projectRoot = process.cwd().endsWith('/client') ? process.cwd().replace('/client', '') : process.cwd();
  const serverProcess = spawn('cargo', ['run', '--bin', 'battletanks-server', '--', '--port', serverPort.toString()], {
    cwd: projectRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, RUST_LOG: 'warn' }
  });
  
  // Wait for server to start
  console.log('⏳ Waiting for server to start...');
  await sleep(3000);
  
  // Check if server is running
  const serverRunning = await isPortInUse(serverPort);
  if (!serverRunning) {
    throw new Error('Failed to start server');
  }
  
  console.log('✅ Server started successfully');
  
  // Store server info for tests
  global.__SERVER_PORT__ = serverPort;
  global.__SERVER_PROCESS__ = serverProcess;
  global.__SERVER_URL__ = `ws://127.0.0.1:${serverPort}`;
}; 