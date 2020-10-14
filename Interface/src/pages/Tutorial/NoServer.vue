<template>
  <div :class="{ mobile: isMobilePage }">
    <h1>{{ $t("tutorial.noserver.title") }}</h1>
    <slot></slot>
    <Card padded id="server-setup">
      <div v-if="activeIndex == 1" id="options">
        <h2>{{ $t("tutorial.noserver.needServer") }}</h2>
        <p id="option-info">{{ $t("tutorial.noserver.optionInfo") }}</p>
        <div id="self-setup">
          <div class="option">
            <a href="/docs/setup" target="_blank" rel="noopener noreferrer">
              <Button id="no" empty>
                {{ $t("tutorial.noserver.selfSetup.goToDocs") }}
              </Button>
            </a>
            <ul class="option-infos">
              <li>
                <p>{{ $t("tutorial.noserver.selfSetup.key") + ": " }}</p>
                <code @click="copyToClipBoard">{{ key }}</code>
              </li>
              <li>
                <p>{{ $t("tutorial.noserver.selfSetup.returnHere") }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import Button from "shared-components/Button";
import Card from "shared-components/Card";

export default {
  components: { Button, Card },
  data() {
    return {
      ip: [undefined, undefined, undefined, undefined],
      port: undefined,
    };
  },
  computed: {
    activeIndex() {
      return this.$route.meta.activeIndex;
    },
    isMobilePage() {
      return this.$store.state.websiteBeingViewedOnMobileDevice;
    },
    key() {
      if (this.$store.state.keys) {
        return this.$store.state.keys["public_key"];
      } else {
        this.$store.dispatch("generateKeys");
        return "";
      }
    },
  },
  methods: {
    async copyToClipBoard() {
      try {
        await navigator.clipboard.writeText(this.key);
        this.$store.dispatch(
          "alerts/addSuccess",
          `${this.$t("success.copyToClipBoard")}`
        );
      } catch (error) {
        this.$store.dispatch(
          "alerts/addError",
          `${this.$t("errors.copyFailed")}`
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
}
#server-setup {
  margin-top: calc(#{$spacing-large} * 2);
  #options {
    & #option-info {
      margin-bottom: $spacing-large;
    }

    & .option {
      & .option-infos {
        margin-top: $spacing-medium;
        & li {
          list-style-type: disc;
          list-style-position: inside;
          & p {
            display: inline;
          }

          & code {
            cursor: copy;
            background-color: $grey-light;
          }

          &::marker {
            color: $secondary;
          }
        }
      }
    }
  }
}
</style>
