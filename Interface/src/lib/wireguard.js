import { expandIPv6 } from "./ipUtil";

export function generateDeviceConfig(
  { ip, keys, routed, additionalDNSServers, MTU },
  server
) {
  const subnetv6 = expandIPv6(server.subnet.v6);

  let allowedIps = "";
  if (routed) {
    allowedIps = "0.0.0.0/0,0001:0000:0000:0000:0000:0000:0000/0";
  } else {
    if (ip.v4) {
      allowedIps = `${server.subnet.v4}.0/24`;
    }
    if (ip.v6) {
      if (ip.v4) {
        allowedIps = `${allowedIps},`;
      }
      allowedIps = `${allowedIps}${subnetv6}/64`;
    }
  }
  if (
    !server.keys ||
    (!server.ip.v4 && !server.ip.v6) ||
    !server.port ||
    (!server.subnet.v4 && !subnetv6)
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
      endpoint = `${server.ip.v4}:${server.port}`;
    }
  }

  if (ip.v4 && !ip.v6) {
    return `[Interface]
Address = ${server.subnet.v4}.${ip.v4}
PrivateKey = ${keys.private}
DNS = ${server.subnet.v4}.1${
      additionalDNSServers ? `,${additionalDNSServers.join(",")}` : ``
    }
${
  MTU
    ? `MTU = ${MTU}
`
    : ``
}
[Peer]
Endpoint = ${endpoint}
AllowedIPs = ${allowedIps}
PublicKey = ${server.keys.public}

## keep connection alive behind NAT
PersistentKeepalive = 25`;
  }
  if (!ip.v4 && ip.v6) {
    return `[Interface]
Address = ${subnetv6}:${ip.v6}
PrivateKey = ${keys.private}
DNS = ${subnetv6}:0001${
      additionalDNSServers ? `,${additionalDNSServers.join(",")}` : ``
    }
${
  MTU
    ? `MTU = ${MTU}
`
    : ``
}
[Peer]
Endpoint = ${endpoint}
AllowedIPs = ${allowedIps}
PublicKey = ${server.keys.public}

## keep connection alive behind NAT
PersistentKeepalive = 25`;
  }
  if (ip.v4 && ip.v6) {
    return `[Interface]
Address = ${server.subnet.v4}.${ip.v4},${subnetv6}:${ip.v6}
PrivateKey = ${keys.private}
DNS = ${server.subnet.v4}.1${
      additionalDNSServers ? `,${additionalDNSServers.join(",")}` : ``
    }
${
  MTU
    ? `MTU = ${MTU}
`
    : ``
}
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

  const subnetv6 = expandIPv6(subnet.v6);

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
AllowedIPs = ${subnet.v4}.${device.ip.v4}/32
PublicKey = ${device.keys.public}`;
    }
    if (!device.ip.v4 && device.ip.v6) {
      configs = `${configs}
[Peer]
AllowedIPs = ${subnetv6}:${device.ip.v6}/128
PublicKey = ${device.keys.public}`;
    }
    if (device.ip.v4 && device.ip.v6) {
      configs = `${configs}
[Peer]
AllowedIPs = ${subnet.v4}.${device.ip.v4}/32,${subnetv6}:${device.ip.v6}/128
PublicKey = ${device.keys.public}`;
    }
  }

  if (!devicesNeedV6 && !devicesNeedV4) {
    return `[Interface]
Address = ${subnet.v4}.1
ListenPort = ${port}
PrivateKey = ${keys.private}`;
  }

  if (!devicesNeedV6 && devicesNeedV4) {
    return `[Interface]
Address = ${subnet.v4}.1
ListenPort = ${port}
PrivateKey = ${keys.private}
${configs}`;
  }
  if (devicesNeedV6 && !devicesNeedV4) {
    return `[Interface]
Address = ${subnetv6}:0001
ListenPort = ${port}
PrivateKey = ${keys.private}
${configs}`;
  }
  if (devicesNeedV6 && devicesNeedV4) {
    return `[Interface]
Address = ${subnet.v4}.1,${subnetv6}:0001
ListenPort = ${port}
PrivateKey = ${keys.private}
${configs}`;
  }
}
