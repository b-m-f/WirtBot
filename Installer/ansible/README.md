# Wirt WireGuard bot

Ansible script to set up a security improved **Debian 10** version for Wirt.
This internal version includes certbot to use with a valid SSL from letsencrypt

## Features

- SSH key from AWS used to login. Password auth disabled.
- Enable maintenance user for maintenance with ssh key provided
- Firewall only allows Port 22, 3030, Wireguard port 21212, 80 and 443
- installs certbot
- Install fail2ban
- install wireguard
- Sets up user to run wirt adapter
- Enable script to reload wireguard on change of config
- disable login for wirt adapter user

## Usage

This should reflect the normal WirtBot.

- Generate WireGuard config on wirt.network
- Put server configuration to `tasks/templates/server.conf.j2`
- Call `ansible-playbook -i SERVER_IP, ansible/main.yml --extra-vars wirt_public_key='${publicKey}' -e 'ansible_python_interpreter=/usr/bin/python3' --ssh-common-args='-o StrictHostKeyChecking=no'`

- Get SSL certificate from letsencrypt
- Create an after hook that copies the certificates into a location the adapter can read from
  ```/etc/letsencrypt/renewal-hooks/post
  #! /bin/bash
  cp -T -r -L /etc/letsencrypt/live/ /home/wirt/live
  chown wirt:wirt -R /home/wirt/live
  ```
- Wirt-adapter will need to be restarted after generating the SSL files with letsecnrypt certbot
