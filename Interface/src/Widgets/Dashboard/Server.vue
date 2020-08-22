<template>
  <div id="server-widget">
    <h1>{{ $t("dashboard.widgets.server.title") }}</h1>
    <div class="row">
      <label>{{ $t("dashboard.widgets.server.name") }}</label>
      <input
        v-if="!server.name || edit"
        type="text"
        name="name"
        @change="(e) => updateName(e.target.value)"
        :value="server.name"
      />
      <p v-else>{{ server.name }}</p>
    </div>
    <div class="row" v-if="expertMode">
      <label>{{ $t("dashboard.widgets.server.ip") }}</label>
      <IPInput
        v-if="edit"
        :ip="server.ip.v4"
        @change="({ ip, valid }) => updateIp({ ip: { v4: ip }, valid })"
      />
      <p v-else>{{ server.ip.v4.join(".") }}</p>
    </div>
    <div class="row">
      <label>{{ $t("dashboard.widgets.server.hostname") }}</label>
      <input
        v-if="edit"
        type="text"
        name="hostname"
        id="hostname"
        :value="server.hostname"
        @change="(e) => updateHostname(e.target.value)"
      />
      <p v-else>{{ server.hostname }}</p>
    </div>
    <div class="row">
      <label for="connected">
        {{
        $t("dashboard.widgets.server.connected")
        }}
      </label>
      <input
        type="checkbox"
        name="connected"
        idj
        class="switch"
        :checked="server.connected"
        @change="(e) => updateConnected(e.target.checked)"
      />
    </div>
    <div class="row">
      <label>{{ $t("dashboard.widgets.server.port") }}</label>
      <PortInput v-if="edit" :port="server.port" @change="updatePort" />
      <p v-else>{{ server.port }}</p>
    </div>
    <!-- TODO: ipv6 subnet -->
    <div class="row" v-if="expertMode">
      <label>{{ $t("dashboard.widgets.server.subnet") }}</label>
      <input
        v-if="edit"
        type="text"
        name="subnetV4"
        id="subnetv4"
        :value="server.subnet.v4"
        @change="(e) => updateSubnet({ v4: e.target.value })"
      />
      <p v-else>{{ server.subnet.v4 }}</p>
    </div>
    <Button id="download" @click="downloadConfig" v-if="server.config">
      {{
      $t("dashboard.widgets.server.download")
      }}
    </Button>

    <button id="edit" @click="toggleEdit">
      <span v-if="edit">{{ $t("dashboard.stopEdit") }}</span>
      <span v-else>{{ $t("dashboard.edit") }}</span>
    </button>
  </div>
</template>

<script>
import PortInput from "../../components/PortInput";
import IPInput from "../../components/IPInput";
import Button from "../../components/Button";
import { downloadText } from "../../lib/download";

export default {
  components: { PortInput, IPInput, Button },
  data() {
    return {
      edit: false,
    };
  },
  props: {
    expertMode: Boolean,
  },
  computed: {
    server() {
      return this.$store.state.server;
    },
  },
  methods: {
    downloadConfig() {
      const config = this.server.config;
      downloadText(config, `server.conf`);
    },
    toggleEdit() {
      if (!this.blocked) {
        this.edit = !this.edit;
      }
    },
    updateHostname(hostname) {
      this.$store.dispatch("updateServer", { hostname });
    },
    updateConnected(connected) {
      this.$store.dispatch("updateServer", { connected });
    },
    updateSubnet(subnet) {
      this.$store.dispatch("updateServer", { subnet });
    },
    updateName(name) {
      this.$store.dispatch("updateServer", { name });
    },
    updateIp({ ip, valid }) {
      if (valid) {
        this.$store.dispatch("updateServer", { ip });
        this.blocked = false;
      } else {
        this.blocked = true;
      }
    },
    updatePort({ port, valid }) {
      if (valid) {
        this.$store.dispatch("updateServer", { port });
        this.blocked = false;
      } else {
        this.blocked = true;
      }
    },
    // updateName(name) {},
  },
};
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  margin-left: auto;
  display: flex;
  justify-content: space-between;
  padding: $spacing-small 0;
}

button#edit {
  display: block;
  margin-left: auto;
  border: none;
  color: $secondary;
  text-decoration: underline;
  border: none;
  cursor: pointer;
  padding: $spacing-medium;
  background: $white;
}
#download {
  &.button {
    max-width: 20rem;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
