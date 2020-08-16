import { generateDeviceConfig, generateServerConfig } from "./wireguard";

describe("WireGuard device generation", () => {
  it("works for simple IPv4 setup", () => {
    const server = {
      ip: { v4: [1, 1, 1, 1] },
      port: 11111,
      subnet: { v4: "10.10.10." },
      keys: { private: "test", public: "test" },
    };
    const device = { ip: { v4: 2 }, keys: { public: "test", private: "test" } };
    expect(generateDeviceConfig(device, server)).toBe(
      `[Interface]
Address = 10.10.10.2
PrivateKey = test
DNS = 10.10.10.1

[Peer]
Endpoint = 1.1.1.1:11111
AllowedIPs = 10.10.10.0/24
PublicKey = test

## keep connection alive behind NAT
PersistentKeepalive = 25`
    );
  });
  it("defaulting to IPv6 endpoint", () => {
    const server = {
      ip: { v4: [1, 1, 1, 1], v6: "FFFF:1010" },
      port: 11111,
      subnet: { v4: "10.10.10.", v6: "1010:1010:1010:1010:" },
      keys: { private: "test", public: "test" },
    };
    const device = { ip: { v4: 2 }, keys: { public: "test", private: "test" } };
    expect(generateDeviceConfig(device, server)).toBe(
      `[Interface]
Address = 10.10.10.2
PrivateKey = test
DNS = 10.10.10.1

[Peer]
Endpoint = [FFFF:1010]:11111
AllowedIPs = 10.10.10.0/24
PublicKey = test

## keep connection alive behind NAT
PersistentKeepalive = 25`
    );
  });
  it("works IP6 in tunnel, IPv4 endpoint", () => {
    const server = {
      ip: { v4: [1, 1, 1, 1] },
      port: 11111,
      subnet: { v6: "1010:1010:1010:1010:" },
      keys: { private: "test", public: "test" },
    };
    const device = {
      ip: { v6: "0002" },
      keys: { public: "test", private: "test" },
    };
    expect(generateDeviceConfig(device, server)).toBe(
      `[Interface]
Address = 1010:1010:1010:1010:0002
PrivateKey = test
DNS = 1010:1010:1010:1010:1

[Peer]
Endpoint = 1.1.1.1:11111
AllowedIPs = 1010:1010:1010:1010::/64
PublicKey = test

## keep connection alive behind NAT
PersistentKeepalive = 25`
    );
  });
  it("works for simple ipv6 setup", () => {
    const server = {
      ip: { v6: "FFFF:1010" },
      port: 11111,
      subnet: { v6: "1010:1010:1010:1010:" },
      keys: { private: "test", public: "test" },
    };
    const device = {
      ip: { v6: "0002" },
      keys: { public: "test", private: "test" },
    };
    expect(generateDeviceConfig(device, server)).toBe(
      `[Interface]
Address = 1010:1010:1010:1010:0002
PrivateKey = test
DNS = 1010:1010:1010:1010:1

[Peer]
Endpoint = [FFFF:1010]:11111
AllowedIPs = 1010:1010:1010:1010::/64
PublicKey = test

## keep connection alive behind NAT
PersistentKeepalive = 25`
    );
  });

  it("works for combined IPv4 IPv6", () => {
    const server = {
      ip: { v4: [1, 1, 1, 1], v6: "FFFF:1010" },
      port: 11111,
      subnet: { v4: "10.10.10.", v6: "1010:1010:1010:1010:" },
      keys: { private: "test", public: "test" },
    };
    const device = {
      ip: { v4: 2, v6: "0002" },
      keys: { public: "test", private: "test" },
    };
    expect(generateDeviceConfig(device, server)).toBe(
      `[Interface]
Address = 10.10.10.2, 1010:1010:1010:1010:0002
PrivateKey = test
DNS = 10.10.10.1

[Peer]
Endpoint = [FFFF:1010]:11111
AllowedIPs = 10.10.10.0/24, 1010:1010:1010:1010::/64
PublicKey = test

## keep connection alive behind NAT
PersistentKeepalive = 25`
    );
  });
});

describe("WireGuard server generation", () => {
  // Inspect the raw component options
  it("works for simple ipv4 setup", () => {
    const server = {
      ip: { v4: [1, 1, 1, 1] },
      port: 11111,
      subnet: { v4: "10.10.10.", v6: "1010:1010:1010:1010:" },
      keys: { private: "test", public: "test" },
    };
    const device = { ip: { v4: 2 }, keys: { public: "test", private: "test" } };
    expect(generateServerConfig(server, [device])).toBe(
      `[Interface]
Address = 10.10.10.1
ListenPort = 11111
PrivateKey = test

[Peer]
AllowedIPs = 10.10.10.2/32
PublicKey = test`
    );
  });
  it("works for simple ipv6 setup", () => {
    const server = {
      ip: { v6: "FFFF:1010" },
      port: 11111,
      subnet: { v6: "1010:1010:1010:1010:" },
      keys: { private: "test", public: "test" },
    };
    const device = {
      ip: { v6: "0002" },
      keys: { public: "test", private: "test" },
    };

    expect(generateServerConfig(server, [device])).toBe(
      `[Interface]
Address = 1010:1010:1010:1010:0001
ListenPort = 11111
PrivateKey = test

[Peer]
AllowedIPs = 1010:1010:1010:1010:0002::/128
PublicKey = test`
    );
  });

  it("works for combined ipv4 and ipv6 setup", () => {
    const server = {
      ip: { v4: [1, 1, 1, 1], v6: "FFFF:1010" },
      port: 11111,
      subnet: { v4: "10.10.10.", v6: "1010:1010:1010:1010:" },
      keys: { private: "test", public: "test" },
    };
    const device = {
      ip: { v4: 2, v6: "0002" },
      keys: { public: "test", private: "test" },
    };
    expect(generateServerConfig(server, [device])).toBe(
      `[Interface]
Address = 10.10.10.1, 1010:1010:1010:1010:0001
ListenPort = 11111
PrivateKey = test

[Peer]
AllowedIPs = 10.10.10.2/32, 1010:1010:1010:1010:0002::/128
PublicKey = test`
    );
  });
});

describe("WireGuard edge cases", () => {
  it("uses hostname if provided", () => {
    const server = {
      ip: { v4: [1, 1, 1, 1] },
      hostname: "test",
      port: 11111,
      subnet: { v4: "10.10.10." },
      keys: { private: "test", public: "test" },
    };
    const device = { ip: { v4: 2 }, keys: { public: "test", private: "test" } };
    expect(generateDeviceConfig(device, server)).toBe(
      `[Interface]
Address = 10.10.10.2
PrivateKey = test
DNS = 10.10.10.1

[Peer]
Endpoint = test:11111
AllowedIPs = 10.10.10.0/24
PublicKey = test

## keep connection alive behind NAT
PersistentKeepalive = 25`
    );
  });
});
