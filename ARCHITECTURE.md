# Architecture

## Communication between Interface and Core

All communication is based on Public-Private key encryption.
Every payload from the Interface is signed with its private key.

The Core, which is started with the Interface`s public key will verify the signature on every incomming request.

If the signature is invalid the request is dropped.

## Container layout

The Container uses the [s6-overlay](https://github.com/just-containers/s6-overlay) to run all necessary processes.

This approach is chosen to encapsulate the functionality of the whole WirtBot into 1 container for ease of use.

Important binaries:

- wg-quick to spawn and update the WireGuard interface
- [coredns](https://github.com/coredns/coredns) compiled with the [ads](https://github.com/c-mueller/ads/) plugin for DNS and Ad-blocking
- WirtBot core as the API endpoint
- Interface served with NGINX

### Security Benefits

Once a machine is connected into the network, all services can be reached on the internal address `$SUBNET.1`, where the WirtBot is located.

This means that none of them need to be exposed to the internet except for the WireGuard port, once the initial setup is done.
