# Troubleshooting

## Timeouts

If you experience timeouts on your network try to set the `MTU` to **1300**.

You can do this with the software you use on your device or by editing your config file manually and adding `MTU = 1300` in the `[Interface]` section, i.e.:

```
[Interface]
Address = 10.10.0.2
PrivateKey = asdasdasdasdasdasdasd\
MTU = 1300
```
