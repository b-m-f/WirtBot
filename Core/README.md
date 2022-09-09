# WirtBot

This is the WirtBot Core that is responsible for:

- listening to incomming requests from the Interface that come via HTTP/S
- automatically update the WireGuard configuration
- automatically update the CoreDNS configuration

in this order.

To guarantee that only the user who owns the WirtBot can update it, the Interface's public key has to be provided when running the WirtBot to verify payloads with the Interface's signature.

## Compilation

- Install rust and cargo with https://rustup.rs/
- `cargo build --release`

## Configuration options

The WirtBot is configured with environment variables:

### Optional

- **PUBLIC_KEY**: Public key of Interface. Will create a keypair if ommited
- **HOST**: the host address to listen on
- **PORT**: the port to listen on
- **CONFIG_PATH**: path to WireGuard configuration
- **MANAGED_DNS_DEVICE_FILE**: File to write DNS entries to
- **SSL_PEM_CERT_CORE**: SSL certificate for the API
- **SSL_KEY_CORE**: SSL private key for the API
- **SSL_PEM_CERT_INTERFACE**: SSL certificate for the interface
- **SSL_KEY_INTERFACE**: SSL private key for the interface

## Logging

To enable logging run the program with the wanted environment variable.
Check [env-logger](https://docs.rs/env_logger/0.7.1/env_logger/) for more information.

### Server logs

`RUST_LOG=wirt::api`. For example `RUST_LOG=wirt::api cargo run`

### Info logs

`RUST_LOG=info`
