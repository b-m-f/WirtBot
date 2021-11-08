---
title: "Initial setup"
description: "Get a wirtbot up and running"
lead: "Documentation to get your wirtbot running for the first time"
date: 2020-10-06t08:48:45+00:00
lastmod: 2020-10-06t08:48:45+00:00
draft: false
images: []
menu:
  docs:
    parent: "setup"
weight: 10
toc: true
---

# Setup

## Dependencies

To set up a WirtBot you must first make sure that your machine has the following dependencies installed:

- Linux Kernel > 5.6 or the WireGuard® Kernel Module
- Docker
- docker-compose

## Initial setup

Here is an example `docker-compose.yml` for a WirtBot with DNS:

```
version: "3.4"

services:
  WirtBot:
    image: bmff/wirtbot:latest
    container_name: WirtBot
    ports:
      - 53:53
      - 80:80
      - 3030:3030
      - 10101:10101/udp
    restart: "unless-stopped"
    cap_add:
      - NET_ADMIN
    sysctls:
      - net.ipv6.conf.all.disable_ipv6=0
    environment:
      - "ALLOWED_ORIGIN=http://IP/HOSTNAME_OF_THE_WIRTBOT_HOST_MACHINE"
    volumes:
      - wireguard-data:/etc/wireguard
      - coredns-data:/etc/coredns
volumes:
  wireguard-data:
  coredns-data:

```

Copy this configuration into a file on the machine, update the "ALLOWED_ORIGIN" variable and run `docker-compose up -d`.
Docker will now take care of downloading the WirtBot and CoreDNS containers and wiring them up.

You can check the progress with `docker logs -f WirtBot`.
Once the setup is finished you should see a message like this:

```
A new keypair for communication between Core and UI was generated
Please import the following text into your dashboard to take control of this WirtBot
```

followed by a long string.

To take control of the WirtBot via your browser you can now reach the Interface at the IP address of your machine in the browser.
Simple paste the above mentioned string into the input box that should be shown to you and click on the `Connect` button.

The last thing to do is to set the **Hostname/IP Address** of the machine that WirtBot is running on **as the API endpoint**. You can do this in the network part of the Dashboard.

Done. You are now in control of the WirtBot via your browser.

## Setting up your network

Now it is time to set up your network. Fill out the server section first, according to your needs. In the example configuration WireGuard will be listening at **Port 10101**.

After adding the server you can go ahead and add as many devices as you want.

You should also take note of the **Public Key** that is shown to you in the **Settings** section of the Dasboard.
In order to stay in control of the WirtBot when it restarts you **MUST** tell it to keep trusting this Key.

Do this by adding it to the environment variables in the `docker-compose` file like so:

```
environment:
  - "PUBLIC_KEY=your_public_key_from_the_settings_section"
```

Run `docker-compose up -d` again to start the WirtBot with the given public key.

> Simply restarting the container is not enough! A new one needs to be started to consume the right environment variables

Now that the network is established and the configuration persisted you might want to start closing down the Interface and WirtBot via Firewall rules.
You should also make a Backup via the UI and keep it in safe place.

## Advanced

### Monitoring

Endpoints for Prometheus metrics are enabled in the Container:

- 9153: CoreDNS metrics
- 9586: WireGuard metrics

If your prometheus instance is connected into the network you can simply get them from the default WirtBot address at `10.10.0.1` or `wirtbot.wirt.internal`.

You can also choose to expose them via the `docker-compose.yml` file if you prefer. The Dockerfile specifies them as exposed ports.

### Securing the WirtBot after setup

In order to make the WirtBot interace and API hidden on the Host machine simply **remove the port bindings** for port **80** and **3030**.

Both will still be reachable via the private network that was created with the WirtBot at `wirtbot.wirt.internal`.

In order to use the internal zone update

```
 - "ALLOWED_ORIGIN=http://IP/HOSTNAME_OF_THE_WIRTBOT_HOST_MACHINE"
```

to

```
 - "ALLOWED_ORIGIN=wirtbot.wirt.internal"
```

and **change the API Endpoint** the Dashboard to `wirtbot.wirt.internal`

### Host mode for more speed

In order to bypass a few network loops between the Host machine and the WirtBot container you can set

```
network_mode: host
```

in your `docker-compose.yml` file. This will directly bind the Host ports to the container and in addition the WireGuard interface will be created directly on the host as well.

**This also means that your host could talk to the network. But no routing is setup and this needs to be done manually if that is desired**

### Mounting the configuration files to the host

For backup purposes you can mount the following files to your host:

- WireGuard config: `/etc/wireguard/server.conf`
- CoreDNS config: `/etc/coredns/Corefile`
