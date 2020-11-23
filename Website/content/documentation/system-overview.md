# System Overview

## Interaction with the system

- Change in browser
- generate configurations in browser
- send changes + signature to core
- Core checks signature against a runtime publickey read from ENV
- core updates necessary files
- DNS change -> CoreDNS updates automatically every 10 seconds
- WireGuard -> file watcher in the Container -> starts custom script to flush the changes onto the interface
- Configurations from the Interface are immediately activated AND disactivated


## Installation