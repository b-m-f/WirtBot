# WirtBot

This is the WirtBot who is responsible for:

- listening to incomming requests from a users Interface
- automatically update the WireGuard configuration
- automatically update the CoreDNS configuration

in this order.

To guarantee that only the user who owns the WirtBot can update it, the Interface's public key has to be provided when running the WirtBot to verify payloads with the Interface's signature.

More info can be found in the [developer-docs](../developer-docs/WirtBot).
