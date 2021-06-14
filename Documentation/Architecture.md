# Architecture

## Flow
### Secure Setup
1. Set up the WirtBot to get a keypair
2. Restart the WirtBot, providing the newly generated public key
3. Add devices to the WirtBot, such as the computer used for the setup
4. Download the WireGuard config and join the private network
5. Try reaching the WirtBot at its internal IP address
6. On success Restart the WirtBot, making sure not to bind the Interface Port 80
7. All configuration can now be done inside the safe internal network
8. The network and interface are still secured to only be changeable by the admin

## Interface

The interface is written with Vue.js, using the [vue-cli](https://cli.vuejs.org/) tooling.
Key generation is done with WASM that was compiled from Rust.

Check the **Interface** directory in the repository to read about details regarding the stack.

## Core

The Core API is written in Rust.

## Secure Communication between Interface and Core

All communication is based on Public/Private key encryption.
Every payload from the Interface is signed with its private key.

The Core, which is provided with the Interface\`s public key at start, verifies the signature on every incomming request.

In case the signature is invalid the request is dropped.

## Containerization

The Container uses [s6-overlay](https://github.com/just-containers/s6-overlay) to run all necessary processes.

This approach is chosen to encapsulate the functionality of the whole WirtBot into 1 container.
This allows for easy stopping and starting of the whole system without needing all the inside knowledge when setting it up.

For details check the **Build-automation** directory.

