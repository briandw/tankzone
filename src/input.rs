use bevy::prelude::*;
use std::collections::HashMap;
use battlexone_shared::*;
use crate::network::WebSocketSender;
use crate::game_state::PlayerInfo;

#[derive(Resource)]
pub struct InputState {
    pub keys: HashMap<String, bool>,
}

impl InputState {
    pub fn new() -> Self {
        Self {
            keys: HashMap::new(),
        }
    }

    pub fn update_from_keyboard(&mut self, keyboard_input: &ButtonInput<KeyCode>) {
        // Movement keys
        self.keys.insert("KeyW".to_string(), keyboard_input.pressed(KeyCode::KeyW));
        self.keys.insert("KeyA".to_string(), keyboard_input.pressed(KeyCode::KeyA));
        self.keys.insert("KeyS".to_string(), keyboard_input.pressed(KeyCode::KeyS));
        self.keys.insert("KeyD".to_string(), keyboard_input.pressed(KeyCode::KeyD));
        
        // Arrow keys
        self.keys.insert("ArrowLeft".to_string(), keyboard_input.pressed(KeyCode::ArrowLeft));
        self.keys.insert("ArrowRight".to_string(), keyboard_input.pressed(KeyCode::ArrowRight));
        self.keys.insert("ArrowUp".to_string(), keyboard_input.pressed(KeyCode::ArrowUp));
        self.keys.insert("ArrowDown".to_string(), keyboard_input.pressed(KeyCode::ArrowDown));
        
        // Action keys
        self.keys.insert("Space".to_string(), keyboard_input.pressed(KeyCode::Space));
    }

    pub fn has_input(&self) -> bool {
        self.keys.values().any(|&pressed| pressed)
    }

    pub fn get_input_bitfield(&self) -> u16 {
        encode_keys(&self.keys.iter().map(|(k, v)| (k.as_str(), *v)).collect())
    }
}

pub fn handle_input(
    mut input_state: ResMut<InputState>,
    keyboard_input: Res<ButtonInput<KeyCode>>,
) {
    input_state.update_from_keyboard(&keyboard_input);
}

pub fn send_input(
    input_state: Res<InputState>,
    ws_sender: Res<WebSocketSender>,
    player_info: Res<PlayerInfo>,
) {
    // Only send input if we're connected and joined
    if player_info.get_player_id().is_none() {
        return;
    }
    
    // Check if we have any keys pressed
    if !input_state.has_input() {
        return; // Don't send empty input
    }
    
    // Send input to server
    if let Some(sender) = ws_sender.sender.lock().unwrap().as_ref() {
        let input_msg = ClientMessage::Input { 
            input: input_state.get_input_bitfield() 
        };
        if let Ok(msg_str) = serde_json::to_string(&input_msg) {
            let _ = sender.send(msg_str);
        }
    }
} 