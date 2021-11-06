## 3.3.1
9a85900 Updates dependencies

3a69172 fix(CI): fixes lint error and makes sure to use wasm-pack 0.9.1 as 0.10.1 seems to cause errors inside of docker

b6aa7c0 fix(CI): use node:lts-buster container image to build WirtBot

8cb2ad2 Updates to 3.3.1

68b82f8 Updates dependencies

a2f1708 fix(Interface): readds the whole server config into the backip

## 3.3.1
68b82f8 Updates dependencies

a2f1708 fix(Interface): readds the whole server config into the backip

## 3.3.0
e8477c7 fix(Interface):Removes DNS hostname again, as the coredns forward plugin does not support it

## 3.3.0
e8477c7 fix(Interface):Removes DNS hostname again, as the coredns forward plugin does not support it

## 3.2.0
bb904d9 Updates to 3.2.0

3324645 chore: updates dependencies && adds npm audit fix to convenience script

a112c56 fix(Interface): fixes a few bugs discovered during testing and updates tests to use the new input field

a34b0fa fix(Interface): makes sure that DNS IP and hostname do not coexist

b935ec2 feature(Interface): Adds the possibility to specify a hostname for DNS resolution without TLS

## 3.0.2
9600353 fix(Interface): hides blink bug (newly added device shows up from state and from internal component state for a short time\) when a new device was added

## 3.0.1
809e8f1 fix(Interface): fix bug that always show 10 as next highst IP. Yup, a well known JavaScript trap of .sort()

7a40565 chore(Build Automation): Upgrades Rust version for WASM compilation to 1.54.0

696de66 chore: upgrades dependencies

2330527 fix(wireguard config generation): Makes sure that configurations that use hostnames only work as expected

10868a0 chore(Website): updates blogpost

33439bd Update README.md

## 3.0.0
bbecd64 feat(DNS): removes AdBlocking from WirtBot

b9b2351 feature(Adblock): removes adblock from WirtBot. including block hosts and block lists as those are better suited for a downstream service

714d6b8 fix(DNS): correctly parse IP addresses that include a 0

e074c56 Create SECURITY.md

## 2.8.0
9143ddf Remove old duplicate content from Changelog

8323bec fix: run all tests script default values, add test for whitespace in dns blocklists. Removes whitespace before saving

## 2.7.10
3f56d57 Updates dependencies

887b07f Updates the documentation

## 2.7.9
64227b7 fix(dependencies): Updates dependencies and make sure Website builds again with correct sass-loader for webpack v4

## 2.7.8

3c31ed1 Updates to 2.7.8

d0a0a4f chore(repo): auto generate CHANGELOG from commit messages

25e442e feat(website): removes about page. Updates FAQ. Simplifies Homepage

