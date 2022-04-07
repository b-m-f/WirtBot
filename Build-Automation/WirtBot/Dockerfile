### Image to build the Interface
FROM docker.io/library/node:lts-buster as interface

ENV DEBIAN_FRONTEND noninteractive

# Taken from https://github.com/rust-lang/docker-rust/blob/master/1.47.0/buster/Dockerfile
ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH \
    RUST_VERSION=1.58.1
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs > install_rust.sh
RUN sh install_rust.sh -y --no-modify-path --profile minimal --default-toolchain $RUST_VERSION && chmod -R a+w $RUSTUP_HOME $CARGO_HOME


WORKDIR '/wirtbot'
ENV NODE_ENV production

# Install all dependecies via workspaces first
COPY Interface/package.json  Interface/package.json
COPY Interface/package-lock.json  Interface/package-lock.json
COPY Interface/src Interface/src 
COPY Interface/public Interface/public
COPY Interface/babel.config.js Interface/babel.config.js
COPY Interface/vue.config.js Interface/vue.config.js
COPY Interface/.env Interface/.env
COPY Interface/.env.localtest Interface/.env.localtest

# Compile and package wasm
RUN cargo install wasm-pack --vers 0.9.1
# Build interface
WORKDIR '/wirtbot/Interface'
## Inject keys into the test interface by doing this, that way the Interface can talk to the WirtBot Core
## Which will start with the corresponding public key
ARG environment=production
RUN if [ "$environment" = "test" ] ; then rm .env && mv .env.localtest .env; fi
RUN npm ci && npm run build


### Image to build WirtBot
FROM docker.io/library/rust:slim as builder

ENV DEBIAN_FRONTEND noninteractive

WORKDIR /builder/WirtBot
COPY Core/src src
COPY Core/Cargo.toml Cargo.toml
COPY Core/Cargo.lock Cargo.lock

RUN cargo build --release --target-dir /builder/artifact

RUN cargo install prometheus_wireguard_exporter
RUN which prometheus_wireguard_exporter



FROM docker.io/library/golang:1.17.8-buster as coredns

RUN git clone https://github.com/coredns/coredns.git /go/src/github.com/coredns/coredns
WORKDIR /go/src/github.com/coredns/coredns
RUN  git checkout $(git describe --tags --abbrev=0)
COPY Build-Automation/WirtBot/service-files/coredns-plugins plugin.cfg
RUN make gen && make
RUN mv coredns /coredns
RUN /coredns -plugins


### This is where the final image starts
FROM docker.io/library/debian:bullseye-slim

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -yy nginx inotify-tools iproute2 wireguard-tools

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

## Copy the coredns binary with ads plugin from the coredns build image
COPY --from=coredns /coredns /usr/bin/coredns

## Make the Corefile writable by all members of the coredns group
COPY Build-Automation/WirtBot/service-files/Corefile /etc/coredns/Corefile
RUN chmod 660 /etc/coredns/Corefile


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


# enable IPv4 forwarding
RUN echo 'net.ipv4.ip_forward = 1' | tee -a /etc/sysctl.conf

# WireGuard restarter script
COPY Core/wireguard-restarter.sh /usr/bin/wireguard-restarter
RUN chmod +x /usr/bin/wireguard-restarter
COPY Build-Automation/WirtBot/service-files/wireguard-restarter /etc/services.d/wireguard-restarter/run

## WireGuard metrics
COPY --from=builder /usr/local/cargo/bin/prometheus_wireguard_exporter .
RUN chmod +x prometheus_wireguard_exporter && mv prometheus_wireguard_exporter /usr/bin
COPY Build-Automation/WirtBot/service-files/wireguard-metrics /etc/services.d/wireguard-metrics/run

## Add NFT firewall to allow traffic masquerading when using routed mode
ARG environment=production
RUN apt-get install -yy nftables
COPY Build-Automation/WirtBot/service-files/firewall /firewall.sh
RUN if [ "$environment" = "test" ] ; then rm /firewall.sh && touch /firewall.sh && echo "#! /bin/bash" >> /firewall.sh; fi
RUN chmod +x /firewall.sh



# Clean up script to shut down WireGuard interface on container exit
COPY Build-Automation/WirtBot/service-files/clean-up /etc/cont-finish.d/clean

EXPOSE 3030
EXPOSE 9586
EXPOSE 9153
EXPOSE 80
EXPOSE 53

COPY Build-Automation/WirtBot/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
