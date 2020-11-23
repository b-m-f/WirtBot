<template>
  <tr
    :class="{ mobile: isMobilePage, 'table-row': true, device: true }"
    :data-name="this.device.name"
  >
    <td class="column-one">
      <label for="device-name">{{
        $t("dashboard.widgets.devices.labels.name")
      }}</label>
      <TextInput
        :value="device.name"
        name="device-name"
        class="name"
        required
        @change="updateName"
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
            :value="device.ip.v4"
            @change="(ip) => updateIP({ v4: ip, v6: this.device.ip.v6 })"
            :validate="validateIPv4"
            :placeholder="`${getNextHighestIPv4()}`"
            :invalidMessage="invalidIPv4Message"
            :min="2"
            :max="255"
            required
          />
        </div>
      </div>
      <div class="ip-v6">
        <label for="device-ipv6">{{
          $t("dashboard.widgets.devices.labels.ipv6")
        }}</label>
        <div class="value">
          <p :title="subnet.v6">{{ subnet.v6.substring(0, 4) }}::</p>
          <TextInput
            :value="device.ip.v6"
            name="device-ipv6"
            placeholder="0002-fffe"
            @change="(ip) => updateIP({ v4: this.device.ip.v4, v6: ip })"
            :validate="validateIPv6"
            :invalidMessage="invalidIPv6Message"
          />
        </div>
      </div>
    </td>
    <td class="column-three">
      <label for="device-type">{{
        $t("dashboard.widgets.devices.labels.type")
      }}</label>
      <Select
        :required="true"
        :selected="device.type"
        :options="deviceTypes"
        class="device-type"
        @change="updateType"
      />
    </td>
    <td class="column-four">
      <div class="mtu">
        <label for="MTU">
          {{ $t("dashboard.widgets.devices.labels.MTU") }}
        </label>
        <NumberInput
          name="MTU"
          :value="device.MTU"
          class="MTU"
          @change="updateMTU"
          :max="1800"
          :min="1320"
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
          :value="device.additionalDNSServers.join(',')"
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
          :checked="device.routed"
          @change="(bool) => save({ ...this.device, routed: bool })"
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
      <button type="button" class="delete" @click="deleteDevice">
        {{ $t("dashboard.widgets.devices.labels.delete") }}
      </button>
      <button
        type="button"
        v-if="device.config"
        class="download"
        @click="downloadConfig"
      >
        {{ $t("dashboard.widgets.devices.labels.download") }}
      </button>
    </td>
  </tr>
</template>

<script>
import NumberInput from "components/Inputs/Number";
import TextInput from "components/Inputs/Text";
import CheckBox from "components/Inputs/CheckBox";
import Select from "components/Inputs/Select";
import { downloadText } from "../lib/download";
import debounce from "lodash/debounce";

export default {
  components: { NumberInput, TextInput, CheckBox, Select },
  props: {
    controls: Boolean,
    name: String,
    ip: Object,
    type: String,
    id: String,
    qr: String,
    routed: Boolean,
    additionalDNSServers: Array,
    MTU: Number,
    config: String,
  },
  data() {
    return {
      invalidIPv4Message: "",
      invalidIPv6Message: "",
      invalidAdditionalDNSServersMessage: "",
    };
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
    device() {
      return {
        name: this.$props.name,
        ip: this.$props.ip || { v4: undefined, v6: undefined },
        type: this.$props.type,
        id: this.$props.id,
        qr: this.$props.qr,
        routed: this.$props.routed,
        additionalDNSServers: this.$props.additionalDNSServers || [],
        MTU: this.$props.MTU,
        config: this.$props.config,
      };
    },
  },
  mounted() {},
  methods: {
    downloadConfig() {
      const config = this.devices.find(
        (device) => device.id === this.device.id
      )["config"];
      downloadText(config, `${this.device.name}.conf`);
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
      if (!this.device.id) {
        this.$emit("cancel-new-device");
      } else {
        this.$store.dispatch("removeDevice", { id: this.device.id });
      }
    },
    updateType(type) {
      this.save({ type });
    },
    updateIP({ v4, v6 }) {
      this.save({ ip: { v4, v6 } });
    },
    updateName(name) {
      this.save({ name });
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
      return correct;
    },
    updateAdditionalDNSServers(serverString) {
      if (this.updatingAdditionalDNSServers) {
        this.updatingAdditionalDNSServers.cancel();
      }
      this.updatingAdditionalDNSServers = debounce(() => {
        const servers = serverString.split(",").map((entry) => {
          return entry.trim();
        });
        this.save({ additionalDNSServers: servers });
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
      this.updatingMTU = debounce(() => {
        this.save({ MTU: mtu });
      }, 1000);
      this.updatingMTU();
    },
    validateIPv4(ip) {
      this.invalidIPv4Message = "";
      if (ip == 1) {
        this.invalidIPv4Message = this.$t("warnings.deviceIpServer");
        return false;
      }
      const isIpUsed = this.devices.reduce((prev, next) => {
        return prev || (next.ip.v4 == ip && next.id !== this.device.id);
      }, false);

      if (isIpUsed) {
        this.invalidIPv4Message = this.$t("warnings.deviceIpUsed");
        return false;
      }
      return true;
    },
    validateIPv6(ip) {
      try {
        if (!/^[0-9a-fA-F]{3}[2-9a-eA-E]$/.test(ip)) {
          this.invalidIPv6Message = this.$t("warnings.wrongIPv6");
          throw "IPv6 has wrong format";
        }
        const parsedIPv6 = parseInt(ip, 16);

        const correct = parsedIPv6 < 65636 && parsedIPv6 > 1;
        if (!correct) {
          throw "IPv6 is out of range";
        }
        return true;
      } catch (error) {
        this.invalidIPv6Message = this.$t("warnings.wrongIPv6");
        return false;
      }
    },
    async save(device) {
      this.internalDeviceCacheForNewDevices = Object.assign(
        {},
        this.internalDeviceCacheForNewDevices,
        device
      );
      this.$emit("saved", {
        ...this.device,
        ...this.internalDeviceCacheForNewDevices,
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
