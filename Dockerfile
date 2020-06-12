# APP
FROM rust:alpine  as app
RUN apk update
RUN apk add nodejs npm  build-base openssl-dev clang
RUN cargo install wasm-pack

# build the app
WORKDIR '/app'
COPY Interface/package.json  .
COPY Interface/package-lock.json .
RUN npm install

COPY Interface/wasm wasm
RUN npm run build:rust

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
RUN npm install

COPY docs/docs ./docs
RUN npm run build:docs

# Create small Nginx image with the production ready application
FROM nginx:alpine

COPY --from=app /app/dist /app
COPY --from=app /docs/docs/.vuepress/dist /app/docs
COPY nginx/nginx.conf /etc/nginx/nginx.conf
