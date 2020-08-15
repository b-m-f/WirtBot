# Updating to a new version

## Interface
When the Interface has a new version it will automatically be on [https://wirt.network](https://wirt.network). 
If things you are expecting to see are missing try to export and reimport your settings. This should apply all necessary changes to your configuration and show the expected things.

If this did not yet help, clear your cache and reimport the settings again.

## WirtBot
Simply download the latest executable, put it in the right place and restart your `systemd` service with `systemctl restart wirtbot`.

If you have used the [ansible playbook](/setup#ansible) to install the server, simply use it again and eveything should be done automatically.