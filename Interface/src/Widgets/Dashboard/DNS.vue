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
      <CheckBox name="tls" :checked="dns.tls" @change="updateTls" />
    </div>
    <div class="row" v-if="tls">
      <label for="tlsname">{{ $t("dashboard.widgets.dns.tlsName") }}</label>
      <TextInput
        :value="tlsName"
        name="tlsname"
        required
        @change="updateTlsName"
      />
    </div>
  </div>
</template>

<script>
import IPInput from "components/Inputs/IP";
import CheckBox from "components/Inputs/CheckBox";
import TextInput from "components/Inputs/Text";

export default {
  components: { IPInput, CheckBox, TextInput },
  computed: {
    dns() {
      return this.$store.state.network.dns;
    },
    tls() {
      return this.dns.tls;
    },
    tlsName() {
      return this.dns.tlsName;
    },
  },
  methods: {
    updateIp({ ip, valid }) {
      if (valid) {
        this.$store.dispatch("updateDNSIp", ip);
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
