import {createApp,h} from "vue";
import App from "./App.vue";

import router from "./routes";
import store from "./store";
import i18n from "./i18n";
import icons from "./icons";

const app = createApp({
  router,
  store,
  i18n,
  render: () => h(App)
})

app.component("font-awesome-icon", icons);

app.config.productionTip = false;

app.use(router);
app.use(store);
app.use(i18n);
app.use(icons);

app.mount("#app");
