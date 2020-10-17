FROM node:latest

# fails when installing from package.json

# build the app
WORKDIR '/app'
COPY package.json  .
COPY package-lock.json .
RUN npm ci

COPY compose/wait-for.sh wait-for.sh
RUN chmod +x wait-for.sh

COPY tests tests
COPY nightwatch.conf.js .

CMD ["npm", "run", "test:ci"]
