use bevy::prelude::*;

mod tank_model;
mod network;
mod game_state;
mod input;
mod rendering;
mod systems;
mod config;

use systems::setup_game_systems;
use config::{setup_window_config, setup_resources};

fn main() {
    let mut app = App::new();
    app.add_plugins(DefaultPlugins.set(setup_window_config()));
    setup_resources(&mut app);
    setup_game_systems(&mut app);
    app.run();
} 