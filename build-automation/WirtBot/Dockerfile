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


ENV NODE_ENV production
WORKDIR '/wirtbot'

# Install all dependecies via workspaces first
COPY shared-libs/config-generators shared-libs/config-generators
COPY shared-libs/crypto shared-libs/crypto
COPY shared-libs/components shared-libs/components
COPY shared-libs/styles shared-libs/styles
COPY Interface/package.json  Interface/package.json
COPY Interface/package-lock.json  Interface/package-lock.json
COPY Interface/src Interface/src 
COPY Interface/public Interface/public
COPY Interface/babel.config.js Interface/babel.config.js
COPY Interface/vue.config.js Interface/vue.config.js
COPY Interface/.env Interface/.env

# Compile and package wasm
RUN cd shared-libs/crypto && npm ci && npm run build && cd -

# Build interface
RUN cd Interface && npm ci  && npm run build


### Image to build WirtBot
FROM rust:slim as builder

ENV DEBIAN_FRONTEND noninteractive

WORKDIR /builder/WirtBot
COPY WirtBot/src src
COPY WirtBot/Cargo.toml Cargo.toml
COPY WirtBot/Cargo.lock Cargo.lock

RUN cargo build --release --target-dir /builder/artifact

### Build necessary tooling
FROM debian:buster-slim as wireguard
ENV DEBIAN_FRONTEND noninteractive
RUN apt update && apt upgrade -yy
RUN apt-get install make gcc xz-utils -yy

WORKDIR /

ENV WG_TOOLS="wireguard-tools-1.0.20200827"

COPY build-automation/WirtBot/$WG_TOOLS.tar.xz .
RUN tar xf $WG_TOOLS.tar.xz
RUN cd $WG_TOOLS/src && make && mv wg / && mv wg-quick/linux.bash /wg-quick && cd /


### This is where the final image starts
FROM debian:buster-slim
ENV DEBIAN_FRONTEND noninteractive
RUN apt update && apt upgrade -yy
RUN apt-get install nginx inotify-tools iproute2 -yy

# Set up the s6 overlay init system
COPY build-automation/WirtBot/s6-overlay-amd64-installer-2.1.0.2 /tmp/s6-overlay-amd64-installer
RUN chmod +x /tmp/s6-overlay-amd64-installer
RUN /tmp/s6-overlay-amd64-installer /


WORKDIR /

# Interface
RUN useradd -r -s /bin/false interface
RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log
COPY build-automation/WirtBot/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=interface /wirtbot/Interface/dist /interface

RUN chown -R interface:interface /var/log/nginx
RUN chown -R interface:interface /interface
COPY build-automation/WirtBot/service-files/interface /etc/services.d/interface/run
COPY build-automation/WirtBot/service-files/finisher /etc/services.d/interface/finish

# WirtBot Core
RUN useradd -r -s /bin/false core

COPY --from=builder /builder/artifact/release/wirtbot /usr/bin/wirtbot-core
COPY build-automation/WirtBot/service-files/core /etc/services.d/core/run
COPY build-automation/WirtBot/service-files/finisher /etc/services.d/core/finish

# WireGuard
## Make sure to mount a WireGuard config to /etc/wireguard/server.conf
COPY --from=wireguard /wg .
COPY --from=wireguard /wg-quick .
RUN chmod +x wg wg-quick && mv wg wg-quick /usr/bin


# WireGuard restarter script
COPY WirtBot/wireguard-restarter.sh /usr/bin/wireguard-restarter
RUN chmod +x /usr/bin/wireguard-restarter
COPY build-automation/WirtBot/service-files/wireguard-restarter /etc/services.d/wireguard-restarter/run


# Clean up script to shut down WireGuard interface on container exit
COPY build-automation/WirtBot/service-files/clean-up /etc/cont-finish.d/clean

EXPOSE 3030
EXPOSE 80


ENTRYPOINT ["/init"]