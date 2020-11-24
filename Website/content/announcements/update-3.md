# Update 3

Already the third update and some things have changed on the surface, more on that at the [end of the page](#frontend-refactor).

But underneath the hood, that is where things were really changed.
So lets dive right in.

## Single Docker container
First of all, the functionality that ensures the systems functionality is now encapsulated inside a single Docker container.
The only exception is CoreDNS. It still resides in its own container and only the **Corefile** is shared via Docker volumes over the local filesystem.

The single WirtBot Container uses [s6-overlay](https://github.com/just-containers/s6-overlay) for managing the different processes - Nginx for Interface, Core, File watcher to reload interface. All logic is encapsulated in this container, which on the other hand means that it has to be started with **NET_CAP** capabilities to control the WireGuard Interface on the host.
On the other hand it simplifies setup. No more SystemD service configurations.

Whether or not this is a good idea in the long term? Lets see.

### Long standing issue addressed
More thans 6 months ago when I posted about WirtBot on [/r/homelab](https://reddit.com/r/homelab) a reddit user gave some [critique on how the interface is reloaded on every change](https://www.reddit.com/r/homelab/comments/ge0vdf/make_your_homelab_available_over_the_internet/fpmbw2c?utm_source=share&utm_medium=web2x&context=3).
This issue is now addressed in the code, following this relevant section from the man pages of **wg-quick**:
> The strip command is useful for reloading configuration  files  without
> disrupting active sessions:

> # wg syncconf wgnet0 <(wg-quick strip wgnet0)


## Repo Reoganization
Some maintenance work on the repository:

- All things build-automation and containerization are now in the `Build-Automation` directory
- Modules now have a README.md

## Testing

This is probabaly the biggest chunk of work.

To support changes in the future and ensure that the whole system still works as intended a whole bunch of tests were added and rewritten.

- The installer is now tested to supply correct values to ansible
- [playwright](https://playwright.dev/) supersedes [nightwatch](https://nightwatchjs.org/) for End2End tests
- Input validity now tested
- Backup export and import tested
- Correct IPv6 configuration tested
- Test complex and simple network configurations
- Tests run in Firefox AND Chromium in CI


## Frontend refactor
Based on the improved testing I was able to refactor the frontend with confidence.
So what changed?

Things were removed! **Less complexity, more focus**.

And here a list of the removed features:

- Expert mode - All configuration options are shown by default
- Edit mode - Changes, as long as valid, are saved and sent to the backend immediately
- Update the UI button - That was a workaround for a bug in the reactivity system. The underlying issue is fixed and this button now unnecessary.

Besides that some Bugs were squashed in the process of testing and refactoring.
## End
Quite a lot of changes that hopefully ensure good maintainability and easier implementation of new features.

Lets see in Update #4. Thanks for reading.