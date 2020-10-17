# APP
FROM rust:alpine  as app
RUN apk update
RUN apk add nodejs npm  build-base openssl-dev clang

RUN npm install -g npm@7 --unsafe-perm=true  --force

WORKDIR '/shared-libs'
COPY shared-libs/styles .
COPY shared-libs/components .



# build the app
WORKDIR '/website'
COPY Website/package.json  .
COPY Website/package-lock.json .
ENV NODE_ENV production
RUN npm install

COPY Website/content content
RUN npm run build


# Create small Nginx image with the production ready application
FROM nginx:alpine

COPY --from=app /website/content/.vuepress/dist /website
COPY Website/docker/nginx/nginx.conf /etc/nginx/nginx.conf
