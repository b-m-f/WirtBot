- remove installer
- add import from base64
- print base64 on initial docker spawn

## setup

spawn docker at port

Docker logs will print a base64 string -> this works as browser uses ed25519 as well and can use that as its browser key, while the container is able to spawn the core with that key, if none is provided as an argument


If a backup file is specified during spawn, that will be used in the application and the core spawned with it


