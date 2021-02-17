# Contributing

## Git

### Branches

The main branch that is also always deployed to docker images is the `master` branch

Any work should be done on feature branches. When the work is done a pull request has to be opened to request that the changes will be accepted into master and released.

## Testing

Make sure to include tests with your changes.
If the code you submit adds or changes functionality this should be covered by a test.

Pull requests without tests might be rejected for that reason.


## Development environment

The development environment makes heavy use of docker and make.
You can find all available functionality in the `Makefile` in the root of the repository.


### Dependencies

Make sure that `npm`, `g++`, `rustup` and `wasm-pack` are installed.

- For `npm` I recommend [nvm](https://github.com/nvm-sh/nvm). 
- To install `g++` please check how to do this on your OS.
- To install `rustup` run `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh` and add `$HOME/.cargo/bin` to your PATH
- To install `wasm-pack` run ` curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh`

To install all the necessary dependencies first run `make -j dev-setup`.

### Runnin the WirtBot with Interface
Run `make dev`, which will create a containerized WirtBot and run the Interface locally.
By using predefined keys both will be linked together automatically.

Most other parts of the system can be run with `npm run dev`.

### Reading the WirtBot logs

- Find out WirtBot container name with `docker ps`
- attach to WirtBot with `docker logs -f $CONTAINER_NAME`

### Running a completely virtualized WirtBot

This is super useful for testing!
Just spawn a local WirtBot as it would run on the Server and connect to it with WireGuard for testing.


#### Dependencies

- wg-quick
- wg
- Linux Kernel > 5.6 || WireGuard® Kernel Module

Run `make run-test-wirtbot`. This will build and set up a complete WirtBot, including a WireGuard interface.

In order to connect to the WirtBot run `make connect-test-wirtbot`.

You should now be able to ping the Container at **10.10.4.1**.
