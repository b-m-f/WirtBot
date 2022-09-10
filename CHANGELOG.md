## 3.8.11
3f3de6b [Fix] makes HTTPS interface config point to correct SSL artifact path

6ab0697 [CI] remove runner again. Got stuck too often

## 3.8.10
7bbc52d [CI] try another quick runner

## 3.8.9
a0ca577 [Fix] Changes Variables and adds hardcoded expected SSL KEY and Chain locations for interface and core

## 3.8.8
2693d88 [CI] switches to buildah for local release task. Switch back to standard runner

## 3.8.7
93b19ba Updates to 3.8.7

efa04d2 Updates to 3.8.6

051b8fc [Bug] Fixes closing fi

## 3.8.7
efa04d2 Updates to 3.8.6

051b8fc [Bug] Fixes closing fi

## 3.8.6
051b8fc [Bug] Fixes closing fi

## 3.8.6
b0ed46c [Bug]: Fixes typo in entrypoiny

## 3.8.5
d22de90 Updates to 3.8.4

d120c84 Try out Buildjet runner once more

aa50746 Updates WirtBot entrypoint script

## 3.8.4
d120c84 Try out Buildjet runner once more

aa50746 Updates WirtBot entrypoint script

## 3.8.4
4eca939 Restores default runner

## 3.8.3
922c47e Adds correct runs-on statement

## 3.8.2
8ea91f1 Updates Rust version

## 3.8.1
93df7d1 Run CI on external Buildjet runnre

63ab138 Fixes buildah task to run inside toolboxes

## 3.8.0
4390120 Adds ssl distinction between interface and core

df4f1f1 chore(deps): bump eventsource from 1.1.0 to 1.1.1 in /Website

6db7c06 Update README.md

3df0c7b Add files via upload

88dd2bb Add files via upload

6a229b8 Update HomePageEnglish.vue

d66f378 chore: Adds screenshot of new version

283a23b Fixes website build

5666315 fix: website build fixed by staying on webpack 4

2b0973d Update README.md

2ade4d0 Update README.md

f0758bd Update README.md

## 3.7.1
ad1221e fix: Adds wireguard-tools into container, adds i18n loader from devdependencies to normal deps

69049b3 fix: Duplicate version

4989dc9 fix: Use new version to create signature from bytes

3805f13 fix: access locales via their default export

7aae101 chore: Upgrades all dependencies

15c9e04 fix: Uses latest npm to install packages and audit fix --force them. Makes i18n work with the versions installed with it

5a077cf fix: Declares event that checkbox emits

ac9c902 fix: fixes typo introduced by previous search and replace

9e4e039 chore: adds info on how to execute tests locally

eb48fd5 fix: Uses new store creation via function and correctly declares event emissions

de1863c fix: uses i18n.global object for API alerts.

25a21a5 fix: uses new locator syntax of playwright

e786721 fix: Accesses t function for translation off of global object inside i18n

1db1d4d fix: updates rust for interface build to 1.58

1bbf30d fix: Upgrades depencies that moved to new repos, removes unnecessary linting configuration

790cc90 fix: Updates main app components to work with new Vue3 style

4672289 fix: enable asyncWebAssembly experiment via webpack config for webpack 5

6e2a6d3 fix: renames buildah task to build-test for quickly building test images

4104c2c chore: Updates dependencies

## 3.6.2
1fbab6a feat: Activates the coredns local plugin by default

17d4808 CI: adds wireguard-tools from debian upstream. Adds buildah based build multi-arch task

fcba4b1 WIP: change from docker buildx to buildah

## 3.6.1
44061cb Upgrades final image to run in bullseye

## 3.6.0
3350a4c Update website

f928fc1 fix: update analytics script

1e5d7b4 Updates analytics script on website

5f3e628 Updates to 3.5.1

2cc47e4 feat(ci): updates path of CI to point to vuepress output directory to deply website

7f6908d feat(Website): moves shared components into website as well and removes the shared-libs

5d72c5b feat(Interface): moves shared-components into the Interface for better encapsulation

268fe6a feat(website): reverts to vuepress website as it fits the theming better

5d2efdf fix(ci): gives website deploy job a better name and fixes wrong path traversal on npm run build

36112f4 feat(ci): adds github page release job for the new website

1401f3d feat(website): removes old website and uses new hugo+doks based one

cd0afb1 feat(website): Converts docs to hugo+doks website

7ef4496 feat(website): Updates the pages that were already there with correct information

1cd0864 feat(website): includes https://github.com/h-enk/doks to be the base for the new website and migrates over all the blog posts

## 3.5.1
c317188 feat(ci): updates path of CI to point to vuepress output directory to deply website

161cfd8 feat(Website): moves shared components into website as well and removes the shared-libs

debd8da feat(Interface): moves shared-components into the Interface for better encapsulation

a342cf8 feat(website): reverts to vuepress website as it fits the theming better

5d2efdf fix(ci): gives website deploy job a better name and fixes wrong path traversal on npm run build

36112f4 feat(ci): adds github page release job for the new website

1401f3d feat(website): removes old website and uses new hugo+doks based one

cd0afb1 feat(website): Converts docs to hugo+doks website

7ef4496 feat(website): Updates the pages that were already there with correct information

1cd0864 feat(website): includes https://github.com/h-enk/doks to be the base for the new website and migrates over all the blog posts

## 3.5.0
fcf88e2 feat(core): enables IPv4 forwarding in the container

8b6ad1c Updates to 3.4.0

1735bee Updates README with ports for metrics

7fc173d feat(Interface): adds friendly name to config for prometheus_wireguard_exporter

## 3.4.0
e34a477 Updates README with ports for metrics

3d83e77 feat(Interface): adds friendly name to config for prometheus_wireguard_exporter

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

