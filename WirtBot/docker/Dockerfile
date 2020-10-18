FROM rust:slim as builder

ENV DEBIAN_FRONTEND noninteractive

WORKDIR /builder/WirtBot
COPY src src
COPY Cargo.toml Cargo.toml
COPY Cargo.lock Cargo.local

RUN cargo build --release --target-dir /builder/artifact



FROM debian:buster-slim
ENV DEBIAN_FRONTEND noninteractive
RUN apt update && apt upgrade -yy

WORKDIR /app
COPY --from=builder /builder/artifact/release/wirtbot ./wirtbot

EXPOSE 3030

CMD ["./wirtbot"]