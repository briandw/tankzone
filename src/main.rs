use axum::{
    extract::{ws::WebSocket, WebSocketUpgrade},
    response::Response,
    routing::{get, get_service},
    Router,
    Json,
};
use std::net::SocketAddr;
use tower::ServiceBuilder;
use tower_http::services::ServeDir;
use tracing::info;
use serde_json::json;

mod game;
mod network;

use game::GameServer;

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::fmt::init();

    // Create shared game server
    let game_server = GameServer::new();

    // Build our application with routes
    let app = Router::new()
        .route("/ws", get(websocket_handler))
        .route("/health", get(health_check))
        .nest_service("/", get_service(ServeDir::new("public")))
        .with_state(game_server)
        .layer(
            ServiceBuilder::new()
                .layer(tower_http::cors::CorsLayer::permissive())
        );

    // Run it
    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    info!("Battlezone Rust server listening on {}", addr);
    info!("Visit http://localhost:3000 to play");

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn websocket_handler(
    ws: WebSocketUpgrade,
    axum::extract::State(game_server): axum::extract::State<GameServer>,
) -> Response {
    ws.on_upgrade(|socket| handle_websocket(socket, game_server))
}

async fn handle_websocket(socket: WebSocket, game_server: GameServer) {
    network::websocket::handle_connection(socket, game_server).await;
}

async fn health_check() -> Json<serde_json::Value> {
    Json(json!({
        "status": "ok",
        "service": "battlezone-server"
    }))
} 