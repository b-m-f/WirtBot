<template>
  <div :class="{ page: true, mobile: isMobilePage }">
    <div id="top-bar">
      <h1>{{ $t("dashboard.title") }}</h1>
      <div id="expert-mode">
        <h2 v-if="expertMode">
          {{ $t("dashboard.widgets.devices.expertWarning") }}
        </h2>
        <label for="expert">{{ $t("dashboard.widgets.server.expert") }}</label>
        <input
          type="checkbox"
          class="switch"
          name="expert"
          id="expert"
          :value="expertMode"
          @change="(e) => updateExpertMode(e.target.checked)"
        />
      </div>
    </div>
    <AccentedCard
      padded
      class="message"
      type="info"
      v-for="(message, index) in messages"
      :key="`dashboard-message-${index}`"
    >
      <button @click="removeMessage(message)" class="close-message">X</button>
      <h2>{{ message.title }}</h2>
      <p>{{ message.text }}</p>
      <router-link v-if="message.link.name" :to="{ name: message.link.name }">
        <p>{{ message.link.text }}</p>
      </router-link>
      <a v-if="message.link.url" :href="message.link.url">
        <p>{{ message.link.text }}</p>
      </a>
    </AccentedCard>
    <Card
      class="widget"
      :padded="!isMobilePage"
      v-for="(widget, index) in widgets"
      :key="`dashboard-widget-${index}`"
    >
      <component :expertMode="expertMode" :is="widget"></component>
    </Card>
  </div>
</template>

<script>
import { downloadText } from "../../lib/download";
import AccentedCard from "shared-components/AccentedCard";
import Card from "shared-components/Card";
import { WHY_NO_LOGIN, REGULAR_BACKUP } from "../../lib/messages";
import NetworkWidget from "../../Widgets/Dashboard/Network";
import ServerWidget from "../../Widgets/Dashboard/Server";
import DeviceWidget from "../../Widgets/Dashboard/Devices";
import SettingsWidget from "../../Widgets/Dashboard/Settings";

const availableWidgets = {
  network: NetworkWidget,
  server: ServerWidget,
  devices: DeviceWidget,
  settings: SettingsWidget,
};

export default {
  components: { AccentedCard, Card },
  data() {
    return {};
  },
  computed: {
    devices() {
      return this.$store.state.devices;
    },
    messages() {
      return this.$store.state.dashboard.messages;
    },
    widgets() {
      return this.$store.state.dashboard.widgets.map((widget) => {
        return availableWidgets[widget];
      });
    },
    server() {
      return this.$store.state.server;
    },
    isMobilePage() {
      return this.$store.state.websiteBeingViewedOnMobileDevice;
    },
    isFirstUse() {
      return this.$store.state.dashboard.firstUse;
    },
    expertMode() {
      return this.$store.state.dashboard.expertMode;
    },
  },
  methods: {
    downloadConfig(config) {
      downloadText(config, "server.conf");
    },
    async removeMessage(message) {
      await this.$store.dispatch("removeDashboardMessage", message);
    },
    async updateExpertMode(enabled) {
      await this.$store.dispatch("updateExpertMode", enabled);
    },
  },
  mounted() {
    if (this.isFirstUse) {
      // TODO: Great place to learn about this in JS
      // Why do you think this is needed here?
      // You'll wanna check this for ES5 to learn some cool programming history
      this.$store.dispatch("disableFirstUse");
      this.$store.dispatch("addDashboardMessage", WHY_NO_LOGIN);
      this.$store.dispatch("addDashboardMessage", REGULAR_BACKUP);
      this.$store.dispatch("addDashboardWidget", "server");
      this.$store.dispatch("addDashboardWidget", "devices");
      this.$store.dispatch("addDashboardWidget", "settings");
    }
  },
};
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
}
h1 {
  text-decoration: underline;
}

.message {
  display: flex;
  flex-direction: column;
  margin-bottom: $spacing-large;
  &:last-child {
    margin-bottom: 0;
  }

  & .close-message {
    align-self: flex-end;
    color: $black;
    border: none;
    background-color: $white;
    cursor: pointer;
  }

  & a {
    display: block;
    margin-top: $spacing-medium;
  }
}

.widget {
  margin-bottom: $spacing-large;
}

#top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-large;

  & h1 {
    margin-bottom: 0;
  }
}
#expert-mode {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: $heading-medium;
  & h2 {
    text-align: center;
    margin-bottom: 0;
    margin-right: $spacing-medium;
  }

  & label {
    margin-right: $spacing-small;
  }
}

.mobile {
  & #expert-mode {
    & h2 {
      display: none;
    }
    & input {
      margin-right: $spacing-medium;
    }
  }
}
</style>
