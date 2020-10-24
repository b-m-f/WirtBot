# WirtBot

## Prerequisites

- The server must support `systemd` to control processes.

## Installation

### Compilation

- Install rust and cargo with https://rustup.rs/
- `cargo build --release`


## Configuration options

The WirtBot is configured with environment variables:

- **PUBLIC_KEY**: Public key of Interface

### Optional

- **HOST**: the host address to listen on
- **PORT**: the port to listen on
- **CONFIG_PATH**: path to WireGuard configuration
- **MANAGED_DNS_ENABLED**: Enable endpoint to configure DNS
- **MANAGED_DNS_DEVICE_FILE**: File to write DNS entries to
- **SSL_PEM_CERT**: SSL certificate
- **SSL_KEY**: SSL private key for the certificate

## Logging

To enable logging run the program with the wanted environment variable.
Check [env-logger](https://docs.rs/env_logger/0.7.1/env_logger/) for more information.

### Server logs

`RUST_LOG=wirt::api`. For example `RUST_LOG=wirt::api cargo run`

### Info logs

`RUST_LOG=info`