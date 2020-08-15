# Starting up the system for development
## Getting up and running

Install:

- docker
- docker-compose
- make

Now simply run `make dev` in the root of the repository.
Both the WirtBort and Interface will start in development mode, with their connection being set up properly with a development public/private keypair.

To test things add the server in the Interface. It IP is `127.0.0.1` and the port is `3030`.

### Accessing Server logs
Attach to the container logs with `docker logs -f development_wirtbot`