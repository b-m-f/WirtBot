# WASM
FROM rust:alpine as wasm
RUN apk update
RUN apk add nodejs npm  build-base openssl-dev clang

WORKDIR '/wasm'
ENV NODE_ENV production
COPY shared-libs/rust-wasm .

RUN npm install -g wasm-pack --unsafe-perm=true
RUN npm ci 
RUN npm run build 

FROM node:lts-buster as interface

# Build shared libs
ENV NODE_ENV production
WORKDIR '/shared-libs'
COPY shared-libs .
RUN rm -rf rust-wasm
WORKDIR '/shared-libs/rust-wasm'
COPY --from=wasm /wasm /shared-libs/rust-wasm/
WORKDIR '/shared-libs/crypto'
RUN npm ci
WORKDIR '/shared-libs/config-generators'
RUN npm ci


# build the app
WORKDIR '/app'
COPY Interface/package.json  .
COPY Interface/package-lock.json .
RUN npm ci

COPY Interface/src src 
COPY Interface/public public
COPY Interface/babel.config.js .
COPY Interface/vue.config.js .
COPY Interface/.env .
RUN npm run build


# Create small Nginx image with the production ready application
FROM nginx:alpine

COPY --from=interface /app/dist /app
COPY Interface/docker/nginx/nginx.conf /etc/nginx/nginx.conf
