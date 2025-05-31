use bevy::prelude::*;
use crate::input::{handle_input, send_input};
use crate::rendering::{update_game_entities, update_camera, setup_rendering};
use crate::network::{ConnectionState, WebSocketSender, setup_network};
use crate::game_state::{GameStateResource, PlayerInfo};
use crate::tank_model::TankModel;

pub fn setup_game_systems(app: &mut App) {
    app.add_systems(Startup, setup)
        .add_systems(Update, (
            handle_input,
            send_input,
            update_game_entities,
            update_camera,
        ));
}

fn setup(
    commands: Commands,
    game_state: Res<GameStateResource>,
    player_info: Res<PlayerInfo>,
    connection_state: Res<ConnectionState>,
    ws_sender: Res<WebSocketSender>,
    asset_server: Res<AssetServer>,
    tank_model: ResMut<TankModel>,
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