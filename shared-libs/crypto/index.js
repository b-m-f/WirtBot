
export async function generateSigningKeys() {
  try {
    const wasm = import("@wirtbot/rust-wasm");
    const generateKeypair = (await wasm).generate_signature_keys;
    const pair = JSON.parse(generateKeypair());
    return { private: pair.private_key, public: pair.public_key };
  } catch (error) {
    console.error(error);
    throw `WebAssembly key generation: ${error}`;
  }
}

export async function sign(message, keys) {
  try {
    const wasm = import("@wirtbot/rust-wasm");
    const sign = (await wasm).sign_message;
    const signature = sign(JSON.stringify(keys), message);
    return { signature, message };
  } catch (error) {
    console.error(error);
    throw `Error when signing message: ${error}`;
  }
}

export async function getKeys() {
  try {
    const wasm = import("@wirtbot/rust-wasm");
    const generateKeypair = (await wasm).generate_key_pair;
    const pair = JSON.parse(generateKeypair());
    return { private: pair.private_key, public: pair.public_key };
  } catch (error) {
    throw `WebAssembly key generation: ${error}`;
  }
}
