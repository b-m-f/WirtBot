# Deployment

A multi stage `Dockerfile` is provided for building the application from scratch and then serving it with a clean `nginx` base using the config at `nginx/nginx.conf`.

The `Dockerfile` is also optimized for caching, meaning the least frequently changing things are executed first.

On every change to the release branch a new release will be build and stored in the container registry.

Builds to the development branch will trigger the test suite to ensure no regressions are introduced to the project.
