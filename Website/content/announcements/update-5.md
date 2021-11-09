# Update 5: Time to maintain

A year is over, a project complete.

As of today, the international womens day 2021, the WirtBot project is going into maintenance mode.

All planned features have been integrated and the testing harness covers them.

If you have never heard of the project you can check out the [repository](https://github.com/b-m-f/WirtBot) or [homepage](https://wirtbot.com).

## What changed since the last update?

The last update was the preparation to get to this final stage. It threw away many unnecessary things and narrowed the focus.

So, this time its feature galore:

### IPv6 subnets

Want to take the plunge into IPv6? Go ahead, the DashBoard now fully supports IPv6 and IPv4 subnets.

### Configure ignored DNS zones

Have some DNZ zones that you do not want to be handled by the WirtBot?

You can now configure them on the DashBoard.

### AdBlocking

Okay, this is my favorite.

You have probably heard of the good old [Pi-Holes](https://pi-hole.net/).
Amazing idea.
So why not have the same thing running in the WirtBot?

Yeah, why not?

Compiling [coredns](https://github.com/coredns/coredns) with the [ads](https://github.com/c-mueller/ads/) plugin and making it configurable via the DashBoard, the WirtBot now supports blocking Ads for all connected devices.

Use custom block lists, block specific hosts or disable Ad Blocking if you want to stay up to date with latest Malware.

### Metrics

At some point you will want to know what is happening in the network.
Exposing CoreDNS and WireGuard metrics as Endpoints scrapable by Prometheus you can now get all the info you need.

Either expose them on the host or hook your monitoring solution into the network.

### Non-features

Well, there are of course some internal things that changed to accomodate all the new features.
Here are the most important ones:

- Store refactoring for clean reactivity system throughout the Frontend
- Completely responsive Frontend using only media-queries, no more JS based detection
- Core is completely refactored and has Unit-Tests. Caught a few possible panics and should now run safely. Thanks Rust.

## What does the future bring?

Who knows.

But for me, I am going to explore different projects and use some of the things I learned to write some more on my [personal blog](https://ehlers.berlin).

I will still have an eye on the [subreddit](https://reddit.com/r/WirtBot) and [Github repository](https://github.com/b-m-f/wirtbot) to make sure things keep running smoothly and squash bugs when they appear.

But no more features will be added by me. If you feel like something is missing I will be happy to assist you in implementing it though.

I hope that the WirtBot can make your life easier, just as it does for me and wish you happy hacking.
