# System tests

The system tests are trying to test the while WirtBot system.
This is achieved by creating a simulated test environment with multiple docker containers.

All components - **Interface**, **WirtBot** and **Test-Runner** - run in Docker containers that are linked together. 

By using [docker volumes](https://docs.docker.com/storage/volumes/), it is possible for the **Test-Runner** to have access to all necessary files.

This way it is possible to change the configuration on the Interface and then test if the changes were written to disk correctly, or rejected.


## Linking Interface and WirtBot Core

Interface and WirtBot are linked together in the same way as during the development - by spawning them both with predefined keys to enable communcation.