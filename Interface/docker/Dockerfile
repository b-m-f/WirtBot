# APP
FROM rust:alpine  as app
RUN apk update
RUN apk add nodejs npm  build-base openssl-dev clang

WORKDIR '/shared-libs'
COPY shared-libs .
WORKDIR '/shared-libs/wasm'
RUN npm ci
RUN npm run build 
WORKDIR '/shared-libs/crypto'
RUN npm ci
WORKDIR '/shared-libs/config-generators'
RUN npm ci


# build the app
WORKDIR '/app'
COPY Interface/package.json  .
COPY Interface/package-lock.json .
ENV NODE_ENV production
RUN npm ci

COPY Interface/src src 
COPY Interface/public public
COPY Interface/babel.config.js .
COPY Interface/vue.config.js .
COPY Interface/.env .
RUN npm run build

# build the docs


WORKDIR '/docs'
COPY docs/package.json  .
COPY docs/package-lock.json .

COPY docs/docs ./docs
RUN npm ci
RUN npm run build:docs

# Create small Nginx image with the production ready application
FROM nginx:alpine

COPY --from=app /app/dist /app
COPY --from=app /docs/docs/.vuepress/dist /app/docs
COPY Interface/docker/nginx/nginx.conf /etc/nginx/nginx.conf
