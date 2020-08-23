import store from "../store";
export async function generateSigningKeys() {
  try {
    const wasm = import("../../wasm/pkg");
    const generateKeypair = (await wasm).generate_signature_keys;
    const pair = JSON.parse(generateKeypair());
    return pair;
  } catch (error) {
    console.error(error);
    throw `WebAssembly key generation: ${error}`;
  }
}

export async function sign(message) {
  try {
    const wasm = import("../../wasm/pkg");
    const sign = (await wasm).sign_message;
    const keys = store.state.keys;
    const signature = sign(JSON.stringify(keys), message);
    return { signature, message };
  } catch (error) {
    console.error(error);
    throw `Error when signing message: ${error}`;
  }
}
