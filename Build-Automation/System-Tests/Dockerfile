FROM node:latest

# fails when installing from package.json

# build the app
WORKDIR '/app'
COPY System-Tests/package.json  .
COPY System-Tests/package-lock.json .
RUN npm ci

COPY Build-Automation/System-Tests/wait-for.sh wait-for.sh
RUN chmod +x wait-for.sh

COPY System-Tests/tests tests
COPY System-Tests/nightwatch.conf.js .

CMD ["npm", "run", "test:ci"]
