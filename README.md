![Wirt logo](Interface/public/logo.svg)

# Wirt

![Build status badge](https://github.com/b-m-f/Wirt/workflows/Wirt-Interface/badge.svg)

Welcome to the documentation for [Wirt](https://wirt.network).

This is the main repository for:

- Wirt documentation
- Wirt developer documentation
- WirtBot
- Interface

This web application is written with [VueJS](https://vuejs.org/) and [rustwasm](https://rustwasm.github.io/docs/book/) .
All documentation is written in markdown, using [vuepress](vuepress.vuejs.org/) to create the site

The WirtBot is written in [Rust](https://www.rust-lang.org/).

![Small video to demonstrate the Tutorial](media/wirt_tutorial.gif)

## Features

- Automatic generation of WireGuard configurations, including keys, directly in the browser
- Every configuration in the network is kept updated on changes
- If configured, all configurations will automatically be sent to the [WirtBot](https://github.com/b-m-f/wirt/WirtBot)
- WirtBot then automatically apply the configuration and immediately activate it
- Export and Import feature to keep track of multiple networks and generate Backups
- Automatic state retention in local storage
- Absolutely no tracking, each application is unique to a users browser
- Communication is guaranteed to only be between linked Interface and WirtBot by cryptographic signatures

## Contributing

You want to help out making the frontend better, or add new features? **AWESOME**!.

Please feel free to open up an issue here in Github to discuss what you would want to do, and what kind of help we can give you.
I also encourage you to ask questions! My goal is to document as many of those questions as I can, to allow more people to understand what is going on in the code.

Things that currently need help:

- Improve beginners documentation on what this application is and how to set it all up
- Documentation on how to use WireGuard on your devices -> i.e. How to connect an Android/iOS phone to the network
- Documentation for services that can be added to the network -> i.e. sharing Samba drives, streaming Media
- Testing of the DashBoard using [nightwatchjs](nightwatchjs.org/)
- Generating Mesh networks (multiple servers), that can each have a multitude of devices -> needs a state change to allow for `[servers]`
- Correct validation of `IPv6` inputs in the `DeviceRow` and `Widgets/Server` component
- State in Typescript
- Unit testing for rust code in wasm
- Testing the WirtBot using the hyper test helpers
- Include developer documentation into the Dockerfile and serve at `/developer-docs`
- anything you think can be better
- Translate it into a language that you know

Please check out the `developers-docs` directory for more details on the application.

## LICENSE

The WirtBot and Interface are licensed with `GNU Affero General Public License v3.0`

The documentation and Wirt logo are provided under `Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)`
