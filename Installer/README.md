# WirtBot installer

The WirtBot installer will set up a VPS as a secure WirtBot.

## VPS setup
## Firewall
nftables is used as the main Firewall.

It blocks all traffic on public interfaces, but allows all traffic to flow on the WireGuard interface `server`.
This is also allowed for forwarding traffic.

The WirtBot, Interface and CoreDNS are all running in docker containers. 
WirtBot and Interface are running in a private docker network and the Firewall allows traffic to reach them.

CoreDNS is running in hostmode and is reachable via the hosts port **53** on the WireGuard interface. 

##  Fail2ban
Fail2Ban is securing the SSH port. May be overkill, since it is only reachable on the WireGuard interface.

