#! /bin/bash

# Modified entrypoint that does not actually set up Firewall rules or spawn the WireGuard interface

set -eo pipefail

if [[ -z "${SSL_INTERFACE}" ]]; then
# Env variable is not defined
## || true is added so it does not crash when the config file doesnt exist yet
rm /etc/nginx/nginx.conf || true
mv /etc/nginx/nginx.http /etc/nginx/nginx.conf
else
# Env variable is defined
echo "Preparing NGINX for SSL"
rm /etc/nginx/nginx.conf || true
mv /etc/nginx/nginx.https /etc/nginx/nginx.conf
fi

# Start all services needed for WirtBot wit s6-overlay supervision
/init
