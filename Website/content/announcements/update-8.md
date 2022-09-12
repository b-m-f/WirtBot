# WirtBot v3.8.17

## New restarter
The WireGuard restarter script is again killing the interface and starting it again on the WirtBot.

Using syncconf as it was previously described in the manpages of `wg` seemed to lead to instabilities when updating the configurations from the DashBoards.
Restarts of the container were often necessary and are hard to debug for users.

While this approach might not be the most elegant for some, it is the most reliable from my experience.
Feel free to add another solution if you have one.

## SSL

Both the core and Interface now support individual SSL encryption.
The keys are expected in:

```
/core/public_key
/core/private_key
```
for the core  and
```
/interface/public_key
/interface/private_key
```
for the interface.

SSL will be activated when environment variables `"SSL_INTERFACE=true"` or `"SSL_CORE=true"` are set.

Make sure to update your CORS allowed origin.

## New convenience script
A python script to create `ed25519` keys for the connection between Interface and core has been added.

You can use this to preseed a backup file to make the initial setup even easier by not having to change the Pubkey variable on the container.
This makes it easier for automatically provisioned setups.


## Other updates
- dependencies were updated
- CoreDNS runs as root (this was happening before, but hidden behind a wrong configuration)


So long, happy hacking.
