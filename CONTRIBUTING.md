# Contributing

## Git

### Branches

The main branch is `master`.

Base your work on it and chose it as the target for Merge Requests.

## Testing

Make sure to include tests with your changes.
If the code you submit adds or changes functionality this should be covered by a test.

Pull requests without tests might be rejected for that reason.

### Running system-tests

Run `make -j2 dev-tests` which runs the Core with a pre-seeded Public key.

Now head into the System-Tests folder and run the provided script with the following Environment variables:

- URL: url of the Interface (default it localhost:8080)
- API: url of the API (default it localhost:3030)

Alternatively you can run `make systems-tests` to run all tests in a dockerized environment.

## Development environment

### Dependencies

Make sure that `npm`, `g++`, `rustup`, `cargo-watch` and `wasm-pack` are installed.

- For `npm` I recommend [nvm](https://github.com/nvm-sh/nvm).
- To install `g++` please check how to do this on your OS.
- To install `rustup` run `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh` and add `$HOME/.cargo/bin` to your PATH
- To install `wasm-pack` run ` curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh`
- `cargo-watch` can be installed with `cargo install cargo-watch`

To install all the necessary dependencies first run `make dev-setup`.

You can find all available functionality in the `Makefile` in the root of the repository.
To get started run `make -j2 dev` to get a local build up and running

### Reading the WirtBot logs

- Find out WirtBot container name with `docker ps`
- attach to WirtBot with `docker logs -f $CONTAINER_NAME`
