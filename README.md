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

You want to help out making Wirt better? **AWESOME**!.

Please feel free to open up an issue here in Github to discuss what you would want to do, and what kind of help we can give you.
I also encourage you to ask questions! My goal is to document as many of those questions as I can, to allow more people to understand what is going on in the code.

For an overview of things that need help check the [issues](https://github.com/b-m-f/wirt/issues).

Other things that need help:

- Translate it into a language that you know

Please check out the `developers-docs` directory for more details on the application.

## LICENSE

The WirtBot and Interface are licensed with `GNU Affero General Public License v3.0`

The documentation and Wirt logo are provided under `Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)`
