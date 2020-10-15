const path = require('path');

module.exports = {
  base: "/",
  port: 9090,
  title: "WirtBot, your LAN in the cloud",
  themeConfig: {
    logo: "/logo.svg",
    locales: {
      "/": {
        sidebar: {
          "/docs/": [
            ["", "What is it?"],
            ["what-can-i-do-with-wirt", "What can you do with Wirt?"],
            ["setup", "Setup"],
            ["join-a-network", "Join a network"],
            ["faq", "FAQ"],
            ["issues", "New features & Bugs"],
            ["shoutouts", "Shoutouts"],
          ],
        },
        nav: [
          { text: "Documentation", link: "/docs/" },
          { text: "About", link: "/about" }
        ],
      },
      //   "/de/": {
      //     "/": {
      //       nav: [{ text: "Back to the App", link: "/" }],
      //       sidebar: [
      //         ["/", "Intro"],
      //         ["/beginner", "Beginner Erklaerung"],
      //         ["/expert", "Uebersicht fuer Experten"],
      //         ["/server", "Wireguard Server"],
      //         ["/faq", "FAQ"]
      //       ]
      //     }
      //   }
    },
  },
  locales: {
    "/": {
      lang: "English",
      title: "WirtBot",
      description: "Connect all your devices",
    },
    // "/de/": {
    //   lang: "Deutsch",
    //   title: "Wirt",
    //   description: "Dein Netz im Netz"
    // }
  },
  scss: {
    additionalData: `@import "shared-styles/variables.scss";`,
  },
  chainWebpack: (config, isServer) => {
    config.resolve.alias
      .set('shared-styles', path.join(__dirname, '../../../shared-libs/styles'))
      .set('shared-components', path.join(__dirname, "../../../shared-libs/components"))
  }
};
