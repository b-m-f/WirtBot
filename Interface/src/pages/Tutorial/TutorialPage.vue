<template>
  <div
    id="tutorial-page"
    :class="{
      ['bar-before-card']: !showSections,
      mobile: isMobilePage,
    }"
  >
    <router-view>
      <TutorialBar
        :class="{
          ['tutorial-bar']: true,
        }"
        :steps="steps"
        :activeIndex="activeIndex"
        :showSections="showSections"
      />
    </router-view>
  </div>
</template>

<script>
import TutorialBar from "../../components/TutorialBar";
import Vue from "vue";
Vue.prototype.getActiveElement = () => {
  return window.document.activeElement;
};
export default {
  components: { TutorialBar },
  mounted() {},
  beforeUpdate() {
    // This removes the focus from the logo if tabs are used while only part of webpage is rerenderd
    this.getActiveElement().blur();
  },
  computed: {
    isMobilePage() {
      return this.$store.state.websiteBeingViewedOnMobileDevice;
    },
    activeIndex() {
      if (this.$route.name === "tutorial-welcome") {
        return 7;
      } else {
        return this.$route.meta.activeIndex;
      }
    },
    showSections() {
      if (
        this.activeIndex == 4 ||
        this.activeIndex == 7 ||
        this.$route.name === "tutorial-welcome"
      ) {
        return true;
      }
      return false;
    },
  },
  data() {
    return {
      steps: {
        ["Server set-up"]: 3,
        ["Add devices"]: 3,
        ["Network complete"]: 1,
      },
    };
  },
};
</script>

<style lang="scss">
#tutorial-page {
  width: calc(100% - #{$spacing-large} * 2 * 2);
  height: 100%;
  padding-left: $spacing-large * 2;
  padding-right: $spacing-large * 2;
  margin-top: $spacing-large;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &.mobile {
    width: calc(100% - #{$spacing-x-small} * 2 * 2);
    padding-left: $spacing-x-small * 2;
    padding-right: $spacing-x-small * 2;
  }

  &.bar-before-card {
    flex-direction: column-reverse;
  }
}
</style>
