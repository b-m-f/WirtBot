# APP
FROM rust:alpine  as app
RUN apk update
RUN apk add nodejs npm  build-base openssl-dev clang

RUN npm install -g yarn --unsafe-perm=true  --force

WORKDIR '/shared-libs'
COPY shared-libs/styles .
COPY shared-libs/components .



# build the app
WORKDIR '/website'
COPY Website/package.json  .
COPY Website/yarn.lock .
ENV NODE_ENV production
RUN yarn install

COPY Website/content content
RUN npm run build


# Create small Nginx image with the production ready application
FROM nginx:alpine

COPY --from=app /website/content/.vuepress/dist /website
COPY Website/docker/nginx/nginx.conf /etc/nginx/nginx.conf
