import Vue from "vue";
import App from "./App.vue";

import router from "./routes";
import store from "./store";
import i18n from "./i18n";
import icons from "./icons";

Vue.component("font-awesome-icon", icons);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
