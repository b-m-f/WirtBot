<template>
  <tr :class="{ mobile: isMobilePage, 'table-row': true }">
    <td class="column-one">
      <label for="device-name">{{
        $t("dashboard.widgets.devices.labels.name")
      }}</label>
      <TextInput
        :value="internalName"
        name="device-name"
        class="name"
        required
        @change="(name) => (internalName = name)"
      />
    </td>
    <td class="column-two ip-input">
      <div class="ip-v4">
        <label for="device-ipv4">{{
          $t("dashboard.widgets.devices.labels.ipv4")
        }}</label>
        <div class="value">
          <p>{{ subnet.v4 }}</p>
          <NumberInput
            name="device-ipv4"
            :value="internalIP.v4"
            @change="(ip) => updateIP({ v4: ip })"
            :validate="checkIPv4"
            :placeholder="`${getNextHighestIPv4()}`"
            :invalidMessage="invalidIPv4Message"
            :min="2"
            :max="255"
            required
          />
        </div>
      </div>
      <div v-if="expanded" class="ip-v6">
        <label for="device-ipv6">{{
          $t("dashboard.widgets.devices.labels.ipv6")
        }}</label>
        <div class="value">
          <p :title="subnet.v6">{{ subnet.v6.substring(0, 4) }}::</p>
          <TextInput
            :value="internalIP.v6"
            name="device-ipv6"
            placeholder="0001-ffff"
            @change="(ip) => updateIP({ v6: ip })"
            :validate="checkIPv6"
            :invalidMessage="invalidIPv6Message"
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
          @change="updateMTU"
          :validate="validateMTU"
          :invalidMessage="$t('warnings.deviceMTU')"
          :placeholder="$t('dashboard.widgets.devices.placeholder.MTU')"
        />
      </div>
      <div class="additionalDNSServers">
        <label for="additionalDNSServers">
          {{ $t("dashboard.widgets.devices.labels.additionalDNSServers") }}
        </label>
        <TextInput
          :value="internalAdditionalDNSServers.join(',')"
          name="additionalDNSServers"
          class="additionalDNSServers"
          :placeholder="
            $t('dashboard.widgets.devices.placeholder.additionalDNSServers')
          "
          :validate="validateAdditionalDNSServers"
          :invalidMessage="invalidAdditionalDNSServersMessage"
          @change="updateAdditionalDNSServers"
        />
      </div>
    </td>
    <td class="column-five">
      <div class="routed">
        <label for="routed">{{
          $t("dashboard.widgets.devices.labels.routed")
        }}</label>
        <CheckBox
          name="routed"
          :checked="internalRouted"
          @change="(bool) => (internalRouted = bool)"
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
import TextInput from "components/Inputs/Text";
import CheckBox from "components/Inputs/CheckBox";
import { downloadText } from "../lib/download";
import debounce from "lodash/debounce";

export default {
  components: { NumberInput, TextInput, CheckBox },
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
      invalidIPv4Message: "",
      invalidIPv6Message: "",
      invalidAdditionalDNSServersMessage: "",
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
          this.internalIP = { ...this.internalIP, v4: ip };
        } catch (error) {
          return;
        }
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
    validateAdditionalDNSServers(serverString) {
      const correct = /^([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3},?)+$/.test(
        serverString
      );
      if (!correct) {
        this.invalidAdditionalDNSServersMessage = this.$t(
          "warnings.deviceAdditionalDNSServers"
        );
      }
    },
    updateAdditionalDNSServers(serverString) {
      if (this.updatingAdditionalDNSServers) {
        this.updatingAdditionalDNSServers.cancel();
      }
      this.updatingAdditionalDNSServers = debounce(function () {
        // split by comma
        this.internalAdditionalDNSServers = serverString
          .split(",")
          .map((entry) => {
            return entry.trim();
          });
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
    checkIPv4(ip) {
      this.invalidIPv4Message = "";
      if (ip == 1) {
        this.invalidIPv4Message = this.$t("warnings.deviceIpServer");
        return false;
      }
      const isIpUsed = this.devices.reduce((prev, next) => {
        return prev || (next.ip.v4 == ip && next.id !== this.internalId);
      }, false);

      if (isIpUsed) {
        this.invalidIPv4Message = this.$t("warnings.deviceIpUsed");
        return false;
      } else {
        return true;
      }
    },
    checkIPv6(ip) {
      try {
        if (!/^[0-9a-fA-F]+$/.test(ip)) {
          this.invalidIPv6Message = this.$t("warnings.wrongIPv6");
          throw "IPv6 has wrong format";
        }
        const parsedIPv6 = parseInt(ip, 16);

        const correct = parsedIPv6 < 65535 && parsedIPv6 > 1;
        if (!correct) {
          throw "IPv6 is out of range";
        }
      } catch (error) {
        this.invalidIPv6Message = this.$t("warnings.wrongIPv6");
        return false;
      }
    },
    async save() {
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
