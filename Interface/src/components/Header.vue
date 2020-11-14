<template>
  <header id="app-header">
    <div
      :class="{ container: true, desktop: !isMobilePage, mobile: isMobilePage }"
    >
      <div v-if="isMobilePage" class="mobile-head">
        <div id="logo">
          <router-link to="/">
            <img src="logo.svg" alt="WirtBot logo" />
          </router-link>
        </div>
        <button class="toggle-nav" @click.prevent="toggleMobileNavigation">
          <font-awesome-icon :icon="['fas', 'bars']" />
        </button>
      </div>
      <nav v-else>
        <div id="left">
          <div id="logo">
            <router-link to="/">
              <img src="logo.svg" alt="WirtBot logo" />
            </router-link>
          </div>
          <div id="documentation">
            <a
              href="https://wirtbot.com/documentation"
              target="_blank"
              rel="noopener noreferrer"
              >{{ $t("header.documentation") }}</a
            >
          </div>
          <div id="github">
            <a
              href="https://github.com/b-m-f/WirtBot"
              target="_blank"
              rel="noopener noreferrer"
              >GitHub</a
            >
          </div>
        </div>
        <div id="right"></div>
      </nav>
      <nav v-if="mobileNavigationExpanded" class="mobile-navigation">
        <div id="documentation">
          <a
            href="https://wirtbot.com/documentation"
            target="_blank"
            rel="noopener noreferrer"
            >{{ $t("header.documentation") }}</a
          >
        </div>
        <div id="github">
          <a
            href="https://github.com/b-m-f/WirtBot"
            target="_blank"
            rel="noopener noreferrer"
            >GitHub</a
          >
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  components: {},
  data() {
    return { mobileNavigationExpanded: false };
  },
  computed: {
    isMobilePage() {
      return this.$store.state.websiteBeingViewedOnMobileDevice;
    },
  },
  methods: {
    toggleMobileNavigation() {
      this.mobileNavigationExpanded = !this.mobileNavigationExpanded;
    },
  },
};
</script>

<style scoped lang="scss">
#app-header {
  display: flex;
  min-height: 4rem;
  margin-top: $spacing-medium;
  width: 100%;
}
#logo {
  display: flex;
  align-items: center;
  height: 100%;
  margin-right: $spacing-x-large;

  & img {
    height: 4rem;
    width: 10rem;
    &:hover {
      background: $secondary;
    }
    &:focus {
      background: $secondary;
    }
  }
}

.container {
  width: calc(100% - #{$spacing-medium});

  display: flex;
  & a {
    color: $black;
    text-decoration: none;
  }
}

.mobile {
  & #logo {
    & img {
      margin-left: $spacing-small;
    }
  }
  &.container {
    flex-direction: column;
    margin-top: $spacing-medium;
    & .mobile-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      & .toggle-nav {
        min-height: 0;
        border: none;
        & svg {
          width: 3rem;
          height: 3rem;
        }
        background: $white;
      }
    }
  }
  & nav.mobile-navigation {
    margin-top: $spacing-medium;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-evenly;
    min-height: 9rem;
    & .button {
      max-width: 14rem;
      height: 2rem;
    }

    & a {
      font-size: $heading-medium;
      &.router-link-active {
        color: $secondary;
      }
    }
  }
}

.desktop {
  &.container {
    & nav {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-transform: uppercase;
      flex-wrap: 1;

      & a {
        font-size: $heading-medium;
        &:hover {
          color: $secondary;
        }
        &:focus {
          color: $secondary;
        }
        &.router-link-active {
          color: $secondary;
        }
      }

      & .button {
        max-width: 14rem;
        height: 2rem;
      }
      & #left {
        display: flex;
        justify-content: space-around;
        align-items: center;
        & div {
          margin-right: $spacing-medium;

          &:last-child {
            margin-right: 0;
          }
        }
      }

      & #right {
        display: flex;
        align-items: center;

        & .button {
          margin-left: $spacing-medium;
        }
      }
    }
  }
}
</style>
