use bevy::prelude::*;
use bevy::window::WindowResolution;
use std::sync::{Arc, Mutex};

mod tank_model;
use tank_model::TankModel;

mod network;
use network::{ConnectionState, WebSocketSender, setup_network};

mod game_state;
use game_state::{GameStateResource, PlayerInfo};

mod input;
use input::{InputState, handle_input, send_input};

mod rendering;
use rendering::{setup_rendering, update_game_entities, update_camera};

fn main() {
    App::new()
        .add_plugins(DefaultPlugins.set(WindowPlugin {
            primary_window: Some(Window {
                title: "BattleX One - Native Client".into(),
                resolution: WindowResolution::new(1200.0, 800.0),
                ..default()
            }),
            ..default()
        }))
        .insert_resource(GameStateResource::new())
        .insert_resource(PlayerInfo::new())
        .insert_resource(InputState::new())
        .insert_resource(ConnectionState {
            connected: Arc::new(Mutex::new(false)),
        })
        .insert_resource(WebSocketSender {
            sender: Arc::new(Mutex::new(None)),
        })
        .insert_resource(TankModel {
            body_scene: Handle::default(),
            turret_scene: Handle::default(),
        })
        .add_systems(Startup, setup)
        .add_systems(Update, (
            handle_input,
            send_input,
            update_game_entities,
            update_camera,
        ))
        .run();
}

fn setup(
    mut commands: Commands,
    game_state: Res<GameStateResource>,
    player_info: Res<PlayerInfo>,
    connection_state: Res<ConnectionState>,
    ws_sender: Res<WebSocketSender>,
    asset_server: Res<AssetServer>,
    mut tank_model: ResMut<TankModel>,
) {
    // Setup rendering
    setup_rendering(commands, asset_server, tank_model);
    
    // Start WebSocket connection
    setup_network(
        game_state,
        player_info,
        connection_state.connected.clone(),
        ws_sender.sender.clone(),
    );
} 