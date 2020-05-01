# Build a WirtBot from scratch

In this section I want to walk you through the whole setup process of a WirtBot.

That means:

- renting a server in a data center
- setting it up with the WirtBot

Please note that there is a convenience script to do all of this for you automatically at.

## Renting a server

The first step in getting your WirtBot is to rent a server from any provider that you like. Depending on the size of the network you might want to choose an accordingly fast machine.

For starting out I recommend the cheapest VPS that you can find.

My personal recommendation would be the [Hetzner Cloud VPS](https://www.hetzner.com/cloud) for ~3 Euros a month.

Depending on the provider you choose the process of renting the server will differ.

Just follow through your choosen providers process and return here when you have the [public IP](/docs/faq) and your access credentials.
**MAKE SURE TO CHOOSE DEBIAN 10 when asked for an operating system!**

## Getting a name for your server

Remembering your servers public IP address is cumbersome modern techniques on the internet rely on Domain names instead.

So what is a domain name?
Well, its basically all the URLs that you know. `google.com`, `wirt.network` etc.

Having a domain name attached to your server makes it much easier to find it and to identify it as yours.

Unfortunately you need to pay a company to give you one of these, but on the upside you can choose whatever you want.

Simply check [https://namecheap.com](https://namecheap.com) for a name you like.

Once you purchased it head over to its settings and follow [this tutorial](https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain) to add the public IP address of your server as the `@` A record.

That means a record of **Type A** with a **Host @** and **Value your_servers_public_ip**.

Done with this step. It might take a few minutes for this change to get broadcasted to the internet.

## Accessing the server

This tutorial will only focus on using [SSH](https://www.ssh.com/ssh/).

Depending on the operating system of your laptop you will have to use different software.

TODO: add screenshot

### Mac and Linux

- Open the terminal program
- Type `ssh root@DOMAIN_NAME` where `DOMAIN_NAME` is the **name** that you purchased in the previous step.

That is it already! You are now connected to **YOUR** rented server in a data center, directly from your computer.
We can now start with actual installation of the WirtBot.

### Windows

Unfortunately I do not have access to a machine with Windows.

From my knowledge you need to use a programm called [PuTTY](https://www.ssh.com/ssh/putty/) to connect to your server.

If you do use Windows and are setting up a WirtBot I would love to add your experiences here. Screenshots would be great as well!

### Installing the WirtBot

There are 2 ways you can continue at this point.

Either choose the [expert setup](/docs/expert-setup), which will go into a lot of details,

OR

Simply run the following command on your server:

```

```

It will ask you for a new password with exactly 64 characters (use a Password Manager for this) and then do all the setup for you automatically!

Note that the expert setup can further increase the security of your WirtBot by removing the need to use passwords. It is also more technical concepts to understand though.
