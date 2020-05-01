import Vue from "vue";
import VueRouter from "vue-router";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import About from "./pages/About.md";
import TutorialPage from "./pages/Tutorial/TutorialPage";
import TutorialWelcome from "./pages/Tutorial/Welcome";
import TutorialServer from "./pages/Tutorial/Server";
import TutorialNoServer from "./pages/Tutorial/NoServer";
import TutorialDevices from "./pages/Tutorial/Devices";
import TutorialDone from "./pages/Tutorial/Done";

const routes = [
  { path: "/", component: Home, name: "home" },
  { path: "/dashboard", component: Dashboard, name: "dashboard" },
  { path: "/about", component: About, name: "about" },
  {
    path: "/tutorial",
    component: TutorialPage,
    children: [
      {
        path: "",
        component: TutorialWelcome,
        name: "tutorial-welcome",
      },
      {
        path: "no-server",
        component: TutorialNoServer,
        children: [
          {
            path: "",
            component: TutorialNoServer,
            name: "tutorial-choose-server",
            meta: { activeIndex: 1 },
          },
        ],
      },
      {
        path: "server",
        component: TutorialServer,
        children: [
          {
            path: "",
            component: TutorialServer,
            name: "tutorial-server-questionaire",
            meta: { activeIndex: 1 },
          },
          {
            path: "ip",
            component: TutorialServer,
            name: "tutorial-server-ip",
            meta: { activeIndex: 2 },
          },
          {
            path: "port",
            component: TutorialServer,
            name: "tutorial-server-port",
            meta: { activeIndex: 3 },
          },
        ],
      },
      {
        path: "devices",
        component: TutorialDevices,
        children: [
          {
            path: "add",
            component: TutorialDevices,
            name: "tutorial-device-form",
            meta: { activeIndex: 4 },
          },
          {
            path: "success",
            component: TutorialDevices,
            name: "tutorial-device-success",
            meta: { activeIndex: 5 },
          },
        ],
      },
      {
        path: "done",
        component: TutorialDone,
        name: "tutorial-done",
        meta: { activeIndex: 6 },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});
Vue.use(VueRouter);

export default router;
