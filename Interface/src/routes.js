import Vue from "vue";
import VueRouter from "vue-router";

import Dashboard from "./pages/Dashboard/Dashboard";

const routes = [
  { path: "/", component: Dashboard, name: "dashboard" },
];

const router = new VueRouter({
  mode: "history",
  routes,
});
Vue.use(VueRouter);

export default router;
