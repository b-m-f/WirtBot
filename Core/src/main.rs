use base64::{decode, encode};
use ed25519_dalek::{
    Digest, Keypair, PublicKey, Sha512, Signature, PUBLIC_KEY_LENGTH, SIGNATURE_LENGTH,
};
use rand::rngs::OsRng;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::convert::Infallible;
use std::env;
use std::fs::OpenOptions;
use std::io::prelude::*;
use std::io::Result as IOResult;
use warp::http::StatusCode;
use warp::{reject, Filter, Rejection, Reply};

use pretty_env_logger;

mod managed_dns;

#[macro_use]
extern crate log;

#[derive(Deserialize, Serialize)]
struct Peer {
    public_key: String,
    address: [i8; 4],
}

#[derive(Deserialize, Serialize)]
struct Server {
    private_key: String,
    port: i16,
    address: [i8; 4],
}

#[derive(Deserialize, Serialize)]
struct Payload {
    server: Server,
    peers: Vec<Peer>,
}

#[derive(Deserialize, Serialize)]
struct Message {
    message: String,
    signature: String,
}

#[derive(Debug)]
struct IncorrectSignature;
impl reject::Reject for IncorrectSignature {}

#[derive(Debug)]
struct FeatureDisabled;
impl reject::Reject for FeatureDisabled {}

#[derive(Debug)]
struct FailWritingConfig;
impl reject::Reject for FailWritingConfig {}

// JSON replies

/// An API error serializable to JSON.
#[derive(Serialize)]
struct ErrorMessage {
    code: u16,
    message: String,
}

// This function receives a `Rejection` and tries to return a custom
// value, otherwise simply passes the rejection along.
async fn handle_rejection(err: Rejection) -> Result<impl Reply, Infallible> {
    let code;
    let message;

    if err.is_not_found() {
        code = StatusCode::NOT_FOUND;
        message = "";
    } else if let Some(IncorrectSignature) = err.find() {
        code = StatusCode::UNAUTHORIZED;
        message = "Not authorized to update configuration";
    } else if let Some(FailWritingConfig) = err.find() {
        code = StatusCode::INTERNAL_SERVER_ERROR;
        message = "Could not write config. Please check the server logs";
    } else {
        // We should have expected this... Just log and say its a 500
        error!("Unhandled rejection: {:?}", err);
        code = StatusCode::INTERNAL_SERVER_ERROR;
        message = "UNHANDLED_REJECTION";
    }

    let json = warp::reply::json(&ErrorMessage {
        code: code.as_u16(),
        message: message.into(),
    });
    Ok(warp::reply::with_status(json, code))
}

fn decode_public_key_base64(public_key_base64: String) -> PublicKey {
    let mut raw_public_key_buffer = [0; PUBLIC_KEY_LENGTH];
    let raw_public_key_vector = base64::decode(&public_key_base64).unwrap();
    let raw_public_key_bytes = &raw_public_key_vector[..raw_public_key_buffer.len()];
    raw_public_key_buffer.copy_from_slice(raw_public_key_bytes);
    let decoded_public_key = PublicKey::from_bytes(&raw_public_key_buffer).unwrap();
    decoded_public_key
}

fn decode_signature_base64(signature_base64: String) -> Signature {
    let mut raw_signature_buffer = [0; SIGNATURE_LENGTH];
    let raw_signature_vector = base64::decode(&signature_base64).unwrap();
    let raw_signature_bytes = &raw_signature_vector[..raw_signature_buffer.len()];
    raw_signature_buffer.copy_from_slice(raw_signature_bytes);
    let decoded_signature = Signature::new(raw_signature_buffer);
    decoded_signature
}

fn get_key() -> String {
    let key = "PUBLIC_KEY";
    match env::var(key) {
        Ok(val) => return val,
        Err(_) => {
            let mut csprng = OsRng {};
            let keypair: Keypair = Keypair::generate(&mut csprng);
            std::println!("A new keypair for communication between Core and UI was generated");

            let new_conf = json!({
                "keys": {
                    "private": base64::encode(keypair.secret.to_bytes()),
                    "public": base64::encode(keypair.public.to_bytes())
                },
            });
            std::println!("Please import the following text into your dashboard to take control of this WirtBot");
            std::println!("{}", base64::encode(new_conf.to_string()));
            return base64::encode(keypair.public.to_bytes());
        }
    }
}

fn ok() -> impl Filter<Extract = (String,), Error = warp::Rejection> + Copy {
    warp::get().and(warp::path!("ok").map(|| format!("OK")))
}

fn write_config_file(config: String) -> IOResult<()> {
    let file_name: String = env::var("CONFIG_PATH").unwrap_or("/etc/wireguard/server.conf".into());

    match OpenOptions::new()
        .read(true)
        .write(true)
        .truncate(true)
        .create(true)
        .open(file_name)
    {
        Ok(mut file) => {
            file.write_all(config.as_bytes())?;
            return Ok(());
        }
        Err(e) => {
            return Err(e);
        }
    }
}

fn update(
    public_key: PublicKey,
) -> impl Filter<Extract = (String,), Error = warp::Rejection> + Copy {
    warp::post()
        .and(warp::path("update"))
        .and(warp::body::json())
        .and(warp::any().map(move || public_key.clone()))
        .and_then(|message: Message, public_key: PublicKey| async move {
            let signature = decode_signature_base64(message.signature);
            let message_as_bytes = message.message.as_bytes();
            let mut prehashed: Sha512 = Sha512::default();
            prehashed.update(message_as_bytes);
            if public_key
                .verify_prehashed(prehashed, Some(b"wirtbot"), &signature)
                .is_ok()
            {
                Ok(message.message)
            } else {
                Err(reject::custom(IncorrectSignature))
            }
        })
        .and_then(|config: String| async {
            match write_config_file(config) {
                Ok(_) => return Ok(()),
                Err(e) => {
                    error!("Error when writing config file: {}", e);
                    return Err(reject::custom(FailWritingConfig));
                }
            };
        })
        .map(|_| format!("Config updated"))
}

fn update_device_dns_entries(
    public_key: PublicKey,
) -> impl Filter<Extract = (String,), Error = warp::Rejection> + Copy {
    warp::post()
        .and(warp::path("update-device-dns-entries"))
        .and(warp::body::json())
        // Drop out early if the MANAGED_DNS feature is not enabled
        .and_then(|message: Message| async move {
            if managed_dns::enabled() {
                Ok(message)
            } else {
                Err(reject::custom(FeatureDisabled))
            }
        })
        .and(warp::any().map(move || public_key.clone()))
        .and_then(|message: Message, public_key: PublicKey| async move {
            let signature = decode_signature_base64(message.signature);
            let message_as_bytes = message.message.as_bytes();
            let mut prehashed: Sha512 = Sha512::default();
            prehashed.update(message_as_bytes);
            if public_key
                .verify_prehashed(prehashed, Some(b"wirtbot"), &signature)
                .is_ok()
            {
                Ok(message.message)
            } else {
                Err(reject::custom(IncorrectSignature))
            }
        })
        .and_then(|device_list: String| async {
            match managed_dns::write_device_file(device_list) {
                Ok(_) => return Ok(()),
                Err(e) => {
                    error!("{}", e);
                    return Err(reject::custom(FailWritingConfig));
                }
            }
        })
        .map(|_| {
            format!(
                "Updated {} with new devices",
                managed_dns::get_device_file_path()
            )
        })
}

#[tokio::main]
async fn main() {
    // Setup server
    pretty_env_logger::init();
    let log = warp::log("wirt::api");
    let public_key_base64 = get_key();
    info!("Loaded public key: {}", public_key_base64);
    let public_key = decode_public_key_base64(public_key_base64);
    std::println!("{:?}", public_key);

    let allowed_origin: String =
        env::var("ALLOWED_ORIGIN").unwrap_or("http://wirtbot.wirt.internal".into());
    let cors = warp::cors()
        .allow_origin(&allowed_origin[..])
        .allow_methods(vec!["POST"])
        .allow_header("content-type");

    let update_options = warp::options().and(warp::path("update")).map(warp::reply);
    let update_dns_options = warp::options()
        .and(warp::path("update-device-dns-entries"))
        .map(warp::reply);

    let routes = ok()
        .or(update(public_key))
        .or(update_options)
        .or(update_device_dns_entries(public_key))
        .or(update_dns_options)
        .with(log)
        .with(cors)
        .recover(handle_rejection);

    let port: String = env::var("PORT").unwrap_or("3030".into());
    let port: u16 = port.parse().unwrap();
    let host: Vec<u8> = env::var("HOST")
        .unwrap_or("0.0.0.0".into())
        .split(".")
        .collect::<Vec<&str>>()
        .iter()
        .map(|value| value.to_string())
        .map(|value| value.parse().expect("Invalid Hostname specified"))
        .collect();

    let host: [u8; 4] = [host[0], host[1], host[2], host[3]];

    match env::var("SSL_PEM_CERT") {
        Ok(cert_path) => match env::var("SSL_KEY") {
            Ok(key_path) => {
                info! {"Running server in HTTPS mode with certificate: {} and key: {}", cert_path, key_path};
                warp::serve(routes)
                    .tls()
                    .cert_path(cert_path)
                    .key_path(key_path)
                    .run((host, port))
                    .await
            }
            Err(e) => {
                info! {"Running server in HTTP mode"};
                warp::serve(routes).run((host, port)).await
            }
        },

        Err(e) => {
            info! {"Running server in HTTP mode"};
            warp::serve(routes).run((host, port)).await
        }
    }
}

#[tokio::test]
async fn test_ok() {
    let filter = ok();

    let response = warp::test::request().path("/ok").reply(&filter).await;
    assert_eq!(response.body(), "OK");
}
