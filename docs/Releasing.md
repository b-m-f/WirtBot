# Releasing

- Update the version in `.version`.
- Run `make update-versions`
- Run `make tag-release`
- Run `git push --tags`

Once the release is tagged the **CI** will take over and build images for ARM and AMD64 and push them to Dockerhub.
