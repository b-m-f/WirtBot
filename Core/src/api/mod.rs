use super::crypto;
use super::filesystem::managed_dns;
use super::filesystem::wireguard_config;
use ed25519_dalek::{Digest, PublicKey, Sha512};
use serde::{Deserialize, Serialize};
use std::convert::Infallible;
use std::env;
use std::error::Error;
use warp::http::StatusCode;
use warp::{reject, Filter, Rejection, Reply};

const SSL_PEM_CERT: &str = "SSL_PEM_CERT";
const SSL_KEY: &str = "SSL_KEY";
const PORT: &str = "PORT";
const DEFAULT_PORT: &str = "3030";
const HOST: &str = "HOST";
const DEFAULT_HOST: &str = "0.0.0.0";
const ALLOWED_ORIGIN: &str = "ALLOWED_ORIGIN";

#[derive(Debug)]
struct IncorrectSignature;
impl reject::Reject for IncorrectSignature {}

#[derive(Debug)]
struct FailWritingConfig;
impl reject::Reject for FailWritingConfig {}

#[derive(Debug)]
struct FeatureDisabled;
impl reject::Reject for FeatureDisabled {}

#[derive(Deserialize, Serialize)]
struct Message {
    message: String,
    signature: String,
}

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
    } else if let Some(_) = err.find::<warp::filters::body::BodyDeserializeError>() {
        code = StatusCode::BAD_REQUEST;
        message = "Wrong Payload sent";
    } else if let Some(_) = err.find::<warp::reject::MethodNotAllowed>() {
        code = StatusCode::METHOD_NOT_ALLOWED;
        message = "CORS Error";
    } else {
        // We should have expected this... Just log and say its a 500
        error!("Unhandled rejection: {:?}", err);
        code = StatusCode::INTERNAL_SERVER_ERROR;
        message = "UNHANDLED_REJECTION";
    }
    info!("{}", message);

    std::println!("{:?}", err);

    let json = warp::reply::json(&ErrorMessage {
        code: code.as_u16(),
        message: message.into(),
    });
    Ok(warp::reply::with_status(json, code))
}

fn verify_signature(message: Message, public_key: PublicKey) -> Result<String, warp::Rejection> {
    let signature = match crypto::decode_signature_base64(message.signature) {
        Ok(sig) => sig,
        Err(e) => return Err(reject::custom(IncorrectSignature)),
    };
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
}

fn update(
    public_key: PublicKey,
) -> impl Filter<Extract = (String,), Error = warp::Rejection> + Copy {
    warp::post()
        .and(warp::path("update"))
        .and(warp::body::json())
        .and(warp::any().map(move || public_key.clone()))
        .and_then(|message: Message, public_key: PublicKey| async move {
            return verify_signature(message, public_key);
        })
        .and_then(|config: String| async {
            match wireguard_config::write_config_file(config) {
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
            return verify_signature(message, public_key);
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

fn routes(
    public_key: PublicKey,
) -> impl warp::Filter<Extract = impl warp::Reply, Error = std::convert::Infallible> + Clone {
    let log = warp::log("wirt::api");
    let allowed_origin: String = match env::var(ALLOWED_ORIGIN) {
        Ok(env) => env,
        Err(_) => panic!("Environment variable {} not specified", ALLOWED_ORIGIN),
    };
    let cors = warp::cors()
        .allow_origin(&allowed_origin[..])
        .allow_methods(vec!["POST"])
        .allow_header("content-type");

    let update_options = warp::options().and(warp::path("update")).map(warp::reply);
    let update_dns_options = warp::options()
        .and(warp::path("update-device-dns-entries"))
        .map(warp::reply);

    return update(public_key)
        .or(update_options)
        .or(update_device_dns_entries(public_key))
        .or(update_dns_options)
        .with(log)
        .with(cors)
        .recover(handle_rejection);
}

pub async fn start_api() {
    let public_key_base64 = crypto::get_key();
    info!("Loaded public key: {}", public_key_base64);
    let public_key = match crypto::decode_public_key_base64(public_key_base64) {
        Ok(key) => key,
        Err(e) => panic!(e),
    };

    let port: String = env::var(PORT).unwrap_or(DEFAULT_PORT.into());
    let port: u16 = match port.parse() {
        Ok(port) => port,
        Err(e) => panic!(e),
    };
    let host: Vec<u8> = env::var(HOST)
        .unwrap_or(DEFAULT_HOST.into())
        .split(".")
        .collect::<Vec<&str>>()
        .iter()
        .map(|value| value.to_string())
        .map(|value| value.parse().expect("Invalid Hostname specified"))
        .collect();

    let routes = routes(public_key);

    let host: [u8; 4] = [host[0], host[1], host[2], host[3]];

    match env::var(SSL_PEM_CERT) {
        Ok(cert_path) => match env::var(SSL_KEY) {
            Ok(key_path) => {
                info! {"Running server in HTTPS mode with certificate: {} and key: {}", cert_path, key_path};
                warp::serve(routes)
                    .tls()
                    .cert_path(cert_path)
                    .key_path(key_path)
                    .run((host, port))
                    .await
            }
            Err(_e) => {
                info! {"Running server in HTTP mode"};
                warp::serve(routes).run((host, port)).await
            }
        },

        Err(_e) => {
            info! {"Running server in HTTP mode"};
            warp::serve(routes).run((host, port)).await
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use ed25519_dalek::Keypair;
    use ed25519_dalek::Signature;
    use ed25519_dalek::Signer;
    use rand::rngs::OsRng;
    use serde_json::json;

    #[tokio::test]
    async fn test_failures() {
        let mut csprng = OsRng {};
        let keypair: Keypair = Keypair::generate(&mut csprng);
        env::set_var(ALLOWED_ORIGIN, "http://test");

        let filter = routes(keypair.public);
        let response = warp::test::request().path("/update").reply(&filter).await;
        assert_eq!(response.status(), 405);
        assert_eq!(response.body(), "{\"code\":405,\"message\":\"CORS Error\"}");
        let response = warp::test::request()
            .method("POST")
            .path("/update")
            .reply(&filter)
            .await;
        assert_eq!(response.status(), 400);
        assert_eq!(
            response.body(),
            "{\"code\":400,\"message\":\"Wrong Payload sent\"}"
        );
    }
    #[tokio::test]
    async fn test_wrong_signature_fails() {
        let mut csprng = OsRng {};
        let keypair: Keypair = Keypair::generate(&mut csprng);
        env::set_var(ALLOWED_ORIGIN, "http://test");

        let filter = routes(keypair.public);
        let msg = "message";

        let message = Message {
            message: msg.to_string(),
            signature: "test".into(),
        };

        let payload = json!(message);
        std::println!("{:?}", payload.to_string());
        let response = warp::test::request()
            .method("POST")
            .body(payload.to_string())
            .path("/update")
            .reply(&filter)
            .await;

        assert_eq!(response.status(), 401);
        assert_eq!(
            response.body(),
            "{\"code\":401,\"message\":\"Not authorized to update configuration\"}"
        );
    }
    #[tokio::test]
    async fn test_correct_update() {
        let mut csprng = OsRng {};
        let keypair: Keypair = Keypair::generate(&mut csprng);
        env::set_var(ALLOWED_ORIGIN, "http://test");

        let filter = routes(keypair.public);
        let msg = "message";
        let mut prehashed: Sha512 = Sha512::default();
        prehashed.update(msg.as_bytes());

        let signature = keypair
            .sign_prehashed(prehashed, Some(b"wirtbot"))
            .unwrap()
            .to_bytes()
            .to_vec();

        let message = Message {
            message: msg.to_string(),
            signature: base64::encode(signature),
        };

        let payload = json!(message);
        let response = warp::test::request()
            .method("POST")
            .body(payload.to_string())
            .path("/update")
            .reply(&filter)
            .await;

        assert_eq!(response.status(), 200);
        assert_eq!(response.body(), "Config updated");
    }
}
