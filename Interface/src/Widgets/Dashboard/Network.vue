<template>
  <div id="network-widget">
    <h1>{{ $t("dashboard.widgets.network.title") }}</h1>
    <div class="row">
      <label>{{ $t("dashboard.widgets.network.dnsName") }}</label>
      <input
        type="text"
        name="dns-name"
        :value="network.dns.name"
        @change="(e) => updateDNSName(e.target.value)"
      />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    network() {
      return this.$store.state.network;
    },
  },
  props: {
    expertMode: Boolean,
  },
  methods: {
    updateDNSName(name) {
      this.$store.dispatch("updateDNSName", name);
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
