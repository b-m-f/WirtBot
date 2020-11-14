<template>
  <div id="server-widget">
    <h1>{{ $t("dashboard.widgets.server.title") }}</h1>
    <div class="row">
      <label>{{ $t("dashboard.widgets.server.name") }}</label>
      <input
        v-if="!server.name"
        type="text"
        name="name"
        @change="(e) => updateName(e.target.value)"
        :value="server.name"
      />
    </div>
    <div class="row">
      <label>{{ $t("dashboard.widgets.server.ip") }}</label>
      <IPInput
        :ip="server.ip.v4"
        @change="({ ip, valid }) => updateIp({ ip: { v4: ip }, valid })"
      />
    </div>
    <div class="row" v-if="expertMode">
      <label>{{ $t("dashboard.widgets.server.hostname") }}</label>
      <input
        type="text"
        name="hostname"
        id="hostname"
        :value="server.hostname"
        @change="(e) => updateHostname(e.target.value)"
      />
    </div>
    <div class="row">
      <label>{{ $t("dashboard.widgets.server.port") }}</label>
      <NumberInput
        :value="server.port"
        @change="updatePort"
        :validate="validatePort"
        :invalidMessage="$t('warnings.serverPort')"
      />
    </div>
    <div class="row" v-if="expertMode">
      <label>{{ $t("dashboard.widgets.server.subnet") }}</label>
      <input
        type="text"
        name="subnetV4"
        id="subnetv4"
        :value="server.subnet.v4"
        @change="(e) => updateSubnet({ v4: e.target.value })"
      />
    </div>
    <Button id="download" @click="downloadConfig" v-if="server.config">
      {{ $t("dashboard.widgets.server.download") }}
    </Button>
  </div>
</template>

<script>
import NumberInput from "components/Inputs/Number";
import IPInput from "components/Inputs/IP";
import Button from "shared-components/Button";
import { downloadText } from "../../lib/download";

export default {
  components: { NumberInput, IPInput, Button },
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
    validatePort(port) {
      return port > 1024 && port < 65636;
    },
    updatePort(port) {
      this.$store.dispatch("updateServer", { port });
      this.blocked = false;
    },
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
