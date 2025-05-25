use std::env;
use std::path::PathBuf;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let proto_file = "../proto/messages.proto";
    let out_dir = PathBuf::from(env::var("OUT_DIR").unwrap());

    // Tell cargo to recompile if the proto file changes
    println!("cargo:rerun-if-changed={}", proto_file);

    prost_build::Config::new()
        .out_dir(&out_dir)
        .compile_protos(&[proto_file], &["../proto/"])?;

    Ok(())
} 