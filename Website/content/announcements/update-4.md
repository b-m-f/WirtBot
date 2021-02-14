# Update 4: V2 of the WirtBot lost some weight

After using the WirtBot for a while I noticed the cruft I loaded onto myself.

Maintaining the WirtBot + ansible scripts etc. while already having it containerized and the audience, despite my attempts to make it simple to use, being highly technical nonetheless just made no sense.

If you use this tech you probably already have a pretty good grasp of Linux and networks.

So **the installer is removed** and you can integrate the Docker container on your machines even easier.

## New setup flow

When running the WirtBot container for the first time, meaning that you probably do not have a public key for your interface yet, it will automatically generate a keypair for you.

This is printed into the logs and can be used to take control of the interface.
Meaning that the setup is still as secure as possible, while staying straigt forward.

Accompanying the changes on the server is a new page on the Interface to help importing the keys.
If you happen to have a backup and started the WirtBot with a public key already in its environment you can of course simply skip this.

## Other changes

### updated dependencies

With [tokio](https://tokio.rs/) hitting **1.0** and [warp](https://docs.rs/warp/0.3.0/warp/) integrating it both have been updated to the latest versions.

### Bug fixes

There was a bug when importing backups.
In order to understand it you must know how the backup process actually works:

- read backup
- do some automatic upgrading depending on backup version
- remove all server configuration from the state
- remove all device configs from the state
- add the server from the backup via normal state dispatching
- add all devices 1 by 1 using the normal state dispatching

The bug was hiding in the device adding part. As new devices were assumed to not have keys when I originally wrote the function, this function would generate them every time.
This in turn means that the server would not recognize the devices anymore as their keys seemed to have updated and you got locked out of the WirtBot.

Making sure that keys are only regenerated when needed took care of this issue.

### Better feedback

Alerts have been added to show up when the configuration on the WirtBot has been updated successfully or failed for some reason.

### Relative Routing

To properly function behind any kind of proxy you might want to use for the interface the routing mode is now set to relative routing.

This should make it possible to proxy to and from the Interface without problems.

## End

Thats it. Well except for the updated setup documentation that is.

And what is next, now that there is less to take care of?

I am thinking of Metrics, but it might take another couple of months.

Til then, happy hacking.
