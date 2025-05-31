use bevy::prelude::*;
use bevy::window::WindowResolution;
use std::sync::{Arc, Mutex};
use crate::game_state::{GameStateResource, PlayerInfo};
use crate::input::InputState;
use crate::network::{ConnectionState, WebSocketSender};
use crate::tank_model::TankModel;

pub fn setup_window_config() -> WindowPlugin {
    WindowPlugin {
        primary_window: Some(Window {
            title: "BattleX One - Native Client".into(),
            resolution: WindowResolution::new(1200.0, 800.0),
            ..default()
        }),
        ..default()
    }
}

pub fn setup_resources(app: &mut App) {
    app.insert_resource(GameStateResource::new())
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
        });
} 