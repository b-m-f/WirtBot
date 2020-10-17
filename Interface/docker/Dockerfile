# WASM
FROM rust:alpine as wasm
RUN apk update
RUN apk add nodejs npm  build-base openssl-dev clang

WORKDIR '/wasm'
ENV NODE_ENV production
COPY shared-libs/rust-wasm .

RUN npm install -g wasm-pack yarn --unsafe-perm=true 
RUN yarn install 
RUN npm run build 

FROM node:lts-buster as interface

RUN npm install -g yarn --unsafe-perm=true --force


# Build shared libs
ENV NODE_ENV production
WORKDIR '/wirtbot/shared-libs'
COPY shared-libs .
WORKDIR '/wirtbot/shared-libs/rust-wasm/crate/pkg'
COPY --from=wasm /wasm/crate/pkg/ .

WORKDIR '/wirtbot/shared-libs/crypto'
RUN yarn install

WORKDIR '/wirtbot/shared-libs/config-generators'
RUN yarn install

WORKDIR '/wirtbot/Interface'
COPY Interface/package.json  .
COPY Interface/yarn.lock .
WORKDIR '/wirtbot'
COPY package.json .
COPY yarn.lock .
RUN yarn install


WORKDIR '/wirtbot/Interface'
# build the app
RUN yarn install

COPY Interface/src src 
COPY Interface/public public
COPY Interface/babel.config.js .
COPY Interface/vue.config.js .
COPY Interface/.env .
RUN npm run build


# Create small Nginx image with the production ready application
FROM nginx:alpine

COPY --from=interface /wirtbot/Interface/dist /app
COPY Interface/docker/nginx/nginx.conf /etc/nginx/nginx.conf
