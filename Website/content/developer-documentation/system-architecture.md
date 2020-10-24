# System Architecture

## Tight security

- All public network interfaces block traffic
- All traffic has to be signed/encrypted

## Interface <-> WirtBot communication

All endpoints verify the payload by its signature.
The Interface must sign them, while the WirtBot uses the **public key** it was started with to verify the signature.

If the WirtBot sends out any data then it will be encrypted with the **public key**. The interface can then decrypt the data.

## Reloading WireGuard on updates

- `wireguard-restarter.sh` uses `inotify-tools` to reload the WireGuard interface `server` whenever `/etc/wireguard/server.conf` is changed
- `systemd` is used to manage the `wireguard-restarter.sh` script

## DNS

[CoreDNS](https://coredns.io/) provides all the DNS capabilites.

Whenever its Corefile config is changed by the WirtBot API it will reload this config automatically after 10 seconds.

### Additional DNS servers

Additional DNS servers can be added to a device to provide name resolution for domains such as other local/internal networks.

#### Flow
- Device asks WirtBot to resolve DNS
- Any requests for `lan local home fritz.box` are ignored
- Other requests are forwarded to `1.1.1.1`
- The device will ask its additional DNS servers for any requests that the WirtBot does not provide an answer for