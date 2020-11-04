import { sign } from "@wirtbot/crypto";
import store from "../store";

// Loaded with https://cli.vuejs.org/guide/mode-and-env.html
// const BASE_URL = process.env.VUE_APP_BASE_URL + "/api";

// Check the MDN docs for more info on how the API is implemented:
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

async function post(endpoint, data) {
  const response = await fetch(endpoint, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    referrer: "no-referrer",
    body: JSON.stringify(data),
  });
  if (response.status >= 400 && response.status < 600) {
    throw new Error(`${response.status}: ${await response.text()}`);
  }
  return response;
}


export async function updateServerConfig(config, host) {
  try {
    let keys = store.state.keys;
    if (
      process.env.VUE_APP_PUBLIC_KEY &&
      process.env.VUE_APP_PRIVATE_KEY
    ) {
      keys.public = process.env.VUE_APP_PUBLIC_KEY;
      keys.private = process.env.VUE_APP_PRIVATE_KEY;
    }
    const messageWithSignature = await sign(config, keys);
    if (process.env.NODE_ENV === "development") {
      await post(`http://localhost:3030/update`, messageWithSignature);
    } else {
      await post(`http://${host}:3030/update`, messageWithSignature);
    }
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function updateDNSConfig(config, host) {
  try {
    let keys = store.state.keys;
    if (
      process.env.VUE_APP_PUBLIC_KEY &&
      process.env.VUE_APP_PRIVATE_KEY
    ) {
      keys.public = process.env.VUE_APP_PUBLIC_KEY;
      keys.private = process.env.VUE_APP_PRIVATE_KEY;
    }
    const messageWithSignature = await sign(config, keys);
    if (process.env.NODE_ENV === "development") {
      await post(`http://localhost:3030/update-device-dns-entries`, messageWithSignature);
    } else {
      await post(`http://${host}:3030/update-device-dns-entries`, messageWithSignature);
    }
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}