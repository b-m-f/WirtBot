FROM mcr.microsoft.com/playwright:jammy

# install node gyp deps
RUN apt-get update
RUN apt-get install g++ build-essential

# build the app
WORKDIR '/app'
COPY System-Tests/package.json  .
COPY System-Tests/package-lock.json .
RUN npm ci


COPY System-Tests/tests/ tests/
COPY System-Tests/run_all_tests.sh run_all_tests.sh
CMD ["npm", "run", "test"]
