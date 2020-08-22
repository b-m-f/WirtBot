# CI 

In order to assure high quality and avoid regressions Wirt is leveraging [GitHub actions](https://docs.github.com/en/actions).

All of them are defined in `.github/workflows` and will do the following things:

- Run all tests on Pull Requests for the Interface code, using a completely simulated Wirt environment using the WirtBot release version
- Run WirtBot unit tests on a PR
- Publish Interface and WirtBot docker image when code gets merged to master

## Caveats

Since the simulated environment is using the WirtBot:release Dockerfile, this setup wont work well when a Pull Request touches both ends of the stack.
For the sake of speed this is still okay though. A full test can be run locally by having a **WirtBot** running and it is advised to keep PRs small anyway.