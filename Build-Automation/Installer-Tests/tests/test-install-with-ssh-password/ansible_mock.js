#! /usr/local/bin/node

const assert = require('assert');

const args = process.argv.slice(2).join(' ');

assert.match(args, /--user root/);
assert.match(args, /--ask-pass/);
assert.match(args, /wirtui_public_key=".{40,50}"/);
assert.match(args, /maintainer_username=wirtbot/);
assert.match(args, /maintainer_password=test/);
assert.match(args, /maintainer_ssh_key="ssh-ed25519 test123"/);
assert.match(args, /initial_server_config=".*"/s);
assert.match(args, /initial_dns_config=".*"/s);


console.log("Test for simple install ran successfully")