import { sign } from "../lib/crypto";
import store from "../store";
import i18n from "../i18n";

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
    const err = new Error("Error when talking to API");
    err.status = response.status;
    err.text = response.text;
    throw err;
  }
}

function handleError(e) {
  if (e.status === 401) {
    store.dispatch("alerts/addError", `${i18n.global.t("errors.signature")}`);
    return;
  }
  if (e.status === 405) {
    store.dispatch("alerts/addError", `${i18n.global.t("errors.cors")}`);
    return;
  }
  store.dispatch("alerts/addError", `${i18n.global.t("errors.updateFail")}`);
}

export async function updateServerConfig(config, host) {
  try {
    let keys = store.state.keys;
    if (process.env.VUE_APP_PUBLIC_KEY && process.env.VUE_APP_PRIVATE_KEY) {
      keys.public = process.env.VUE_APP_PUBLIC_KEY;
      keys.private = process.env.VUE_APP_PRIVATE_KEY;
    }
    const messageWithSignature = await sign(config, keys);
    if (location.protocol === 'https:') {
      await post(`https://${host}/update`, messageWithSignature);
    } else {
      await post(`http://${host}/update`, messageWithSignature);
    }
    store.dispatch(
      "alerts/addSuccess",
      `${i18n.global.t("success.updateSuccessConfig")}`
    );
  } catch (e) {
    handleError(e);
  }
}

export async function updateDNSConfig(config, host) {
  try {
    let keys = store.state.keys;
    if (process.env.VUE_APP_PUBLIC_KEY && process.env.VUE_APP_PRIVATE_KEY) {
      keys.public = process.env.VUE_APP_PUBLIC_KEY;
      keys.private = process.env.VUE_APP_PRIVATE_KEY;
    }
    const messageWithSignature = await sign(config, keys);
    if (location.protocol === 'https:') {
      await post(
        `https://${host}/update-device-dns-entries`,
        messageWithSignature
      );
    } else {
      await post(
        `http://${host}/update-device-dns-entries`,
        messageWithSignature
      );
    }
    store.dispatch(
      "alerts/addSuccess",
      `${i18n.global.t("success.updateSuccessDNS")}`
    );
  } catch (e) {
    handleError(e);
  }
}
