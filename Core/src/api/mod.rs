use super::crypto;
use super::filesystem::managed_dns;
use super::filesystem::wireguard_config;
use ed25519_dalek::{Digest, PublicKey, Sha512};
use serde::{Deserialize, Serialize};
use std::convert::Infallible;
use std::env;
use warp::http::StatusCode;
use warp::{reject, Filter, Rejection, Reply};

const SSL_CORE: &str = "SSL_CORE";
const SSL_KEY_PATH: &str = "/core/private_key";
const SSL_CHAIN_PATH: &str = "/core/public_key";
const PORT: &str = "PORT";
const DEFAULT_PORT: &str = "3030";
const HOST: &str = "HOST";
const DEFAULT_HOST: &str = "0.0.0.0";
const ALLOWED_ORIGIN: &str = "ALLOWED_ORIGIN";
const MANAGED_DNS_DEVICE_FILE_VAR: &str = "MANAGED_DNS_DEVICE_FILE";
// CoreDNS is the DNS server that is being used
const DEFAULT_DEVICES_FILE: &str = "/etc/coredns/Corefile";
const CONFIG_PATH: &str = "CONFIG_PATH";
const DEFAULT_CONFIG_PATH: &str = "/etc/wireguard/server.conf";

fn get_config_file_path() -> &'static str {
    let s = String::from(env::var(CONFIG_PATH).unwrap_or(DEFAULT_CONFIG_PATH.into()));
    Box::leak(s.into_boxed_str())
}

fn get_dns_file_path() -> &'static str {
    let s =
        String::from(env::var(MANAGED_DNS_DEVICE_FILE_VAR).unwrap_or(DEFAULT_DEVICES_FILE.into()));
    Box::leak(s.into_boxed_str())
}

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
    info!("{}: {}", code, message);

    let json = warp::reply::json(&ErrorMessage {
        code: code.as_u16(),
        message: message.into(),
    });
    Ok(warp::reply::with_status(json, code))
}

fn verify_signature(message: Message, public_key: PublicKey) -> Result<String, warp::Rejection> {
    let signature = match crypto::decode_signature_base64(message.signature) {
        Ok(sig) => sig,
        Err(_) => return Err(reject::custom(IncorrectSignature)),
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
    config_path: &'static str,
) -> impl Filter<Extract = (String,), Error = warp::Rejection> + Copy {
    warp::post()
        .and(warp::path("update"))
        .and(warp::body::json())
        .and(warp::any().map(move || public_key.clone()))
        .and_then(|message: Message, public_key: PublicKey| async move {
            return verify_signature(message, public_key);
        })
        .and_then(move |config: String| async move {
            std::println!("{}", config);
            match wireguard_config::write_config_file(config, config_path.to_string()) {
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
    dns_path: &'static str,
) -> impl Filter<Extract = (String,), Error = warp::Rejection> + Copy {
    warp::post()
        .and(warp::path("update-device-dns-entries"))
        .and(warp::body::json())
        // Drop out early if the MANAGED_DNS feature is not enabled
        .and(warp::any().map(move || public_key.clone()))
        .and_then(|message: Message, public_key: PublicKey| async move {
            return verify_signature(message, public_key);
        })
        .and_then(move |device_list: String| async move {
            match managed_dns::write_device_file(device_list, dns_path.to_string()) {
                Ok(_) => return Ok(()),
                Err(e) => {
                    error!("{}", e);
                    return Err(reject::custom(FailWritingConfig));
                }
            }
        })
        .map(move |_| format!("Config updated"))
}

fn routes(
    public_key: PublicKey,
    allowed_origin: &String,
    config_path: &'static str,
    dns_path: &'static str,
) -> impl warp::Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    let log = warp::log("wirt::api");
    let cors = warp::cors()
        .allow_origin(&allowed_origin[..])
        .allow_methods(vec!["POST"])
        .allow_header("content-type");

    let update_options = warp::options().and(warp::path("update")).map(warp::reply);
    let update_dns_options = warp::options()
        .and(warp::path("update-device-dns-entries"))
        .map(warp::reply);

    return update(public_key, config_path)
        .or(update_options)
        .or(update_device_dns_entries(public_key, dns_path))
        .or(update_dns_options)
        .with(log)
        .recover(handle_rejection)
        .with(cors);
}

pub async fn start_api() {
    let public_key_base64 = crypto::get_key();
    info!("Loaded public key: {}", public_key_base64);
    let public_key = match crypto::decode_public_key_base64(public_key_base64) {
        Ok(key) => key,
        Err(e) => panic!("{}", e),
    };

    let port: String = env::var(PORT).unwrap_or(DEFAULT_PORT.into());
    let port: u16 = match port.parse() {
        Ok(port) => port,
        Err(e) => panic!("{}", e),
    };
    let host: Vec<u8> = env::var(HOST)
        .unwrap_or(DEFAULT_HOST.into())
        .split(".")
        .collect::<Vec<&str>>()
        .iter()
        .map(|value| value.to_string())
        .map(|value| value.parse().expect("Invalid Hostname specified"))
        .collect();
    let allowed_origin: String = match env::var(ALLOWED_ORIGIN) {
        Ok(env) => env,
        Err(_) => panic!("Environment variable {} not specified", ALLOWED_ORIGIN),
    };

    let config_path = get_config_file_path();
    let dns_path = get_dns_file_path();

    let routes = routes(public_key, &allowed_origin, config_path, dns_path);

    let host: [u8; 4] = [host[0], host[1], host[2], host[3]];

    match env::var(SSL_CORE) {
            Ok(_) => {
                info! {"Running server in HTTPS mode with certificate: {} and key: {}", cert_path, key_path};
                warp::serve(routes)
                    .tls()
                    .cert_path(SSL_CHAIN_PATH)
                    .key_path(SSL_KEY_PATH)
                    .run((host, port))
                    .await;
            }
            Err(_e) => {
                info! {"Running server in HTTP mode"};
                warp::serve(routes).run((host, port)).await;
            }
        },

        Err(_e) => {
            info! {"Running server in HTTP mode"};
            warp::serve(routes).run((host, port)).await;
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use ed25519_dalek::Keypair;
    use rand::rngs::OsRng;
    use serde_json::json;

    #[tokio::test]
    async fn test_failures() {
        let mut csprng = OsRng {};
        let keypair: Keypair = Keypair::generate(&mut csprng);
        let allowed_origin = "http://test";

        let filter = routes(keypair.public, &allowed_origin.into(), "", "");
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
    async fn test_update_wrong_signature_fails() {
        let mut csprng = OsRng {};
        let keypair: Keypair = Keypair::generate(&mut csprng);
        let allowed_origin = "http://test";

        let filter = routes(keypair.public, &allowed_origin.into(), "", "");
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
        let allowed_origin = "http://test";
        let config_path = "./test-config";

        let filter = routes(keypair.public, &allowed_origin.into(), config_path, "");

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
        std::fs::remove_file(config_path).unwrap();
    }
    #[tokio::test]
    async fn test_dns_wrong_signature_fails() {
        let mut csprng = OsRng {};
        let keypair: Keypair = Keypair::generate(&mut csprng);
        let allowed_origin = "http://test";

        let filter = routes(keypair.public, &allowed_origin.into(), "", "");
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
            .path("/update-device-dns-entries")
            .reply(&filter)
            .await;

        assert_eq!(response.status(), 401);
        assert_eq!(
            response.body(),
            "{\"code\":401,\"message\":\"Not authorized to update configuration\"}"
        );
    }
    #[tokio::test]
    async fn test_dns_correct_update() {
        let mut csprng = OsRng {};
        let keypair: Keypair = Keypair::generate(&mut csprng);
        let allowed_origin = "http://test";
        let dns_path = "./test-config-dns";

        let filter = routes(keypair.public, &allowed_origin.into(), "", dns_path);

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
            .path("/update-device-dns-entries")
            .reply(&filter)
            .await;

        assert_eq!(response.status(), 200);
        assert_eq!(response.body(), "Config updated");
        std::fs::remove_file(dns_path).unwrap();
    }
}
