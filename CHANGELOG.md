## 2.3.3
- Sets initial dummy WirtBot config in container to bind the correct port.
- Makes setup easier by removing flags that only matter for container internal settings.
- Fix backup <=> version error. The interface got its version from saved state rather than from the actual Interface version that is running

## 2.3.2
Fixes DNSoverTLS forwarding

## 2.2.6

- make UID and GID inside Docker container configurable
