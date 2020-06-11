FROM rust:buster
RUN apt update
RUN apt install build-essential
RUN cargo install cargo-watch

EXPOSE 3030

WORKDIR /app
RUN mkdir /etc/wireguard
RUN touch /etc/wireguard/server.conf
COPY src/ .
COPY Cargo.toml .
COPY Cargo.lock .