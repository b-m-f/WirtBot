<template>
  <div id="network-widget">
    <h1>{{ $t("dashboard.widgets.network.title") }}</h1>
    <div class="row">
      <label>{{ $t("dashboard.widgets.network.dnsName") }}</label>
      <TextInput
        name="dns-name"
        :value="network.dns.name"
        required
        @change="updateDNSName"
      />
    </div>
    <div class="row">
      <label>{{ $t("dashboard.widgets.network.apiServerHost") }}</label>
      <TextInput
        name="api-host"
        :value="network.api.host"
        required
        @change="updateAPIHost"
      />
    </div>
  </div>
</template>

<script>
import TextInput from "components/Inputs/Text";
export default {
  components: { TextInput },
  computed: {
    network() {
      return this.$store.state.network;
    },
  },
  methods: {
    updateDNSName(name) {
      this.$store.dispatch("updateDNSName", name);
    },
    updateAPIHost(name) {
      this.$store.dispatch("updateAPIHost", name);
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
</style>
