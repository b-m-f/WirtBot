# Setup

## WirtBot®

So you want a WirtBot, I can totally understand that.

You will need a few things to be able to set one up.

### Prerequisites
- A server with a public IP on the internet. Simply rent a cheap VPS
- Root access on this server
- Knowledge of how to execute commands on the terminal

When that is all sorted make sure that you have an SSH key. 
If you do not have one yet you can follow [this tutorial](https://www.ssh.com/ssh/keygen/).
You will need the content of the `.pub` file that will be created. The installer will ask for the contents of that file.


### Dependencies

The following programs are needed for the initail install of the WirtBot and to keep it up to date later on.

- [ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html)
- [sshpass](https://gist.github.com/arunoda/7790979) (necessary to login via SSH to your servers root user via password for the setup)
- [node](https://nodejs.org/en/download/) with `npm`


### Installer
Alright, time to get the installer: `npm install -g @wirtbot/installer`. 

Once installed run `wirt-installer` and the installer will now take you through the rest of the setup.
After answering all the questions wait until the setup is done, this can take up to **20 minutes**. Just be patient and follow the things that are printed to the terminal if you like to know what is happening.

And then you are done with the first part. Congrats, your private WirtBot is set up.

**The installer will have created a few files in the directory you ran it in. Save them to make future updating a breeze!**

### First access
But how do you access it? After all the WirtBot is completely hidden on the normal internet.

Simple: during the setup an initial network is set up automatically that you can join with the `UseThisWireGuardConfigurationToConnectToYourWirtBot.conf` file that was created by the installer.
Use this with the WireGuard® client for your system, you can check [this site](/documentation/join-a-network) and hopefully it will have a guide for your operating system as well.

To test that everything worked head to [wirtbot.wirt.internal](http://wirtbot.wirt.internal). 
This should be taking you to the, still empty, WirtBot interface.

### Getting some data into the interface

So the Dashboard is empty, but a network already exists. How do get access to that information?

At the bottom you will find the `import` functionality.
Choose the `ImportThisFileIntoYourWirtBotInterface.json` that the installer created and import it.

**Do not skip this import, besides the initial network configuration this imports cryptographic keys that make sure that only your computer can configure the WirtBot, and everyone else in your network simply sees an empty Dashboard**.


Congrats. You are done, or well, ready to go and build the network of your dreams!



Good luck, have fun and maybe share a few cool projects you were able to put into existence.

#### Updating

Run `npm install -g @wirtbot/installer` to update the installer with the newest changes.

Now run it with `wirt-installer` and choose the update option.
