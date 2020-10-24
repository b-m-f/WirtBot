# WirtBot

## Firewall
nftables is used as the main Firewall.

It blocks all traffic on public interfaces, but allows all traffic to flow on the WireGuard interface `server`.
This is also allowed for forwarding traffic.

The WirtBot, Interface and CoreDNS are all running in docker containers. 
WirtBot and Interface are running in a private docker network and the Firewall allows traffic to reach them.

CoreDNS is running in hostmode and is reachable via the hosts port **53** on the WireGuard interface. 

##  Fail2ban
Fail2Ban is securing the SSH port. May be overkill, since it is only reachable on the WireGuard interface.


## API
### Installation
#### Prerequisites

- The server must support `systemd` to control processes.

#### Compilation

- Install rust and cargo with https://rustup.rs/
- `cargo build --release`


### Configuration options

The WirtBot is configured with environment variables:

- **PUBLIC_KEY**: Public key of Interface

#### Optional

- **HOST**: the host address to listen on
- **PORT**: the port to listen on
- **CONFIG_PATH**: path to WireGuard configuration
- **MANAGED_DNS_ENABLED**: Enable endpoint to configure DNS
- **MANAGED_DNS_DEVICE_FILE**: File to write DNS entries to
- **SSL_PEM_CERT**: SSL certificate
- **SSL_KEY**: SSL private key for the certificate

### Logging

To enable logging run the program with the wanted environment variable.
Check [env-logger](https://docs.rs/env_logger/0.7.1/env_logger/) for more information.

#### Server logs

`RUST_LOG=wirt::api`. For example `RUST_LOG=wirt::api cargo run`

#### Info logs

`RUST_LOG=info`