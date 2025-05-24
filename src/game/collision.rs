use super::{Player, Bullet};

pub fn check_bullet_player_collision(bullet: &Bullet, player: &Player) -> bool {
    // Don't collide with the player who fired the bullet
    if bullet.player_id == player.id {
        return false;
    }

    // Simple sphere collision (tank is roughly 2.5 units wide)
    let collision_distance = 2.0; // Slightly smaller than tank for better gameplay
    bullet.distance_to_point(player.position) < collision_distance
}

pub fn check_all_collisions(bullets: &[Bullet], players: &[Player]) -> Vec<(usize, usize)> {
    let mut collisions = Vec::new();
    
    for (bullet_idx, bullet) in bullets.iter().enumerate() {
        for (player_idx, player) in players.iter().enumerate() {
            if check_bullet_player_collision(bullet, player) {
                collisions.push((bullet_idx, player_idx));
            }
        }
    }
    
    collisions
}

pub fn point_in_bounds(position: [f32; 3], bounds: f32) -> bool {
    position[0].abs() <= bounds && 
    position[2].abs() <= bounds &&
    position[1] >= 0.0 && 
    position[1] <= bounds
} 