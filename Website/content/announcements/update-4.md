update 4

- Remove fail2ban on SSH for internal network. Does not seem necessary. Could be configurable? I simply locked myself out for 6 hours. annoying :D

- update dependencies -> Most notably tokio to 1.1.0 and warp to 0.3

- Fix bug where name change crashes the server. trace down to backup import failure. Keys were regenerated. Happened because on import all devices are removed and readded from Backup.
	Adding device function always regenerated the keys, as the function was intended for fresh devices only. It now checks for exisint keys and use those instead of recreating them

- Feedback whether or not update worked via Alerts

## Todo


- Escape password to allow ' in the PW of the user

- Change docker service names
