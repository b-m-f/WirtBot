#! /bin/bash

set -eou pipefail

# Start wireguard interface
wg-quick up server

# Start firewall for masquerading traffic when routing traffic from clients in the network
/firewall.sh

# Start all services needed for WirtBot wit s6-overlay supervision
/init
