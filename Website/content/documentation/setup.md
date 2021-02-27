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
    environment:
      - "ALLOWED_ORIGIN=http://IP/HOSTNAME_OF_THE_WIRTBOT_HOST_MACHINE"
      - "MANAGED_DNS_ENABLED=1"
      - "DNS_UID=1003"
      - "DNS_GID=1003"
      - "INTERFACE_UID=1002"
      - "INTERFACE_GID=1002"
      - "CORE_UID=1001"
      - "CORE_GID=1001"
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

The last thing to do is to set the Hostname/IP Address of the machine that WirtBot is running on as the API endpoint. You can do this in the network part of the Dashboard.

Done. You are now in control of the WirtBot via your browser.

## Setting up your network

Now it is time to set up your network. Fill out the server section first, according to your needs. In the example configuration WireGuard will be listening at Port 10101.

After adding the server go ahead and add as many devices as you want.

You should also take note of the **Public Key** that is shown to you in the **Settings** section of the Dasboard.
In order to stay in control of the WirtBot when it restarts you **MUST** tell it to keep trusting this Key.

Do this by adding it to the environment variables in the `docker-compose` file like so:

```
environment:
  - "PUBLIC_KEY=your_public_key_from_the_settings_section"
  - "MANAGED_DNS_ENABLED=1"
```

Run `docker-compose up -d` again to start the WirtBot with the given public key.

Now that the network is established and the configuration persisted you might want to start closing down the Interface and WirtBot via Firewall rules.
You should also make a Backup via the UI and keep it in safe place.

## Advanced

### Securing the WirtBot after setup

In order to make the WirtBot interace and API hidden on the Host machine simply **remove the port bindings** for port **80** and **3030**.

Both will still be reachable via the network that was created with the WirtBot at `wirtbot.CHOSEN_INTERNAL_ZONE_NAME`

**Make sure to update the api location in the Dashboard**.

### Host mode for more speed

In order to bypass a few network loops between the Host machine and the WirtBot container you can set

```
network_mode: host
```

in your `docker-compose.yml` file. This will directly bind the Host ports to the container and in addition the WireGuard interface will be created directly on the host as well.

### Mounting the configuration files to the host

For backup purposes you can mount the following files to your host:

- WireGuard config: `/etc/wireguard/server.conf`
- CoreDNS config: `/etc/coredns/Corefile`
