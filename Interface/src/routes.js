import {createRouter, createWebHashHistory} from "vue-router";

import Dashboard from "./pages/Dashboard/Dashboard";

const routes = [
  { path: "/", component: Dashboard, name: "dashboard" },
];

const router = new createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
