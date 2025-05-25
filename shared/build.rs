use std::io::Result;
use std::path::PathBuf;

fn main() -> Result<()> {
    // Tell cargo to rerun this build script if the proto files change
    println!("cargo:rerun-if-changed=../proto/");
    
    // Get the output directory
    let out_dir = std::env::var("OUT_DIR").unwrap();
    let out_path = PathBuf::from(&out_dir);
    
    // Configure prost_build
    let mut config = prost_build::Config::new();
    config.out_dir(&out_path);
    
    // Compile the protocol buffer files
    config.compile_protos(&["../proto/messages.proto"], &["../proto/"])?;
    
    Ok(())
}
