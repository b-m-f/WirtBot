# Development environment

The development environment makes heavy use of docker and make.
You can find all available functionality in the `Makefile` in the root of the repository.

Running `make dev` for example, will create a containerized WirtBot and run the Interface locally.
By using predefined keys both will be linked together automatically.

## Reading the WirtBot logs

- Find out WirtBot container name with `docker ps`
- attach to WirtBot with `docker logs -f $CONTAINER_NAME`