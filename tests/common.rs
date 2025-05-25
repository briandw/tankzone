use std::process::{Command, Stdio, Child};
use std::sync::{Once, Mutex};
use std::time::Duration;
use tokio::time::sleep;
use std::io::{BufRead, BufReader};
use std::thread;

static CHROMEDRIVER_INIT: Once = Once::new();
static CHROMEDRIVER_PROCESS: Mutex<Option<Child>> = Mutex::new(None);

pub struct TestEnvironment {
    pub chromedriver_available: bool,
    pub server_port: u16,
}

impl TestEnvironment {
    pub async fn setup() -> Self {
        let chromedriver_available = Self::ensure_chromedriver().await;
        
        Self {
            chromedriver_available,
            server_port: 0, // Will be set by individual tests
        }
    }
    
    async fn ensure_chromedriver() -> bool {
        let mut available = false;
        
        CHROMEDRIVER_INIT.call_once(|| {
            // First check if ChromeDriver is installed
            if !Self::check_chromedriver_installed() {
                println!("⚠️  ChromeDriver not found. Attempting to install...");
                if !Self::install_chromedriver() {
                    println!("❌ Failed to install ChromeDriver. Browser tests will be skipped.");
                    return;
                }
            }
            
            // Try to start ChromeDriver
            if Self::start_chromedriver() {
                available = true;
                println!("✅ ChromeDriver started successfully on port 9515");
                
                // Set up cleanup on process exit
                std::panic::set_hook(Box::new(|_| {
                    Self::cleanup_chromedriver();
                }));
                
                // Also try to clean up on Ctrl+C
                ctrlc::set_handler(|| {
                    Self::cleanup_chromedriver();
                    std::process::exit(0);
                }).ok();
            } else {
                println!("❌ Failed to start ChromeDriver. Browser tests will be skipped.");
            }
        });
        
        // Check if ChromeDriver is responding
        if Self::check_chromedriver_running().await {
            true
        } else {
            println!("⚠️  ChromeDriver not responding. Browser tests will be skipped.");
            false
        }
    }
    
    fn check_chromedriver_installed() -> bool {
        Command::new("chromedriver")
            .arg("--version")
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .status()
            .map(|status| status.success())
            .unwrap_or(false)
    }
    
    fn install_chromedriver() -> bool {
        #[cfg(target_os = "macos")]
        {
            println!("📦 Installing ChromeDriver via Homebrew...");
            Command::new("brew")
                .args(&["install", "chromedriver"])
                .status()
                .map(|status| status.success())
                .unwrap_or(false)
        }
        
        #[cfg(target_os = "linux")]
        {
            println!("📦 Installing ChromeDriver for Linux...");
            // This is a simplified version - in production you'd want more robust error handling
            let output = Command::new("curl")
                .args(&["-sS", "chromedriver.storage.googleapis.com/LATEST_RELEASE"])
                .output();
                
            if let Ok(version_output) = output {
                let version = String::from_utf8_lossy(&version_output.stdout).trim().to_string();
                let url = format!("https://chromedriver.storage.googleapis.com/{}/chromedriver_linux64.zip", version);
                
                // Download and install
                let download_success = Command::new("wget")
                    .args(&["-O", "/tmp/chromedriver.zip", &url])
                    .status()
                    .map(|s| s.success())
                    .unwrap_or(false);
                    
                if download_success {
                    Command::new("unzip")
                        .args(&["/tmp/chromedriver.zip", "-d", "/tmp/"])
                        .status()
                        .ok();
                        
                    Command::new("sudo")
                        .args(&["mv", "/tmp/chromedriver", "/usr/local/bin/"])
                        .status()
                        .ok();
                        
                    Command::new("sudo")
                        .args(&["chmod", "+x", "/usr/local/bin/chromedriver"])
                        .status()
                        .ok();
                        
                    std::fs::remove_file("/tmp/chromedriver.zip").ok();
                    
                    return Self::check_chromedriver_installed();
                }
            }
            false
        }
        
        #[cfg(not(any(target_os = "macos", target_os = "linux")))]
        {
            println!("❌ Automatic ChromeDriver installation not supported on this OS.");
            println!("   Please install ChromeDriver manually: https://chromedriver.chromium.org/");
            false
        }
    }
    
    fn start_chromedriver() -> bool {
        // Kill any existing ChromeDriver processes
        #[cfg(not(target_os = "windows"))]
        {
            Command::new("pkill")
                .arg("chromedriver")
                .status()
                .ok();
        }
        
        // Start ChromeDriver
        let child = Command::new("chromedriver")
            .args(&["--port=9515", "--silent"])
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn();
            
        match child {
            Ok(mut process) => {
                // Store the process handle for cleanup
                *CHROMEDRIVER_PROCESS.lock().unwrap() = Some(process);
                
                // Give ChromeDriver a moment to start
                thread::sleep(Duration::from_millis(2000));
                true
            },
            Err(e) => {
                println!("❌ Failed to start ChromeDriver: {}", e);
                false
            }
        }
    }
    
    async fn check_chromedriver_running() -> bool {
        // Try to connect to ChromeDriver's status endpoint
        let client = reqwest::Client::new();
        let url = "http://localhost:9515/status";
        
        for _ in 0..5 {
            if let Ok(response) = client.get(url).send().await {
                if response.status().is_success() {
                    return true;
                }
            }
            sleep(Duration::from_millis(500)).await;
        }
        false
    }
    
    fn cleanup_chromedriver() {
        if let Ok(mut guard) = CHROMEDRIVER_PROCESS.lock() {
            if let Some(mut process) = guard.take() {
                println!("🧹 Cleaning up ChromeDriver process...");
                process.kill().ok();
                process.wait().ok();
            }
        }
        
        // Also try to kill any remaining processes
        #[cfg(not(target_os = "windows"))]
        {
            Command::new("pkill")
                .arg("chromedriver")
                .status()
                .ok();
        }
    }
    
    pub fn requires_browser(&self) -> bool {
        if !self.chromedriver_available {
            println!("⏭️  Skipping browser test - ChromeDriver not available");
            return false;
        }
        true
    }
}

impl Drop for TestEnvironment {
    fn drop(&mut self) {
        // This will be called when the test environment is dropped
        // The actual cleanup is handled by the static cleanup function
    }
} 