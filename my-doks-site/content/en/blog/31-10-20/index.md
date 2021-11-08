---
title: "31.10.20"
description: "Happy Halloween, all in one Container available"
lead: "WirtBot is now contained inside a single Docker container"
date: 2020-10-31T09:19:42+01:00
lastmod: 2020-10-31T09:19:42+01:00
draft: false
weight: 50
contributors: ["Maximilian Ehlers"]
---

# 31-10-20

Happy Halloween!

The WirtBot build-system has been updated and the whole system, including WireGuard, are running in a single Docker container.

To achieve this the container needs to be run with `NET_ADMIN` capabilities.

The Readme and setup documentation has been updated.

If you are already running a WirtBot VPS and want to update do the following:

- Save your dasboard backup from [http://wirtbot.wirt.internal](http://wirtbot.wirt.internal)
- Rebuild a clean VPS with Debian 10

- Use new installer `@wirtbot/installer@1.1.0` to install a new server
  - copy Backup file into the directory where you run the installer
  - make sure your previous `wirtbot-installer.config.json` is also in the directory
  - choose the function to install from backup
  - wait for server to be installed
- In case the Server IP has not changed everything should be running the same as before the update. The dashboard is tied to your browser, so all settings are still present. In case something is out of date, edit and save a device to trigger an update from the Dashboard to the WirtBot
