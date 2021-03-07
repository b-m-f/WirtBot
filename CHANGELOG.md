## 2.5.0
- Includes IPv6 subnet changing via UI
- Possible to configure ignored DNS zones
- Adds Optional Ad Blocking
- Serves WireGuard and CoreDNS metrics
- Adds testing and improvements on store logic

## 2.4.0
- New Make task to spawn local setup, that is not dockerized to speed up writing tests
- Removes all JS detection of mobile screen size and uses media-queries only
- A few UI bugs have been squashed
- IPv4 is not an array of 4 numbers, but simply a string now. This makes it easier to pass around, as verification happens on the input component where it enters the system and stays in line with IPv6 being a string

## 2.3.3
- Sets initial dummy WirtBot config in container to bind the correct port.
- Makes setup easier by removing flags that only matter for container internal settings.
- Fix backup <=> version error. The interface got its version from saved state rather than from the actual Interface version that is running
- Highlights required inputs when adding device
- Makes sure that a missing IP is caught when trying to add a device

## 2.3.2
Fixes DNSoverTLS forwarding

## 2.2.6

- make UID and GID inside Docker container configurable
