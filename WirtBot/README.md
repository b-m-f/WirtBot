# WirtBot

This is the WirtBot who is responsible for:

- listening to incomming requests from a users Interface
- automatically update the WireGuard configuration with new values

in this order.

To guarantee that only the user who owns the WirtBot can update it, the Interface's public key has to be provided when running the WirtBot to verify payloads with the Interface's signature.

More info at https://wirt.network/docs/server

## Setup

### Prerequisites

Your server must support `systemd` to control processes.

### Installation

#### Compilation

- Install rust and cargo with https://rustup.rs/ or your preferred installation method.
- `cargo build --release`

### Using the WirtBot

- Place the `target/release/wirtbot` executable from your compilation, or a release from the [release page](https://github.com/b-m-f/wirt/releases) into `/usr/bin` or `/bin` on your server.
- Generate the public key from your [wirt](https://wirt.network/settings) webapp
- Create a new user that is allowed to change the config at `/etc/wireguard/server.conf`
- Copy the example `wirtbot.service` config to `/etc/systemd/system/` and update it with the correct values
- Start and enable the service with `systemctl enable --now wirtbot`

#### Automatically restarting wireguard

- install `inotify-tools`
- Place the `wireguard-restarter.sh` script to `/usr/bin` and make it executable (`chmod +x /usr/bin/wireguard-restarter.sh`)
- Copy the example `wireguard-restarter.service` config to `/etc/systemd/system/` and update it with the correct values
- Start and enable the service with `systemctl enable --now wireguard-restarter`

### Configuring your WirtBot

The WirtBot is configured with environment variables:

- **PUBLIC_KEY**: Public key of your https://wirt.network app
- **SSL_PEM_CERT**: SSL certificate
- **SSL_KEY**: SSL private key for the certificate

#### Optional

- **HOST**: the host address to listen on
- **PORT**: the port to listen on
- **CONFIG_PATH**: path to your Wireguard configuration

## Contributing

Simply check the `src/main.rs` file for **TODO** comments, to see what can be optimized in the code.

If you have other ideas please open a PR for small improvements.

For bigger changes, lets discuss these in an issue first.

### Other TODOs

- Testing needs to be done. One sample test to show how to test filters is implemented

## Development

Always run the server with a supplied public key. You can generate a fake one with `wg genkey` or simply use `wKcOYzxjaQV03gIy0uBov+WgeR1U20XY8o63r1ljuUc=`.

### Allow localhost in CORS

Make sure to send requests with the origin set to `https://wirt.network`.

For example in curl: `curl -H "origin: https://wirt.network"`

### Continuous Testing

Run `cargo watch -x test`

### Logging

To enable logging run the program with the wanted environment variable.
Check [env-logger](https://docs.rs/env_logger/0.7.1/env_logger/) for more information.

#### Server logs

`RUST_LOG=wirt::api`. For example `RUST_LOG=wirt::api cargo run`

#### Info logs

`RUST_LOG=info`
