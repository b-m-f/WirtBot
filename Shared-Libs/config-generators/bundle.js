'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// This function creates an RFC 1035 DNS master file
function generateDNSFile(server, clients, network) {
    const deviceNames = clients.map(client => {
        client.name = client.name.split(' ').join('-');
        if (!server.name) {
            server.name = "wirtbot";
        }

        if (client.ip.v6 && client.ip.v4) {
            return `${server.subnet.v4 + client.ip.v4} ${client.name}.${network.dns.name}
        ${server.subnet.v6 + client.ip.v6} ${client.name}.${network.dns.name}`
        }
        if (client.ip.v6 && !client.ip.v4) {
            return `${server.subnet.v6 + client.ip.v6} ${client.name}.${network.dns.name}`
        }
        if (!client.ip.v6 && client.ip.v4) {
            return `${server.subnet.v4 + client.ip.v4} ${client.name}.${network.dns.name}`
        }
    });
    const serverName = () => {
        if (server.subnet.v6 && server.subnet.v4) {
            return `${server.subnet.v4 + '1'} ${server.name}.${network.dns.name}
        ${server.subnet.v6 + '1'} ${server.name}.${network.dns.name}`
        }
        if (server.subnet.v6 && !server.subnet.v4) {
            return `${server.subnet.v6 + "1"} ${server.name}.${network.dns.name}`
        }
        if (!server.subnet.v6 && server.subnet.v4) {
            return `${server.subnet.v4 + "1"} ${server.name}.${network.dns.name}`
        }
    };
    // TODO: document local network names that are ignored here
    // Even better: Make the configurable via Settings
    const masterFile = `. {
    reload
    forward . tls://1.1.1.1 tls://1.0.0.1 {
       except ${network.dns.name} lan local home fritz.box
       tls_servername cloudflare-dns.com
       health_check 5s
    }
    cache 30
}
${network.dns.name} {
    hosts {
        ${serverName()}
        ${deviceNames.join("\n        ")}
    }
}`;
    return masterFile.trim();
}

function generateDeviceConfig({ ip, keys, routed, additionalDNSServers, MTU }, server) {
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
${MTU ? `MTU = ${MTU}
`: ``}
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
${MTU ? `MTU = ${MTU}
`: ``}
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
${MTU ? `MTU = ${MTU}
`: ``}
[Peer]
Endpoint = ${endpoint}
AllowedIPs = ${allowedIps}
PublicKey = ${server.keys.public}

## keep connection alive behind NAT
PersistentKeepalive = 25`;
  }
}

function generateServerConfig({ port, keys, subnet }, devices) {
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

exports.generateDNSFile = generateDNSFile;
exports.generateDeviceConfig = generateDeviceConfig;
exports.generateServerConfig = generateServerConfig;
