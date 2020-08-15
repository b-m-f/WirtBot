# WirtBot

This is the WirtBot who is responsible for:

- listening to incomming requests from a users Interface
- automatically update the WireGuard configuration with new values

in this order.

To guarantee that only the user who owns the WirtBot can update it, the Interface's public key has to be provided when running the WirtBot to verify payloads with the Interface's signature.

More info in the [developer-docs](../developer-docs/WirtBot)
