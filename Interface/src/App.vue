<template>
  <!-- Document how to use these classes in every component for device specific styling  -->
  <div :class="{ app: true }">
    <Header />
    <Alerts id="alerts" />
    <main id="app-window" v-if="isConnectedToWirtBot">
      <router-view></router-view>
    </main>
    <FirstUse v-else>lets go</FirstUse>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "components/Header";
import Footer from "components/Footer";
import Alerts from "components/Alerts";
import FirstUse from "./pages/FirstUse/FirstUse";

export default {
  props: {
    source: String,
  },
  components: { Header, Alerts, Footer, FirstUse },
  data: () => ({
    drawer: null,
    file: null,
  }),
  computed: {
    alerts() {
      return this.$store.getters["alerts/alerts"];
    },
    isConnectedToWirtBot(){
      return !this.$store.state.dashboard.firstUse || this.$store.state.keys.private && this.$store.state.keys.public
    }
  },
  methods: {
    hideAlert(alert) {
      this.$store.commit("alerts/remove", alert.id);
    },
  },
  watch: {},
};
</script>

<style lang="scss">
@import "~@/styles/styles.scss";

.app {
  height: 100%;
  width: 100vw;
  max-width: 1100px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  margin-left: auto;
  margin-right: auto;
}

#app-window {
  display: flex;
  width: 100%;
  flex: 1;
}

#alerts {
  position: fixed;
  top: $spacing-small;
  right: $spacing-small;
  width: 30vw;
}

.desktop {
  & #app-window {
    margin-top: $spacing-large;
    height: calc(100% - #{$spacing-large});
  }
}
</style>
