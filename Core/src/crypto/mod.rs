use base64::{decode, encode};
use ed25519_dalek::{
     Keypair, PublicKey,  Signature, PUBLIC_KEY_LENGTH, SIGNATURE_LENGTH,
};
use rand::rngs::OsRng;
use std::env;
use serde_json::json;

const PUBLIC_KEY :&str = "PUBLIC_KEY";

pub fn decode_public_key_base64(public_key_base64: String) -> PublicKey {
    let mut raw_public_key_buffer = [0; PUBLIC_KEY_LENGTH];
    let raw_public_key_vector = decode(&public_key_base64).unwrap();
    let raw_public_key_bytes = &raw_public_key_vector[..raw_public_key_buffer.len()];
    raw_public_key_buffer.copy_from_slice(raw_public_key_bytes);
    let decoded_public_key = PublicKey::from_bytes(&raw_public_key_buffer).unwrap();
    decoded_public_key
}

pub fn decode_signature_base64(signature_base64: String) -> Signature {
    let mut raw_signature_buffer = [0; SIGNATURE_LENGTH];
    let raw_signature_vector = decode(&signature_base64).unwrap();
    let raw_signature_bytes = &raw_signature_vector[..raw_signature_buffer.len()];
    raw_signature_buffer.copy_from_slice(raw_signature_bytes);
    let decoded_signature = Signature::new(raw_signature_buffer);
    decoded_signature
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