<template>
  <tr :class="{ mobile: isMobilePage, 'table-row': true }">
    <td class="column-one">
      <label for="device-name">{{
        $t("dashboard.widgets.devices.labels.name")
      }}</label>
      <input
        type="text"
        name="device-name"
        class="name"
        v-model="internalName"
        required
        placeholder=" "
      />
      <div v-if="expanded"></div>
    </td>
    <td class="column-two ip-input">
      <div class="ip-v4">
        <label for="device-ipv4">{{
          $t("dashboard.widgets.devices.labels.ipv4")
        }}</label>
        <div class="value">
          <p>{{ subnet.v4 }}</p>
          <input
            type="number"
            name="device-ipv4"
            min="2"
            max="255"
            :placeholder="getNextHighestIPv4()"
            :value="internalIP.v4"
            required
            @input="(e) => updateIP({ v4: e.target.value })"
            ref="ipv4-input"
          />
        </div>
      </div>
      <div v-if="expanded" class="ip-v6">
        <label for="device-ipv6">{{
          $t("dashboard.widgets.devices.labels.ipv6")
        }}</label>
        <div class="value">
          <p :title="subnet.v6">{{ subnet.v6.substring(0, 4) }}::</p>
          <input
            type="text"
            name="device-ipv6"
            placeholder="0001-ffff"
            :value="internalIP.v6"
            required
            @input="(e) => updateIP({ v6: e.target.value })"
            ref="ipv6-input"
          />
        </div>
      </div>
    </td>
    <td class="column-three">
      <label for="device-type">{{
        $t("dashboard.widgets.devices.labels.type")
      }}</label>
      <select
        class="device-type"
        :required="true"
        v-model="internalType"
        :class="{
          ['device-type']: true,
        }"
      >
        <option :value="type" v-for="type in deviceTypes" :key="type">
          {{ type }}
        </option>
      </select>
    </td>
    <td class="column-four" v-if="expanded">
      <div class="mtu">
        <label for="mtu">
          {{ $t("dashboard.widgets.devices.labels.MTU") }}
        </label>
        <NumberInput
          name="mtu"
          :value="internalMTU"
          class="MTU"
          @change="(e) => updateMTU(e.target.value)"
          :validate="validateMTU"
          :invalidMessage="$t('warnings.deviceMTU')"
          :placeholder="$t('dashboard.widgets.devices.placeholder.MTU')"
        />
      </div>
      <div class="additionalDNSServers">
        <label for="additionalDNSServers">
          {{ $t("dashboard.widgets.devices.labels.additionalDNSServers") }}
        </label>
        <input
          type="text"
          name="additionalDNSServers"
          class="additionalDNSServers"
          :value="internalAdditionalDNSServers"
          :placeholder="
            $t('dashboard.widgets.devices.placeholder.additionalDNSServers')
          "
          @input="(e) => updateAdditionalDNSServers(e.target.value)"
          ref="additionalDNSServers"
        />
      </div>
    </td>
    <td class="column-five">
      <div class="routed">
        <label for="routed">{{
          $t("dashboard.widgets.devices.labels.routed")
        }}</label>
        <input
          type="checkbox"
          name="routed"
          :checked="internalRouted"
          @change="internalRouted = !internalRouted"
        />
      </div>
    </td>
    <td class="column-six">
      <img
        v-if="qr"
        class="qr-code"
        :src="qr"
        alt="QR Code for config of mobile devices"
      />
      <button class="delete" @click="deleteDevice">Delete</button>
      <button class="download" @click="downloadConfig">Download</button>
    </td>
  </tr>
</template>

<script>
import NumberInput from "components/Inputs/Number";
import { downloadText } from "../lib/download";
import debounce from "lodash/debounce";

export default {
  components: { NumberInput },
  props: {
    controls: Boolean,
    name: String,
    ip: Object,
    type: String,
    id: String,
    qr: String,
    expanded: Boolean,
    routed: Boolean,
    additionalDNSServers: Array,
    MTU: String,
  },
  data() {
    return {
      internalIP: this.$props.ip || {},
      internalName: this.$props.name,
      internalType: this.$props.type || "Linux",
      internalId: this.$props.id,
      selectTouched: false,
      internalRouted: this.$props.routed || false,
      internalAdditionalDNSServers: this.$props.additionalDNSServers || [],
      internalMTU: this.$props.MTU,
    };
  },
  watch: {
    internalIP() {
      this.save();
    },
    internalName() {
      this.save();
    },
    internalType() {
      this.save();
    },
    internalId() {
      this.save();
    },
    selectTouched() {
      this.save();
    },
    internalRouted() {
      this.save();
    },
    internalAdditionalDNSServers() {
      this.save();
    },
    internalMTU() {
      this.save();
    },
  },
  computed: {
    deviceTypes() {
      return this.$store.state.deviceTypes;
    },
    devices() {
      return this.$store.state.devices;
    },
    subnet() {
      return this.$store.state.server.subnet;
    },
    isMobilePage() {
      return this.$store.state.websiteBeingViewedOnMobileDevice;
    },
  },
  mounted() {},
  methods: {
    downloadConfig() {
      const config = this.devices.find(
        (device) => device.id === this.internalId
      )["config"];
      downloadText(config, `${this.internalName}.conf`);
    },
    getNextHighestIPv4() {
      let nextHighest = 2;

      let dev = this.devices.map((device) => device.ip.v4).sort();
      dev.forEach((ip) => {
        if (ip === nextHighest) {
          nextHighest = ip + 1;
        }
      });
      return nextHighest;
    },
    deleteDevice() {
      this.$store.dispatch("removeDevice", { id: this.internalId });
    },
    updateType(type) {
      this.internalType = type;
    },
    updateIP({ v4, v6 }) {
      if (v4) {
        let ip;
        try {
          ip = parseInt(v4);
          this.internalIP = { ...this.internalIP, v4: ip };
        } catch (error) {
          return;
        }
        this.checkIPv4(ip);
      } else if (v6) {
        let ip;
        try {
          ip = v6;
          this.internalIP = { ...this.internalIP, v6: ip };
          this.checkIPv6(ip);
        } catch (error) {
          return;
        }
      }
    },
    updateAdditionalDNSServers(serverString) {
      const correct = /^([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3},?)+$/.test(
        serverString
      );
      if (this.updatingAdditionalDNSServers) {
        this.updatingAdditionalDNSServers.cancel();
      }
      this.updatingAdditionalDNSServers = debounce(function () {
        try {
          if (correct) {
            // split by comma
            this.internalAdditionalDNSServers = serverString
              .split(",")
              .map((entry) => {
                return entry.trim();
              });
          } else {
            throw "Error";
          }
        } catch (error) {
          this.$refs["additionalDNSServers"].reportValidity();
          this.$store.dispatch(
            "alerts/addWarning",
            this.$t("warnings.deviceAdditionalDNSServers")
          );
        }
      }, 1300);
      this.updatingAdditionalDNSServers();
    },
    validateMTU(mtu) {
      return mtu >= 1320 && parseInt(mtu) < 1800;
    },
    updateMTU(mtu) {
      if (this.updatingMTU) {
        this.updatingMTU.cancel();
      }
      this.updatingMTU = debounce(function () {
        this.internalMTU = mtu;
      }, 1000);
      this.updatingMTU();
    },
    async checkIPv4(ip) {
      // remove invalidity from field
      this.$refs["ipv4-input"].setCustomValidity("");

      if (ip == 1) {
        this.$store.dispatch(
          "alerts/addWarning",
          this.$t("warnings.deviceIpServer")
        );
        this.$refs["ipv4-input"].setCustomValidity(
          this.$t("warnings.deviceIpServer")
        );
        this.$refs["ipv4-input"].reportValidity();
        return false;
      }
      const isIpUsed = this.devices.reduce((prev, next) => {
        return (
          prev ||
          (next.ip.v4 == this.internalIP.v4 && next.id !== this.internalId)
        );
      }, false);

      if (isIpUsed) {
        this.$store.dispatch(
          "alerts/addWarning",
          this.$t("warnings.deviceIpUsed")
        );
        this.$refs["ipv4-input"].setCustomValidity(
          this.$t("warnings.deviceIpUsed")
        );
        this.$refs["ipv4-input"].reportValidity();
        return false;
      } else {
        return true;
      }
    },
    checkIPv6(ip) {
      // remove invalidity from field
      this.$refs["ipv6-input"].setCustomValidity("");
      if (!/^[0-9a-fA-F]+$/.test(ip)) {
        this.$refs["ipv6-input"].setCustomValidity(
          this.$t("warnings.wrongIPv6")
        );
        this.$refs["ipv6-input"].reportValidity();
        return false;
      }
      try {
        const parsedIPv6 = parseInt(ip, 16);

        return parsedIPv6 < 65535 && parsedIPv6 > 1;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    async save() {
      let ip4OK = false;
      // default ipv6 to true since it is optional and doesnt need to be checked if it
      // does not exist
      let ip6OK = true;

      if (this.internalIP.v4) {
        ip4OK = await this.checkIPv4(this.internalIP.v4);
        if (!ip4OK) {
          return;
        }
      }

      if (this.internalIP.v6) {
        ip6OK = await this.checkIPv6(this.internalIP.v6);
        if (!ip6OK) {
          return;
        }
      }

      this.$emit("saved", {
        id: this.internalId,
        name: this.internalName,
        type: this.internalType,
        ip: this.internalIP,
        routed: this.internalRouted,
        additionalDNSServers: this.internalAdditionalDNSServers,
        MTU: this.internalMTU,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.routed {
  display: flex;
  justify-content: space-between;
  margin-bottom: $spacing-small;
}
.ip-input {
  & .ip-v4 {
    margin-bottom: $spacing-small;
  }
  & .ip-v6,
  .ip-v4 {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    & .value {
      display: flex;
      flex-direction: row;
    }
    & input[type="number"] {
      margin-left: $spacing-x-small;
      width: 4rem;
    }
    & input[type="text"] {
      margin-left: $spacing-x-small;
      width: 4rem;
    }
  }
}

.additionalDNSServers,
.mtu {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.mobile {
  & .new-device {
    & .ip-input {
      flex-direction: column;
    }
  }
}

.delete {
  margin-top: $spacing-small;
}

.stop {
  margin-top: $spacing-small;
}

.qr-code {
  width: 100%;
  max-width: 12rem;
  align-self: center;
  margin-bottom: $spacing-medium;
  margin-top: $spacing-medium;
}
</style>
