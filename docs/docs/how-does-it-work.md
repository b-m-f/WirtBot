# How does Wirt work?

Wirt is possible due to a technology called [WireGuard®](https://wireguard.com).

WireGuard has the nice properties of allowing cryptographically secured traffic, **ONLY** between devices in a network.

## WirtBot®

The WirtBot is the part of the Wirt system that is responsible for handling the actual traffic routing between the devices.

Your device, lets say your mobile phone, will be configured to send any traffic that is meant to reach your Wirt network to the WirtBot.

The WirtBot will then find the correct device you are trying to reach, maybe a personal [NextCloud®](https://nextcloud.com), and forward the traffic to it.

## WirtUI

The [WirtUI](https://wirt.network) is a modern web app designed to make your life a bit easier.
Through it you can quickly add new devices to your network and have these changes automatically applied on your WirtBot.

This is again made possible by cryptographically signing the communication between the WirtUI and the WirtBot and using a secured transport layer (HTTPS).

What this means is that only your browser will be able to communicate with your WirtBot, while allowing to stay up to date with the newest version of the WirtUI automatically.
