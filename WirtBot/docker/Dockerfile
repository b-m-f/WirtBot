FROM rust:slim as builder

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get upgrade
RUN apt-get install -yy git

RUN git clone https://github.com/b-m-f/Wirt.git /builder
WORKDIR /builder/WirtBot
RUN git pull
RUN cargo build --release --target-dir /builder/artifact



FROM debian:buster-slim
ENV DEBIAN_FRONTEND noninteractive
RUN apt update && apt upgrade

WORKDIR /app
COPY --from=builder /builder/artifact/release/wirtbot ./wirtbot

EXPOSE 3030

CMD ["./wirtbot"]