use base64::{decode, encode};
use ed25519_dalek::{Keypair, PublicKey, Signature, PUBLIC_KEY_LENGTH, SIGNATURE_LENGTH};
use rand::rngs::OsRng;
use serde_json::json;
use std::env;
use std::fmt;

const PUBLIC_KEY: &str = "PUBLIC_KEY";

/// Errors that can occur while decoding.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum DecodeError {
    NotAPublicKey(String),
    NotASignature(String),
}

impl fmt::Display for DecodeError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match &*self {
            DecodeError::NotAPublicKey(string) => {
                write!(f, "{}", string)
            }
            DecodeError::NotASignature(string) => {
                write!(f, "{}", string)
            }
        }
    }
}

pub fn decode_public_key_base64(public_key_base64: String) -> Result<PublicKey, DecodeError> {
    let mut raw_public_key_buffer = [0; PUBLIC_KEY_LENGTH];
    let raw_public_key_vector = match decode(&public_key_base64) {
        Ok(vec) => vec,
        Err(_) => {
            return Err(DecodeError::NotAPublicKey(
                "Data provided was not a base64 encoded public key".into(),
            ))
        }
    };
    let raw_public_key_bytes = &raw_public_key_vector[..raw_public_key_buffer.len()];
    raw_public_key_buffer.copy_from_slice(raw_public_key_bytes);
    match PublicKey::from_bytes(&raw_public_key_buffer) {
        Ok(key) => Ok(key),
        Err(_) => Err(DecodeError::NotAPublicKey(
            "Data provided was not a base64 encoded public key".into(),
        )),
    }
}

pub fn decode_signature_base64(signature_base64: String) -> Result<Signature, DecodeError> {
    let mut raw_signature_buffer = [0; SIGNATURE_LENGTH];
    let raw_signature_vector = match decode(&signature_base64) {
        Ok(vec) => vec,
        Err(_) => {
            return Err(DecodeError::NotASignature(
                "Data provided was not a base64 encoded signature".into(),
            ))
        }
    };
    if raw_signature_vector.len() != SIGNATURE_LENGTH {
        return Err(DecodeError::NotASignature(
            "Data provided was not a base64 encoded signature".into(),
        ));
    }
    let raw_signature_bytes = &raw_signature_vector[..raw_signature_buffer.len()];
    raw_signature_buffer.copy_from_slice(raw_signature_bytes);
    let decoded_signature = Signature::new(raw_signature_buffer);
    Ok(decoded_signature)
}

pub fn get_key() -> String {
    match env::var(PUBLIC_KEY) {
        Ok(val) => return val,
        Err(_) => {
            let mut csprng = OsRng {};
            let keypair: Keypair = Keypair::generate(&mut csprng);
            std::println!("A new keypair for communication between Core and UI was generated");

            let new_conf = json!({
                "keys": {
                    "private": encode(keypair.secret.to_bytes()),
                    "public": encode(keypair.public.to_bytes())
                },
            });
            std::println!("Please import the following text into your dashboard to take control of this WirtBot");
            std::println!("{}", encode(new_conf.to_string()));
            return encode(keypair.public.to_bytes());
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    use ed25519_dalek::Signer;
    use std::any::type_name;

    fn type_of<T>(_: T) -> &'static str {
        type_name::<T>()
    }

    #[test]
    fn get_key_from_env_and_without_env_and_decoding() {
        // These cant be seperate tests, as they both manipulate the environment
        env::set_var(PUBLIC_KEY, "test");
        assert_eq!(get_key(), "test");
        env::remove_var(PUBLIC_KEY);
        let key = get_key();
        let bytes = decode(&key).unwrap();
        assert_eq!(bytes.len(), PUBLIC_KEY_LENGTH);
        PublicKey::from_bytes(&bytes).unwrap();
        let key = get_key();
        let pubkey = decode_public_key_base64(key).unwrap();
        assert_eq!(type_of(pubkey), "ed25519_dalek::public::PublicKey");
    }

    #[test]
    fn test_write_devices_replaces_previous_content() {
        let mut csprng = OsRng {};
        let keypair: Keypair = Keypair::generate(&mut csprng);
        let message: &[u8] = b"test";
        let signature: Signature = keypair.sign(message);
        let encoded_signature = encode(signature);
        let decoded_signature = decode_signature_base64(encoded_signature).unwrap();
        assert_eq!(decoded_signature, signature);
    }
}
