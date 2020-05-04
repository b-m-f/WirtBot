<template>
  <div id="tutorial-devices" :class="{ mobile: isMobilePage }">
    <h1 v-if="activeIndex == 4">{{ $t("tutorial.devices.header") }}</h1>
    <h1 v-if="activeIndex == 5">{{ $t("tutorial.devices.firstDeviceAdded") }}</h1>
    <div id="card-with-navigation">
      <div class="navigation-circle back" v-if="!isMobilePage">
        <router-link :to="{ name: steps[activeIndex + -1] }">
          <img src="/arrow-thick-left.svg" />
        </router-link>
        <span>{{ $t("global.navigation.back") }}</span>
      </div>
      <!-- Next two steps are in the card -->
      <Card id="device-card" :padded="!isMobilePage">
        <!--  Adding a device-->
        <div v-if="activeIndex == 4" id="add-device">
          <p>{{ $t("tutorial.devices.addDevice") }}</p>
          <DeviceTable
            ref="table"
            class="table"
            :devices="[{ id: undefined }]"
            @deviceSaved="checkDeviceExistsAndContinue"
          />
          <router-link :to="{ name: 'tutorial-done' }">
            <a id="skip">{{ $t("tutorial.devices.skip") }}</a>
          </router-link>
        </div>
        <!-- Device added succesfully -->
        <div v-if="activeIndex == 5" id="devices-finished">
          <DeviceTable class="table" :devices="[device]" />
          <p v-html="editDeviceText"></p>
          <router-link :to="{ name: 'tutorial-done' }">
            <Button id="finish" uppercase>
              {{
              $t("tutorial.devices.finish")
              }}
            </Button>
          </router-link>
        </div>
      </Card>
      <div class="navigation-circle next" v-if="!isMobilePage">
        <router-link :to="{ name: steps[activeIndex + 1] }">
          <img src="/arrow-thick-right.svg" />
        </router-link>
        <span>{{ $t("global.navigation.next") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Button from "../../components/Button";
import DeviceTable from "../../components/DeviceTable";
import Card from "../../components/Card";
import { getTranslationWithVariables } from "../../lib/helpers";

export default {
  components: { Button, Card, DeviceTable },
  computed: {
    activeIndex() {
      return this.$route.meta.activeIndex;
    },
    device() {
      return this.$store.state.devices[0];
    },
    isMobilePage() {
      return this.$store.state.websiteBeingViewedOnMobileDevice;
    },
    editDeviceText() {
      return getTranslationWithVariables(
        "tutorial.devices.finishEditHint",
        "dashboard",
        "<a href='dashboard'>Dashboard</a>"
      );
    }
  },
  data() {
    return {
      hasServer: undefined,
      steps: {
        3: "tutorial-server-port",
        4: "tutorial-device-form",
        5: "tutorial-device-success",
        6: "tutorial-done"
      }
    };
  },
  methods: {
    checkDeviceExistsAndContinue() {
      if (this.device) {
        this.$router.push({ name: "tutorial-device-success" });
      } else {
        this.$refs["table"].reportValidity();
      }
    }
  }
};
</script>

<style scoped lang="scss">
h1 {
  text-align: center;
}
p.configs {
  font-size: $font-medium;
}
button {
  &.done {
    margin-top: $spacing-medium;
  }
}

#card-with-navigation {
  margin-top: calc(#{$spacing-large} * 2);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  & .navigation-circle {
    &.next {
      margin-left: $spacing-medium;
    }
    &.back {
      margin-right: $spacing-medium;
    }
    & a {
      display: flex;
      justify-content: center;
      align-items: center;
      width: $spacing-large;
      height: $spacing-large;
      border-radius: $spacing-large;
      @include box-shadow-light;

      color: $black;
      text-decoration: none;
      & img {
        height: $spacing-small * 3;
      }
    }
    & span {
      display: block;
      margin-top: $spacing-medium;
    }
  }
  & #device-card {
    // width minues navigation knobs
    width: calc(100% - (#{$spacing-medium} + #{$spacing-large}) * 2);
    min-height: 20vh;
    margin-bottom: calc(#{$spacing-large} * 2);

    & #add-device {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: calc(#{$spacing-large} * 2);
      p {
        padding: calc(#{$spacing-large} * 2) $spacing-large;
      }

      & .table {
        width: 100%;
        margin-bottom: $spacing-large;
      }

      & .button {
        width: 30rem;
        max-width: 20vw;
        margin-bottom: $spacing-large;
      }
    }
    & #devices-finished {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: calc(#{$spacing-large} * 2);
      p {
        margin-bottom: $spacing-large;
      }

      & .table {
        width: 100%;
        margin-bottom: $spacing-large;
      }
      & .button {
        width: 30rem;
        max-width: 20vw;
        margin-bottom: $spacing-large;
      }
    }
  }
}

.mobile {
  & #card-with-navigation {
    & #device-card {
      // remove the navigation knobs width calculation
      width: 100%;
    }
  }
}

#intro {
  display: flex;
  flex-direction: column;

  & #next {
    margin-left: auto;
    margin-right: auto;
    width: 30rem;
    max-width: 20vw;
  }
  p {
    margin-bottom: $spacing-large;
  }
  & a {
    margin-top: $spacing-large;
    text-align: center;
  }
}
</style>
