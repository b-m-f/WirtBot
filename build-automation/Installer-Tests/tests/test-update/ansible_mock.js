#! /usr/local/bin/node

const assert = require('assert');

const args = process.argv.slice(2).join(' ');

assert.match(args, /--user wirtbot/);
assert.match(args, /wirtui_public_key="test123"/);
assert.match(args, /maintainer_username=wirtbot/);
assert.match(args, /maintainer_ssh_key="ssh-ed25519 test123"/);
assert.match(args, /--private-key ~\/.ssh\/wirtbot/);

console.log("Test for simple update ran successfully")