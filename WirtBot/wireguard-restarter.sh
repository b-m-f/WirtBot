#! /bin/sh
while inotifywait -e close_write /etc/wireguard/server.conf; do wg syncconf server <(wg-quick strip server); done
