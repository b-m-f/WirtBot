# WirtBot developer documentation

This documentation should give you an intro into the WirtBot`s inner workings.

It is always considered to be a companion to the code and not the single source of truth.

If anything is unclear or incomplete please open up an issue on GitHub to clarify things.

## Development environment

The development environment makes heavy use of docker and make.
You can find all available functionality in the `Makefile` in the root of the repository.


### Dependencies

Make sure that `npm` and `g++` are installed.

For `npm` I recommend [nvm](https://github.com/nvm-sh/nvm). To install `g++` please check how to do this on your OS.

To install all the necessary dependencies first run `make dev-setup`.

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

