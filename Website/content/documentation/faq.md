# Frequently asked questions

## Errors during install

### Server has an initial setup that needs to be completed

Seeing this:
```
fatal: [1.1.1.1]: UNREACHABLE! => {"changed": false, "msg": "Failed to create temporary directory.In some cases, you may have been able to authenticate and did not have permissions on the target directory. Consider changing the remote tmp path in ansible.cfg to a path rooted in \"/tmp\", for more error information use -vvv. Failed command was: ( umask 77 && mkdir -p \"` echo ~/.ansible/tmp `\"&& mkdir \"` echo ~/.ansible/tmp/ansible-tmp-1602519889.8072917-52551-67685665562680 `\" && echo ansible-tmp-1602519889.8072917-52551-67685665562680=\"` echo ~/.ansible/tmp/ansible-tmp-1602519889.8072917-52551-67685665562680 `\" ), exited with result 1", "unreachable": true}
```

Make sure that you have connected to you server via SSH at least once succesfully before running the installer.


## Who is building this?

My name is [Maximilian Ehlers](https://ehlers.berlin). A developer living in Berlin.

The initial UI design from is [Tabitha Tan](https://tabithatxc.com), a UX researcher from Singapore.