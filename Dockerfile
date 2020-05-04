# APP
FROM archlinux as app

# install rust
RUN pacman -Sy  --noconfirm \
    curl \
    git \
    clang \
    nodejs \
    npm \
    python3 \
    make \
    gcc \
    libffi \
    pkg-config \
    openssl
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install wasm-pack from binary until fixed dependencies
RUN curl https://github.com/rustwasm/wasm-pack/releases/download/v0.9.1/wasm-pack-v0.9.1-x86_64-unknown-linux-musl.tar.gz -L --output wasm-pack.tar.gz
RUN mkdir wasm &&  tar xvf wasm-pack.tar.gz -C wasm --strip-components 1 && mv wasm/* ~/.cargo/bin/
# Reuse this one when dependencies are fixed
# RUN cargo install wasm-pack

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
