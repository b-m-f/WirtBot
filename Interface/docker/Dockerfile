
FROM node:buster as interface

ENV DEBIAN_FRONTEND noninteractive

# Taken from https://github.com/rust-lang/docker-rust/blob/master/1.47.0/buster/Dockerfile
ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH \
    RUST_VERSION=1.47.0
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs > install_rust.sh
RUN sh install_rust.sh -y --no-modify-path --profile minimal --default-toolchain $RUST_VERSION && chmod -R a+w $RUSTUP_HOME $CARGO_HOME

RUN npm install -g yarn --unsafe-perm=true --force


# Install all dependecies with yarn workspaces first
ENV NODE_ENV production
WORKDIR '/wirtbot/shared-libs'
COPY shared-libs/rust-wasm  rust-wasm
COPY shared-libs/config-generators config-generators
COPY shared-libs/crypto crypto
COPY shared-libs/components components
COPY shared-libs/styles styles


WORKDIR '/wirtbot/Interface'
COPY Interface/package.json  .
COPY Interface/yarn.lock .

WORKDIR '/wirtbot'
COPY package.json .
COPY yarn.lock .
RUN yarn install

# Build shared libs
WORKDIR '/wirtbot/shared-libs/rust-wasm'
RUN npm run build && rm crate/pkg/.gitignore

WORKDIR '/wirtbot'
RUN yarn install


# Build interface
WORKDIR '/wirtbot/Interface'

COPY Interface/src src 
COPY Interface/public public
COPY Interface/babel.config.js .
COPY Interface/vue.config.js .
COPY Interface/.env .

RUN ls -la node_modules/@wirtbot
RUN ls -la node_modules/@wirtbot/rust-wasm
RUN ls -la node_modules/@wirtbot/rust-wasm/crate
RUN ls -la node_modules/@wirtbot/rust-wasm/crate/pkg
RUN ls -la node_modules/@wirtbot/crypto
RUN ls -la node_modules/@wirtbot/crypto/node_modules/@wirtbot
RUN ls -la node_modules/@wirtbot/crypto/node_modules/@wirtbot/rust-wasm
RUN ls -la node_modules/@wirtbot/crypto/node_modules/@wirtbot/rust-wasm/crate
RUN ls -la node_modules/@wirtbot/crypto/node_modules/@wirtbot/rust-wasm/crate/pkg
RUN npm run build


# Create small Nginx image with the production ready application
FROM nginx:alpine

COPY --from=interface /wirtbot/Interface/dist /app
COPY Interface/docker/nginx/nginx.conf /etc/nginx/nginx.conf
