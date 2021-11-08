---
title: "22.11.20"
description: "WirtBot update 22.11.20"
lead: "WirtBot version 1.5 with complete test-system in place for the interface"
date: 2020-11-22T09:19:42+01:00
lastmod: 2020-11-22T09:19:42+01:00
draft: false
weight: 50
contributors: ["Maximilian Ehlers"]
---

# 22.11.20 WirtBot version 1.5

With version 1.5 many things changed on the Interface codebase and the System-Tests.

Instead of relying on [nightwatch](https://nightwatchjs.org/), the System-Tests are now written in NodeJS - leveraging the amazing [playwright](https://playwright.dev/) to interact with browsers.

The reason for the **nightwatch** to **playwright** change were tests of input validity.
While there seemed no straight forward way to achieve it in **nightwatch**, it became `page.$eval(element-selector, e => e.validity.valid)` with **playwright**.

This major rewrite and the refactoring in the Interface lead to a few bugs being squashed and all use cases of the WirtBot Interface being tested from End to End.
In addition all changes are now automatically saved. No more need for edit-toggles. Also the expert mode is gone, which means that all settings are now shown by default.
