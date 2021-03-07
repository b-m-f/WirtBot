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

#[tokio::test]
async fn test_ok() {
    let filter = ok();

    let response = warp::test::request().path("/ok").reply(&filter).await;
    assert_eq!(response.body(), "OK");
}
