# Releasing

- Update the version in `.version`.
- Run `make update-versions`
- Run `make tag-release`
- Run `git push --tags`

Once the release is tagged the **CI** will take over and build images for ARM and AMD64 and push them to Dockerhub.

## Manual release

If the CI has issues there is a possibility to release manually.

For now you need access credentials for Dockerhub => `docker login`

Now install the dependencies for multiarch builds:

```
# Fedora
qemu-user-static
qemu
buildah
```


Now its possible to build and push with `make build-and-release`
