<template>
  <!-- Document how to use these classes in every component for device specific styling  -->
  <div :class="{ app: true, mobile: isMobilePage, desktop: !isMobilePage }">
    <Header />
    <Alerts id="alerts" />
    <main id="app-window">
      <router-view></router-view>
    </main>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";
import Alerts from "./components/Alerts";
import { assumedWidthThresholdToBeMobileDevice } from "./variables";
export default {
  props: {
    source: String,
  },
  components: { Header, Alerts, Footer },
  data: () => ({
    drawer: null,
    file: null,
  }),
  computed: {
    alerts() {
      return this.$store.getters["alerts/alerts"];
    },
    isMobilePage() {
      return this.$store.state.websiteBeingViewedOnMobileDevice;
    },
  },
  beforeCreate() {
    if (window.innerWidth < assumedWidthThresholdToBeMobileDevice) {
      this.$store.commit("setMobileView");
    } else {
      this.$store.commit("setNotMobileView");
    }
  },
  updated() {
    if (window.innerWidth < assumedWidthThresholdToBeMobileDevice) {
      this.$store.commit("setMobileView");
    } else {
      this.$store.commit("setNotMobileView");
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
  top: 0rem;
  width: 100vw;
  padding-top: $spacing-small;
}

.mobile {
  &.app {
    display: flex;
    flex-direction: column;
  }

  & #app-window {
    width: 100%;
  }
}

.desktop {
  & #app-window {
    margin-top: $spacing-large;
    height: calc(100% - #{$spacing-large});
  }
}
</style>
