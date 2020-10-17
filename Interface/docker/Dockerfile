
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


# Create small Nginx image with the production ready application
FROM nginx:alpine

COPY --from=interface /wirtbot/Interface/dist /app
COPY Interface/docker/nginx/nginx.conf /etc/nginx/nginx.conf
