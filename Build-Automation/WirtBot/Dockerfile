### Image to build the Interface
FROM node:buster as interface

ENV DEBIAN_FRONTEND noninteractive

# Taken from https://github.com/rust-lang/docker-rust/blob/master/1.47.0/buster/Dockerfile
ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH \
    RUST_VERSION=1.47.0
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs > install_rust.sh
RUN sh install_rust.sh -y --no-modify-path --profile minimal --default-toolchain $RUST_VERSION && chmod -R a+w $RUSTUP_HOME $CARGO_HOME


WORKDIR '/wirtbot'
ENV NODE_ENV production

# Install all dependecies via workspaces first
COPY Shared-Libs/components Shared-Libs/components
COPY Shared-Libs/styles Shared-Libs/styles
COPY Interface/package.json  Interface/package.json
COPY Interface/package-lock.json  Interface/package-lock.json
COPY Interface/src Interface/src 
COPY Interface/public Interface/public
COPY Interface/babel.config.js Interface/babel.config.js
COPY Interface/vue.config.js Interface/vue.config.js
COPY Interface/.env Interface/.env
COPY Interface/.env.test Interface/.env.test

# Compile and package wasm
RUN cargo install wasm-pack
# Build interface
WORKDIR '/wirtbot/Interface'
## Inject keys into the test interface by doing this, that way the Interface can talk to the WirtBot Core
## Which will start with the corresponding public key
ARG environment=production
RUN if [ "$environment" = "test" ] ; then rm .env && mv .env.test .env; fi
RUN npm ci && npm run build


### Image to build WirtBot
FROM rust:slim as builder

ENV DEBIAN_FRONTEND noninteractive

WORKDIR /builder/WirtBot
COPY Core/src src
COPY Core/Cargo.toml Cargo.toml
COPY Core/Cargo.lock Cargo.lock

RUN cargo build --release --target-dir /builder/artifact

### Build necessary tooling
FROM debian:buster-slim as wireguard
ENV DEBIAN_FRONTEND noninteractive
RUN apt update && apt upgrade -yy
RUN apt-get install make gcc xz-utils -yy

WORKDIR /

ENV WG_TOOLS="wireguard-tools-1.0.20200827"

COPY Build-Automation/WirtBot/$WG_TOOLS.tar.xz ./$WG_TOOLS.tar.xz
RUN tar xf $WG_TOOLS.tar.xz
RUN cd $WG_TOOLS/src && make && mv wg / && mv wg-quick/linux.bash /wg-quick && cd /


### This is where the final image starts
FROM debian:buster-slim
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -yy nginx inotify-tools iproute2 

# Set up the s6 overlay init system
COPY Build-Automation/WirtBot/s6-overlay-amd64-installer-2.1.0.2 /tmp/s6-overlay-amd64-installer
COPY Build-Automation/WirtBot/s6-overlay-aarch64-installer-2.1.0.2 /tmp/s6-overlay-aarch64-installer

## see https://docs.docker.com/engine/reference/builder/#automatic-platform-args-in-the-global-scope
ARG TARGETPLATFORM

RUN if [ "$TARGETPLATFORM" = "linux/amd64" ] || [ "$TARGETPLATFORM" = "" ]; then chmod +x /tmp/s6-overlay-amd64-installer && /tmp/s6-overlay-amd64-installer /;fi
RUN if [ "$TARGETPLATFORM" = "linux/arm64" ] ; then chmod +x /tmp/s6-overlay-aarch64-installer && /tmp/s6-overlay-aarch64-installer /; fi


WORKDIR /

# Interface
RUN addgroup --gid ${INTERFACE_GID:-1002} interface
RUN useradd --gid ${INTERFACE_GID:-1002} --uid ${INTERFACE_UID:-1002} -r -s /bin/false interface
RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log
COPY Build-Automation/WirtBot/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=interface /wirtbot/Interface/dist /interface

RUN chown -R interface:interface /var/log/nginx
RUN chown -R interface:interface /interface
COPY Build-Automation/WirtBot/service-files/interface /etc/services.d/interface/run
COPY Build-Automation/WirtBot/service-files/finisher /etc/services.d/interface/finish

# Core DNS
## CA-certificates are needed for correct DNSoverTLS forwarding of DNS requests
RUN apt-get install -yy ca-certificates
RUN addgroup --gid ${DNS_GID:-1003} coredns
RUN useradd --gid ${DNS_GID:-1003} --uid ${DNS_UID:-1003} -r -s /bin/false coredns
RUN mkdir -p /etc/coredns

## Make the Corefile writable by all members of the coredns group
COPY Build-Automation/WirtBot/service-files/Corefile /etc/coredns/Corefile
RUN chmod 660 /etc/coredns/Corefile

## Copy the coredns binary from the official coredns docker image
COPY --from=coredns/coredns /coredns /usr/bin/coredns

COPY Build-Automation/WirtBot/service-files/dns /etc/services.d/coredns/run
COPY Build-Automation/WirtBot/service-files/finisher /etc/services.d/coredns/finish
## Set permissions after container spawn, this ensures that even if files are mounted in, they will still be writable
COPY Build-Automation/WirtBot/service-files/fix-dns-permissions /etc/fix-attrs.d/01-fix-dns-permissions

# WirtBot Core
RUN addgroup --gid ${CORE_GID:-1001} core
## Add core user to coredns group as well to be able to change the Corefile
RUN useradd --gid ${CORE_GID:-1001} --groups ${DNS_GID:-1003} --uid ${CORE_UID:-1001} -r -s /bin/false core
RUN mkdir -p /etc/wireguard
COPY Build-Automation/WirtBot/service-files/initial-wireguard-config /etc/wireguard/server.conf

COPY --from=builder /builder/artifact/release/wirtbot /usr/bin/wirtbot-core
COPY Build-Automation/WirtBot/service-files/core /etc/services.d/core/run
COPY Build-Automation/WirtBot/service-files/finisher /etc/services.d/core/finish
## Set permissions after container spawn, this ensures that even if files are mounted in, they will still be writable
COPY Build-Automation/WirtBot/service-files/fix-wireguard-permissions /etc/fix-attrs.d/02-fix-wireguard-permissions


# WireGuard
COPY --from=wireguard /wg .
COPY --from=wireguard /wg-quick .
RUN chmod +x wg wg-quick && mv wg wg-quick /usr/bin


# WireGuard restarter script
COPY Core/wireguard-restarter.sh /usr/bin/wireguard-restarter
RUN chmod +x /usr/bin/wireguard-restarter
COPY Build-Automation/WirtBot/service-files/wireguard-restarter /etc/services.d/wireguard-restarter/run


# Clean up script to shut down WireGuard interface on container exit
COPY Build-Automation/WirtBot/service-files/clean-up /etc/cont-finish.d/clean

EXPOSE 3030
EXPOSE 80
EXPOSE 53


ENTRYPOINT ["/init"]
