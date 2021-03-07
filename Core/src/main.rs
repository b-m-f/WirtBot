use pretty_env_logger;

mod api;
mod crypto;
mod filesystem;

#[macro_use]
extern crate log;

#[tokio::main]
async fn main() {
    // Setup server
    pretty_env_logger::init();
    api::start_api().await;
}
