
FROM node:buster as interface

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update
RUN apt-get install curl -yy

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs > install_rust.sh
RUN sh install_rust.sh -y
ENV PATH "$HOME/.cargo/bin:$PATH"


RUN npm install -g yarn --unsafe-perm=true --force


# Install all dependecies with yarn workspaces first
ENV NODE_ENV production
WORKDIR '/wirtbot/shared-libs'
COPY shared-libs .


WORKDIR '/wirtbot/Interface'
COPY Interface/package.json  .
COPY Interface/yarn.lock .

WORKDIR '/wirtbot'
COPY package.json .
COPY yarn.lock .
RUN yarn install

# Build shared libs
WORKDIR '/wirtbot/shared-libs/rust-wasm'
RUN  ls -la && ls -la crate
RUN npm run build


# Build interface
WORKDIR '/wirtbot/Interface'

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
