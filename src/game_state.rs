use bevy::prelude::*;
use std::sync::{Arc, Mutex};
use battlexone_shared::*;

#[derive(Resource, Clone)]
pub struct GameStateResource {
    pub data: Arc<Mutex<(Vec<Tank>, Vec<Bullet>)>>,
}

#[derive(Resource, Clone)]
pub struct PlayerInfo {
    pub player_id: Arc<Mutex<Option<String>>>,
    pub user_id: String,
}

impl GameStateResource {
    pub fn new() -> Self {
        Self {
            data: Arc::new(Mutex::new((Vec::new(), Vec::new()))),
        }
    }

    pub fn get_game_state(&self) -> (Vec<Tank>, Vec<Bullet>) {
        let data = self.data.lock().unwrap();
        data.clone()
    }

    pub fn update_game_state(&self, tanks: Vec<Tank>, bullets: Vec<Bullet>) {
        let mut data = self.data.lock().unwrap();
        *data = (tanks, bullets);
    }
}

impl PlayerInfo {
    pub fn new() -> Self {
        Self {
            player_id: Arc::new(Mutex::new(None)),
            user_id: uuid::Uuid::new_v4().to_string(),
        }
    }

    pub fn get_player_id(&self) -> Option<String> {
        let player_id = self.player_id.lock().unwrap();
        player_id.clone()
    }

    pub fn set_player_id(&self, id: String) {
        let mut player_id = self.player_id.lock().unwrap();
        *player_id = Some(id);
    }

    pub fn is_player(&self, tank_id: &str) -> bool {
        if let Some(id) = self.get_player_id() {
            id == tank_id
        } else {
            false
        }
    }
} 