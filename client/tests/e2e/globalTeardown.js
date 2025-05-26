module.exports = async () => {
  console.log('🧹 Cleaning up E2E test environment...');
  
  // Kill server process
  if (global.__SERVER_PROCESS__) {
    console.log('🛑 Stopping server...');
    global.__SERVER_PROCESS__.kill('SIGTERM');
    
    // Wait a bit for graceful shutdown
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Force kill if still running
    if (!global.__SERVER_PROCESS__.killed) {
      global.__SERVER_PROCESS__.kill('SIGKILL');
    }
    
    console.log('✅ Server stopped');
  }
}; 