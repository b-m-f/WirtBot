extern crate ed25519_dalek;
extern crate rand;

use base64::{decode, encode};
use ed25519_dalek::{
    Digest, ExpandedSecretKey, Keypair, PublicKey, SecretKey, Sha512, PUBLIC_KEY_LENGTH,
    SECRET_KEY_LENGTH,
};
use rand::rngs::OsRng;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use x25519_dalek::PublicKey as x25519_PublicKey;
use x25519_dalek::StaticSecret;

#[wasm_bindgen]
pub fn generate_key_pair() -> String {
    #[derive(Serialize)]
    struct Pair {
        public_key: String,
        private_key: String,
    }
    let mut csprng: OsRng = OsRng {};
    let secret_raw = StaticSecret::new(&mut csprng);
    let public_raw = x25519_PublicKey::from(&secret_raw);

    // length defined here: https://docs.rs/x25519-dalek/0.6.0/x25519_dalek/struct.PublicKey.html
    let pub_key: &[u8; 32] = public_raw.as_bytes();
    // length defined here: https://docs.rs/x25519-dalek/0.6.0/x25519_dalek/struct.StaticSecret.html
    let priv_key: [u8; 32] = secret_raw.to_bytes();

    // WireGuard keys are base64 encoded
    //  17.3.2020 from https://github.com/WireGuard/wireguard-tools/blob/master/src/encoding.c
    let pub_key_string = base64::encode(pub_key);
    let priv_key_string = base64::encode(priv_key);

    let pair = Pair {
        public_key: pub_key_string,
        private_key: priv_key_string,
    };
    serde_json::to_string(&pair).unwrap()
}

#[wasm_bindgen]
pub fn generate_signature_keys() -> String {
    let mut csprng = OsRng {};
    let keypair: Keypair = Keypair::generate(&mut csprng);
    let public_key = keypair.public;
    let private_key = keypair.secret;
    let raw_public_key = public_key.to_bytes();
    let raw_private_key = private_key.to_bytes();

    #[derive(Serialize)]
    struct Pair {
        private_key: String,
        public_key: String,
    }
    let pair = Pair {
        private_key: base64::encode(raw_private_key),
        public_key: base64::encode(raw_public_key),
    };
    return serde_json::to_string(&pair).unwrap();
}

// returns the signature for a message encoded in base64
#[wasm_bindgen]
pub fn sign_message(keypair: String, message: String) -> String {
    #[derive(Deserialize)]
    struct Pair {
        private: String,
        public: String,
    }
    // Keys are in Base64. See above.
    // Base64 decode will return a vector that we need to put back into a bounded array
    // of size SECRET_KEY_LENGTH/PUBLIC_KEY_LENGTH
    // Since we created the keys we know that this will work.
    let pair: Pair = serde_json::from_str(&keypair).unwrap();

    let mut raw_private_key_buffer = [0; SECRET_KEY_LENGTH];
    let raw_private_key_vector = base64::decode(&pair.private).unwrap();
    let raw_private_key_bytes = &raw_private_key_vector[..raw_private_key_buffer.len()];
    raw_private_key_buffer.copy_from_slice(raw_private_key_bytes);
    let decoded_private_key = SecretKey::from_bytes(&raw_private_key_buffer).unwrap();

    let mut raw_public_key_buffer = [0; PUBLIC_KEY_LENGTH];
    let raw_public_key_vector = base64::decode(&pair.public).unwrap();
    let raw_public_key_bytes = &raw_public_key_vector[..raw_public_key_buffer.len()];
    raw_public_key_buffer.copy_from_slice(raw_public_key_bytes);
    let decoded_public_key = PublicKey::from_bytes(&raw_public_key_buffer).unwrap();

    let expanded_private_key = ExpandedSecretKey::from(&decoded_private_key);

    let mut prehashed: Sha512 = Sha512::default();
    prehashed.update(message);

    let signature = expanded_private_key
        .sign_prehashed(prehashed, &decoded_public_key, Some(b"wirtbot"))
        .unwrap();

    let signature_bytes = signature.to_bytes();

    let signature_base_64 = base64::encode(signature_bytes.to_vec());

    signature_base_64
}

#[cfg(test)]
mod test {
    extern crate serde;
    extern crate serde_json;
    extern crate wasm_bindgen_test;

    use super::*;
    use serde::{Deserialize, Serialize};
    use wasm_bindgen_test::*;

    wasm_bindgen_test_configure!(run_in_browser);

    #[wasm_bindgen_test]
    fn test_generate_key_pair() {
        #[derive(Serialize, Deserialize)]
        struct Pair {
            public_key: String,
            private_key: String,
        }
        let _key_pair: Pair = serde_json::from_str(&generate_key_pair()).unwrap();
        // TODO: figure out a way to test that both struct fields have values

        assert!(true)
    }
}
