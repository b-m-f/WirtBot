import { sign } from "../lib/cryptography";

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

// async function get(endpoint) {
//   const response = await fetch(BASE_URL + endpoint);
//   if (response.status >= 400 && response.status < 600) {
//     throw new Error(`${response.status}: ${await response.text()}`);
//   }
//   return await response.json();
// }

// async function patch(endpoint, data) {
//   const response = await fetch(BASE_URL + endpoint, {
//     method: "PATCH",
//     mode: "cors",
//     cache: "no-cache",
//     credentials: "same-origin",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     referrer: "no-referrer",
//     body: JSON.stringify(data)
//   });
//   if (response.status >= 400 && response.status < 600) {
//     throw new Error(`${response.status}: ${await response.text()}`);
//   }
//   return await response.json();
// }
// async function del(endpoint, data) {
//   const response = await fetch(BASE_URL + endpoint, {
//     method: "DELETE",
//     mode: "cors",
//     cache: "no-cache",
//     credentials: "same-origin",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     referrer: "no-referrer",
//     body: JSON.stringify(data)
//   });
//   if (response.status >= 400 && response.status < 600) {
//     throw new Error(`${response.status}: ${await response.text()}`);
//   }
//   return await response.json();
// }

export async function updateServerConfig(config, host) {
  try {
    const messageWithSignature = await sign(config);
    await post(`https://${host}:3030/update`, messageWithSignature);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
