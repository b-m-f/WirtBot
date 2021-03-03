<template>
  <div :class="{ page: true }">
    <div id="top-bar">
      <h1>{{ $t("dashboard.title") }}</h1>
      <h2>v{{ version }}</h2>
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
      padded
      v-for="(widget, index) in widgets"
      :key="`dashboard-widget-${index}`"
    >
      <component :is="widget"></component>
    </Card>
  </div>
</template>

<script>
import { downloadText } from "../../lib/download";
import AccentedCard from "shared-components/AccentedCard";
import Card from "shared-components/Card";
import NetworkWidget from "../../Widgets/Dashboard/Network";
import ServerWidget from "../../Widgets/Dashboard/Server";
import DeviceWidget from "../../Widgets/Dashboard/Devices";
import SettingsWidget from "../../Widgets/Dashboard/Settings";
import DNSWidget from "../../Widgets/Dashboard/DNS";
import difference from "lodash/difference";
import CheckBox from "components/Inputs/CheckBox";

const availableWidgets = {
  network: NetworkWidget,
  server: ServerWidget,
  devices: DeviceWidget,
  settings: SettingsWidget,
  dns: DNSWidget,
};

export default {
  components: { AccentedCard, Card, CheckBox },
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
      const widgetsToShow = difference(
        Object.keys(availableWidgets),
        this.$store.state.hiddenWidgets
      );
      return widgetsToShow.map((widget) => availableWidgets[widget]);
    },
    server() {
      return this.$store.state.server;
    },
    isFirstUse() {
      return this.$store.state.dashboard.firstUse;
    },
    version() {
      return this.$store.state.version;
    },
  },
  methods: {
    downloadConfig(config) {
      downloadText(config, "server.conf");
    },
    async removeMessage(message) {
      await this.$store.dispatch("removeDashboardMessage", message);
    },
  },
  mounted() {
    if (this.isFirstUse) {
      const REGULAR_BACKUP = {
        title: this.$t("dashboard.messages.regularBackup.title"),
        text: this.$t("dashboard.messages.regularBackup.text"),
        link: {
          url: "/docs/interface#backup",
          text: this.$t("dashboard.messages.regularBackup.link"),
        },
      };
      const WHY_NO_LOGIN = {
        title: this.$t("dashboard.messages.whyNoLogin.title"),
        text: this.$t("dashboard.messages.whyNoLogin.text"),
        link: {
          url: "/docs/interface#authentication",
          text: this.$t("dashboard.messages.whyNoLogin.link"),
        },
      };
      this.$store.dispatch("disableFirstUse");
      this.$store.dispatch("addDashboardMessage", WHY_NO_LOGIN);
      this.$store.dispatch("addDashboardMessage", REGULAR_BACKUP);
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
</style>
