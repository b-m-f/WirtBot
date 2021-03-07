<template>
  <div id="dns-widget">
    <h1>{{ $t("dashboard.widgets.dns.title") }}</h1>
    <div class="row ip">
      <label>{{ $t("dashboard.widgets.dns.ip") }}</label>
      <IPInput
        :ip="(dns.ip && dns.ip.v4) || undefined"
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
        :invalidMessage="$t('warnings.invalid')"
        :validate="validIgnoredZones"
        @change="updateIgnoredZones"
      />
    </div>
    <div class="row">
      <label for="adblock">{{ $t("dashboard.widgets.dns.adblock") }}</label>
      <CheckBox name="adblock" :checked="dns.adblock" @change="updateAdblock" />
    </div>
    <div class="row" v-if="dns.adblock">
      <label for="blockLists">{{
        $t("dashboard.widgets.dns.blockLists")
      }}</label>
      <TextInput
        :value="dns.blockLists.join(',')"
        name="blockLists"
        :title="$t('infos.commaList')"
        multiline
        :invalidMessage="$t('warnings.invalid')"
        :validate="validBlockLists"
        @change="updateBlockLists"
      />
    </div>
    <div class="row" v-if="dns.adblock">
      <label for="blockHosts">{{
        $t("dashboard.widgets.dns.blockHosts")
      }}</label>
      <TextInput
        :value="dns.blockHosts.join(',')"
        name="blockHosts"
        :title="$t('infos.commaList')"
        multiline
        :invalidMessage="$t('warnings.invalid')"
        :validate="validBlockHosts"
        @change="updateBlockHosts"
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
    ignoredZones() {
      return this.dns.ignoredZones.join(",");
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
    updateIgnoredZones(zones) {
      this.$store.dispatch("updateDNSIgnoredZones", {
        ignoredZones: zones.split(",").filter((zones) => zones !== ""),
      });
    },
    updateAdblock(active) {
      this.$store.dispatch("updateDNSAdblock", { adblock: active });
    },
    updateBlockLists(lists) {
      this.$store.dispatch("updateDNSBlockLists", {
        blockLists: lists.split(",").filter((list) => list !== ""),
      });
    },
    updateBlockHosts(hosts) {
      this.$store.dispatch("updateDNSBlockHosts", {
        blockHosts: hosts.split(",").filter((host) => host !== ""),
      });
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
    validBlockLists(lists) {
      try {
        for (let list of lists.split(",")) {
          if (list === "") {
            return false;
          }
          if (!list.includes("http")) {
            return false;
          }
        }
        return true;
      } catch (error) {
        return false;
      }
    },
    validBlockHosts(hosts) {
      try {
        for (let host of hosts.split(",")) {
          if (host === "") {
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
