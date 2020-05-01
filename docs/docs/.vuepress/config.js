module.exports = {
  base: "/docs/",
  port: 9090,
  title: "Wirt documentation",
  themeConfig: {
    locales: {
      "/": {
        nav: [{ text: "Back to the App", link: "https://wirt.network" }],
        sidebar: [
          ["/", "What is it?"],
          ["/what-can-i-do-with-wirt", "What can you do with Wirt?"],
          ["/how-does-it-work", "How does it work?"],
          ["/setup", "Setup"],
          ["/ui", "WirtUI"],
          ["/faq", "FAQ"],
          ["/issues", "New features & Bugs"],
          ["/shoutouts", "Shoutouts"],
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
      title: "Wirt",
      description: "Connect all your devices",
    },
    // "/de/": {
    //   lang: "Deutsch",
    //   title: "Wirt",
    //   description: "Dein Netz im Netz"
    // }
  },
};
