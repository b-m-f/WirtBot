#! /bin/bash
while inotifywait -e close_write /etc/wireguard/server.conf; do
wg-quick down server;
wg-quick up server; 
echo "WireGuard interface has been restartd";
echo "Old Peers were removed";
echo "New Peers were added";
done
