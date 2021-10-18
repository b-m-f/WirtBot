<template>
  <div id="dns-widget">
    <h1>{{ $t("dashboard.widgets.dns.title") }}</h1>
    <div class="row ip">
      <label>{{ $t("dashboard.widgets.dns.ipOrHostname") }}</label>
      <IpOrHostnameInput
        :value="(dns.ip && dns.ip.v4) || dns.hostname || undefined"
        @change="
          ({ ip, hostname, valid }) =>
            updateIpOrHostname({ ip: { v4: ip }, hostname, valid })
        "
      />
    </div>
    <div class="row" v-if="!dns.hostname">
      <label for="tls">{{ $t("dashboard.widgets.dns.tls") }}</label>
      <CheckBox name="tls" :checked="dns.tls" @change="updateTls" />
    </div>
    <div class="row" v-if="tls">
      <label for="tlsname">{{ $t("dashboard.widgets.dns.tlsName") }}</label>
      <TextInput
        :value="tlsName"
        name="tlsname"
        required
        :invalidMessage="$t('dashboard.widgets.dns.invalidTLSName')"
        :validate="validateDNSTLSName"
        @change="updateTlsName"
      />
    </div>
    <div class="row">
      <label for="ignored-zones">{{
        $t("dashboard.widgets.dns.ignoredZones")
      }}</label>
      <TextInput
        :value="ignoredZones"
        name="ignoredZones"
        required
        :title="$t('infos.commaList')"
        multiline
        :invalidMessage="$t('errors.invalid')"
        :validate="validIgnoredZones"
        @change="updateIgnoredZones"
      />
    </div>
  </div>
</template>

<script>
import IpOrHostnameInput from "components/Inputs/IpOrHostname";
import CheckBox from "components/Inputs/CheckBox";
import TextInput from "components/Inputs/Text";

export default {
  components: { CheckBox, TextInput, IpOrHostnameInput },
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
    ignoredZones() {
      return this.dns.ignoredZones.join(",");
    },
  },
  methods: {
    updateIpOrHostname({ ip, hostname, valid }) {
      if (valid) {
        if (ip && ip.v4) {
          this.$store.dispatch("updateDNSIp", ip);
        }
        if (hostname) {
          this.$store.dispatch("updateDNSHostname", { hostname });
        }
      }
    },
    updateTls(active) {
      this.$store.dispatch("updateDNSTls", { tlsName: "", tls: active });
    },
    updateTlsName(name) {
      this.$store.dispatch("updateDNSTls", { tlsName: name, tls: true });
    },
    updateIgnoredZones(zones) {
      this.$store.dispatch(
        "updateDNSIgnoredZones",
        zones.split(",").filter((zones) => zones !== "")
      );
    },
    validIgnoredZones(zones) {
      try {
        for (let zone of zones.split(",")) {
          if (zone === "") {
            return false;
          }
        }
        return true;
      } catch (error) {
        return false;
      }
    },
    validateDNSTLSName(name) {
      if (
        name.includes("https://") ||
        name.includes("http://") ||
        name.includes("tls://")
      ) {
        return false;
      }
      return true;
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

@media screen and (max-width: $tablet-width) {
  .row.ip label {
    max-width: 44%;
  }
}
</style>
