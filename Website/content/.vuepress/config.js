const path = require("path");

module.exports = {
  base: "/WirtBot/",
  port: 9090,
  title: "WirtBot, your LAN in the cloud",
  head: [
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
            ["11-01-23", "Update 7: Time to say goodbye"],
            ["update-6", "Update 6: More focus, less bugs"],
            ["update-5", "Update 5: Time to maintain"],
            ["update-4", "Update 4: WirtBot weight loss and a nasty bug"],
            ["update-3", "Update 3: With confidence into the unknown"],
            [
              "22-11-20",
              "22.11.20: Installer change and major Interface + System-Tests refactor",
            ],
            ["8-11-20", "8.11.20: New name for installer binary"],
            ["31-10-20", "31.10.20: All aboard the container"],
            ["21-10-20", "21.10.20: Please update your installer"],
            
          ],
        },
        nav: [
          { text: "Github", link: "https://github.com/b-m-f/WirtBot" },
          { text: "Documentation", link: "/documentation/" },
          { text: "Screenshots", link: "/screenshots" },
          { text: "Announcements", link: "/announcements/" },
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
      description: "Stay connected",
    },
    // "/de/": {
    //   lang: "Deutsch",
    //   title: "Wirt",
    //   description: "Dein Netz im Netz"
    // }
  },
  scss: {
    additionalData: `@import "styles/variables.scss";`,
  },
  chainWebpack: (config, isServer) => {
    config.resolve.alias
      .set("styles", path.join(__dirname, "./styles"))
      .set("components", path.join(__dirname, "./components"))
  },
};
