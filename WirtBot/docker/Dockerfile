FROM rust:slim as builder

ENV DEBIAN_FRONTEND noninteractive

WORKDIR /builder/WirtBot
COPY WirtBot/src src
COPY WirtBot/Cargo.toml Cargo.toml
COPY WirtBot/Cargo.lock Cargo.lock

RUN cargo build --release --target-dir /builder/artifact



FROM debian:buster-slim
ENV DEBIAN_FRONTEND noninteractive
RUN apt update && apt upgrade -yy

WORKDIR /app
COPY --from=builder /builder/artifact/release/wirtbot ./wirtbot

EXPOSE 3030

CMD ["./wirtbot"]