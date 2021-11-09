# APP
FROM node:buster as app


# build the app
WORKDIR '/website'
COPY Website/package.json  .
COPY Website/package-lock.json .
ENV NODE_ENV production
RUN npm ci

COPY Website/styles content
COPY Website/components content
RUN npm run build


# Create small Nginx image with the production ready application
FROM nginx:alpine

COPY --from=app /website/content/.vuepress/dist /website
COPY Build-Automation/Website/nginx/nginx.conf /etc/nginx/nginx.conf
