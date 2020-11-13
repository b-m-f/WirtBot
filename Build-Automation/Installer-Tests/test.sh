#! /bin/bash

set -e

test_dir="tests/test-install-with-ssh-password"
install_mock="$test_dir/ansible_mock.js"

mv $install_mock /usr/bin/ansible-playbook
chmod +x /usr/bin/ansible-playbook
mv $test_dir/wirtbot-installer.config.json .

node dist/installer.js

test_dir="tests/test-update"
update_mock="$test_dir/ansible_mock.js"

mv $update_mock /usr/bin/ansible-playbook
chmod +x /usr/bin/ansible-playbook
mv $test_dir/wirtbot-installer.config.json .

node dist/installer.js