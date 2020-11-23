const path = require('path');

module.exports = {
  base: "/",
  port: 9090,
  title: "WirtBot, your LAN in the cloud",
  head: [
    ['noscript', {}, `<img src="https://analytics.ehlers.berlin/ingress/925003fb-cd79-4dee-8b21-f32c7d00f978/pixel.gif">`],
    ['script', { src: 'https://analytics.ehlers.berlin/ingress/925003fb-cd79-4dee-8b21-f32c7d00f978/script.js' }]
  ],
  themeConfig: {
    logo: "/logo.svg",
    locales: {
      "/": {
        sidebar: {
          "/documentation/": [
            ["", "What is it?"],
            ["what-can-i-do-with-wirt", "What can you do with Wirt?"],
            ["setup", "Setup"],
            ["join-a-network", "Join a network"],
            ["system-overview", "System Overview"],
            ["faq", "FAQ"],
            ["issues", "New features & Bugs"],
          ],
          "/announcements/": [
            ["22-11-20", "22.11.20: Installer change and major Interface + System-Tests refactor"],
            ["8-11-20", "8.11.20: New name for installer binary"],
            ["31-10-20", "31.10.20: All aboard the container"],
            ["21-10-20", "21.10.20: Please update your installer"],
          ]
        },
        nav: [
          { text: "Github", link: "https://github.com/b-m-f/WirtBot" },
          { text: "Documentation", link: "/documentation/" },
          { text: "Screenshots", link: "/screenshots" },
          { text: "Announcements", link: "/announcements/" },
          { text: "Developer Documentation", link: "/developer-documentation/" },
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
      .set('shared-styles', path.join(__dirname, '../../../Shared-Libs/styles'))
      .set('shared-components', path.join(__dirname, "../../../Shared-Libs/components"))
  }
};
