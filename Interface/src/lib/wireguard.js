export function generateDeviceConfig({ ip, keys, routed, additionalDNSServers, MTU }, server) {
  let allowedIps = "";
  if (routed) {
    allowedIps = "0.0.0.0/0, ::/0";
  } else {
    if (ip.v4) {
      allowedIps = `${server.subnet.v4}0/24`;
    }
    if (ip.v6) {
      if (ip.v4) {
        allowedIps = `${allowedIps}, `;
      }
      allowedIps = `${allowedIps}${server.subnet.v6}:/64`;
    }
  }
  if (
    !server.keys ||
    (!server.ip.v4 && !server.ip.v6) ||
    !server.port ||
    (!server.subnet.v4 && !server.subnet.v6)
  ) {
    throw new Error("No Server");
  }

  let endpoint;
  if (server.hostname) {
    endpoint = `${server.hostname}:${server.port}`;
  } else {
    if (server.ip.v6 || (server.ip.v6 && server.ip.v4)) {
      endpoint = `[${server.ip.v6}]:${server.port}`;
    } else {
      endpoint = `${server.ip.v4.join(".")}:${server.port}`;
    }
  }

  if (ip.v4 && !ip.v6) {
    return `[Interface]
Address = ${server.subnet.v4}${ip.v4}
PrivateKey = ${keys.private}
DNS = ${server.subnet.v4}1${additionalDNSServers ? `,${additionalDNSServers.join(',')}` : ``}
MTU = ${MTU || "1500"}

[Peer]
Endpoint = ${endpoint}
AllowedIPs = ${allowedIps}
PublicKey = ${server.keys.public}

## keep connection alive behind NAT
PersistentKeepalive = 25`;
  }
  if (!ip.v4 && ip.v6) {
    // TODO: is there a Bug here? What if additionalDNSServers are IPv4, or the server is IPv4.
    // The Wirt server IP should be checked to determine if DNS is IPv4 vs IPv6
    // Write tests first
    return `[Interface]
Address = ${server.subnet.v6}${ip.v6}
PrivateKey = ${keys.private}
DNS = ${server.subnet.v6}1${additionalDNSServers ? `,${additionalDNSServers.join(',')}` : ``}
MTU = ${MTU || "1500"}

[Peer]
Endpoint = ${endpoint}
AllowedIPs = ${allowedIps}
PublicKey = ${server.keys.public}

## keep connection alive behind NAT
PersistentKeepalive = 25`;
  }
  if (ip.v4 && ip.v6) {
    return `[Interface]
Address = ${server.subnet.v4}${ip.v4}, ${server.subnet.v6}${ip.v6}
PrivateKey = ${keys.private}
DNS = ${server.subnet.v4}1${additionalDNSServers ? `,${additionalDNSServers.join(',')}` : ``}
MTU = ${MTU || "1500"}

[Peer]
Endpoint = ${endpoint}
AllowedIPs = ${allowedIps}
PublicKey = ${server.keys.public}

## keep connection alive behind NAT
PersistentKeepalive = 25`;
  }
}

export function generateServerConfig({ port, keys, subnet }, devices) {
  let configs = "";
  let devicesNeedV4 = false;
  let devicesNeedV6 = false;

  for (let device of devices) {
    if (!devicesNeedV6 && device.ip.v6) {
      devicesNeedV6 = true;
    }
    if (!devicesNeedV4 && device.ip.v4) {
      devicesNeedV4 = true;
    }
    if (device.ip.v4 && !device.ip.v6) {
      configs = `${configs}
[Peer]
AllowedIPs = ${subnet.v4}${device.ip.v4}/32
PublicKey = ${device.keys.public}`;
    }
    if (!device.ip.v4 && device.ip.v6) {
      configs = `${configs}
[Peer]
AllowedIPs = ${subnet.v6}${device.ip.v6}::/128
PublicKey = ${device.keys.public}`;
    }
    if (device.ip.v4 && device.ip.v6) {
      configs = `${configs}
[Peer]
AllowedIPs = ${subnet.v4}${device.ip.v4}/32, ${subnet.v6}${device.ip.v6}::/128
PublicKey = ${device.keys.public}`;
    }
  }

  if (!devicesNeedV6 && !devicesNeedV4) {
    return `[Interface]
Address = ${subnet.v4}1
ListenPort = ${port}
PrivateKey = ${keys.private}`;
  }

  if (!devicesNeedV6 && devicesNeedV4) {
    return `[Interface]
Address = ${subnet.v4}1
ListenPort = ${port}
PrivateKey = ${keys.private}
${configs}`;
  }
  if (devicesNeedV6 && !devicesNeedV4) {
    return `[Interface]
Address = ${subnet.v6}0001
ListenPort = ${port}
PrivateKey = ${keys.private}
${configs}`;
  }
  if (devicesNeedV6 && devicesNeedV4) {
    return `[Interface]
Address = ${subnet.v4}1, ${subnet.v6}0001
ListenPort = ${port}
PrivateKey = ${keys.private}
${configs}`;
  }
}

export async function getKeys() {
  try {
    const wasm = import("../../wasm/pkg");
    const generateKeypair = (await wasm).generate_key_pair;
    const pair = JSON.parse(generateKeypair());
    return { private: pair.private_key, public: pair.public_key };
  } catch (error) {
    throw `WebAssembly key generation: ${error}`;
  }
}
