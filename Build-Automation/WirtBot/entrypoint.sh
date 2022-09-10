#! /bin/bash

set -eo pipefail

if [[ -z "${SSL_PEM_CERT_INTERFACE}" ]]; then
# Env variable is not defined
## || true is added so it does not crash when the config file doesnt exist yet
rm /etc/nginx/nginx.conf || true
mv /etc/nginx/nginx.http /etc/nginx/nginx.conf
else
if [[ -z "${SSL_KEY_INTERFACE}" ]]; then
: # noop
else
# Env variable is defined
echo "Preparing NGINX for SSL"
rm /etc/nginx/nginx.conf || true
mv /etc/nginx/nginx.https /etc/nginx/nginx.conf
mv $SSL_PEM_CERT_INTERFACE /interface/public_key
mv $SSL_KEY_INTERFACE /interface/private_key
fi

# Start wireguard interface
wg-quick up server

# Start firewall for masquerading traffic when routing traffic from clients in the network
/firewall.sh

# Start all services needed for WirtBot wit s6-overlay supervision
/init
