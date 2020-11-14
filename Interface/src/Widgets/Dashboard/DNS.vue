<template>
  <div id="dns-widget">
    <h1>{{ $t("dashboard.widgets.dns.title") }}</h1>
    <div class="row">
      <label>{{ $t("dashboard.widgets.dns.ip") }}</label>
      <IPInput
        :ip="dns.ip.v4"
        @change="({ ip, valid }) => updateIp({ ip: { v4: ip }, valid })"
      />
    </div>
    <div class="row">
      <label for="tls">{{ $t("dashboard.widgets.dns.tls") }}</label>
      <input
        type="checkbox"
        name="tls"
        :checked="dns.tls"
        @change="(e) => updateTls(e.target.checked)"
      />
    </div>
    <div class="row" v-if="tls">
      <label>{{ $t("dashboard.widgets.dns.tlsName") }}</label>
      <input
        type="text"
        name="tlsname"
        @change="(e) => updateTlsName(e.target.value)"
        :value="dns.tlsName"
      />
    </div>
  </div>
</template>

<script>
import IPInput from "components/Inputs/IP";

export default {
  components: { IPInput },
  props: {
    expertMode: Boolean,
  },
  computed: {
    dns() {
      return this.$store.state.network.dns;
    },
    tls() {
      return this.dns.tls;
    },
  },
  methods: {
    updateIp({ ip, valid }) {
      if (valid) {
        this.$store.dispatch("updateDNSIp", { ip });
        this.blocked = false;
      } else {
        this.blocked = true;
      }
    },
    updateTls(active) {
      this.$store.dispatch("updateDNSTls", { tlsName: "", tls: active });
    },
    updateTlsName(name) {
      this.$store.dispatch("updateDNSTls", { tlsName: name, tls: true });
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
