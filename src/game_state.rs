use bevy::prelude::*;
use std::sync::{Arc, Mutex};
use battlexone_shared::*;

#[derive(Resource)]
pub struct GameStateResource {
    data: Arc<Mutex<(Vec<Tank>, Vec<Bullet>)>>,
}

impl GameStateResource {
    pub fn new() -> Self {
        Self {
            data: Arc::new(Mutex::new((Vec::new(), Vec::new()))),
        }
    }

    pub fn get_data(&self) -> Arc<Mutex<(Vec<Tank>, Vec<Bullet>)>> {
        self.data.clone()
    }

    #[allow(dead_code)]
    pub fn get_game_state(&self) -> (Vec<Tank>, Vec<Bullet>) {
        let data = self.data.lock().unwrap();
        data.clone()
    }

    #[allow(dead_code)]
    pub fn update_game_state(&self, tanks: Vec<Tank>, bullets: Vec<Bullet>) {
        let mut data = self.data.lock().unwrap();
        *data = (tanks, bullets);
    }
}

#[derive(Resource, Clone)]
pub struct PlayerInfo {
    player_id: Arc<Mutex<Option<String>>>,
    user_id: Arc<Mutex<Option<String>>>,
}

impl PlayerInfo {
    pub fn new() -> Self {
        Self {
            player_id: Arc::new(Mutex::new(None)),
            user_id: Arc::new(Mutex::new(None)),
        }
    }

    pub fn get_player_id(&self) -> Option<String> {
        self.player_id.lock().unwrap().clone()
    }

    pub fn get_player_id_arc(&self) -> Arc<Mutex<Option<String>>> {
        self.player_id.clone()
    }

    #[allow(dead_code)]
    pub fn set_player_id(&self, id: String) {
        let mut player_id = self.player_id.lock().unwrap();
        *player_id = Some(id);
    }

    #[allow(dead_code)]
    pub fn is_player(&self, tank_id: &str) -> bool {
        if let Some(id) = self.get_player_id() {
            id == tank_id
        } else {
            false
        }
    }

    #[allow(dead_code)]
    pub fn get_user_id(&self) -> Option<String> {
        self.user_id.lock().unwrap().clone()
    }

    pub fn get_user_id_arc(&self) -> Arc<Mutex<Option<String>>> {
        self.user_id.clone()
    }

    #[allow(dead_code)]
    pub fn set_user_id(&self, id: String) {
        let mut user_id = self.user_id.lock().unwrap();
        *user_id = Some(id);
    }
} 