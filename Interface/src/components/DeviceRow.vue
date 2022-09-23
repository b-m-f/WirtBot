<template>
  <tr
    :class="{ 'table-row': true, device: true }"
    :data-name="this.$props.name"
  >
    <td class="column-one">
      <div>
        <label for="device-name">{{
          $t("dashboard.widgets.devices.labels.name")
        }}</label>
        <TextInput
          :value="$props.name"
          name="device-name"
          class="name"
          required
          @change="updateName"
          :class="{
            required: !internalDeviceCacheForNewDevices.name && !$props.name,
          }"
          :validate="validateName"
          :invalidMessage="invalidName"
        />
      </div>
      <div class="additionalNames extras" :class="{ hidden: !this.showMore }">
        <label for="additionalNames">
          {{ $t("dashboard.widgets.devices.labels.additionalNames") }}
        </label>
        <TextInput
          :value="
            ($props.additionalNames && $props.additionalNames.join(',')) || ''
          "
          name="additionalNames"
          class="additionalNames"
          :placeholder="
            $t('dashboard.widgets.devices.placeholder.additionalNames')
          "
          :validate="validateAdditionalNames"
          :invalidMessage="invalidAdditionalNames"
          @change="updateAdditionalNames"
        />
      </div>
    </td>
    <td class="column-two ip-input">
      <div class="ip-v4">
        <label for="device-ipv4">{{
          $t("dashboard.widgets.devices.labels.ipv4")
        }}</label>
        <div class="value">
          <p>{{ subnet.v4 }}</p>
          <NumberInput
            :name="'device-ipv4'"
            :value="($props.ip && $props.ip.v4) || undefined"
            @change="(ip) => updateIP({ v4: ip })"
            :validate="validateIPv4"
            :placeholder="`${getNextHighestIPv4()}`"
            :invalidMessage="invalidIPv4Message"
            :min="2"
            :max="255"
            required
            :class="{
              required:
                internalDeviceCacheForNewDevices.ip &&
                !internalDeviceCacheForNewDevices.ip.v4 &&
                $props.ip &&
                !$props.ip.v4,
            }"
          />
        </div>
      </div>
      <div class="ip-v6 extras" :class="{ hidden: !this.showMore }">
        <label for="device-ipv6">{{
          $t("dashboard.widgets.devices.labels.ipv6")
        }}</label>
        <div class="value">
          <p :title="subnet.v6">{{ subnet.v6.substring(0, 4) }}::</p>
          <TextInput
            :value="($props.ip && $props.ip.v6) || undefined"
            name="device-ipv6"
            placeholder="0002-fffe"
            @change="(ip) => updateIP({ v6: ip })"
            :validate="validateIPv6"
            :invalidMessage="invalidIPv6Message"
          />
        </div>
      </div>
      <div class="port extras" :class="{ hidden: !this.showMore }">
        <label for="device-port">{{
          $t("dashboard.widgets.devices.labels.port")
        }}</label>
        <div class="value">
          <NumberInput
            :name="'device-port'"
            :value="$props.port || undefined"
            @change="(port) => updatePort(port)"
            placeholder="1-65535"
            :min="1"
            :max="65535"
            :validate="validatePort"
            :invalidMessage="$t('errors.devicePort')"
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
        :selected="$props.type"
        :options="deviceTypes"
        class="device-type"
        :class="{
          required: !internalDeviceCacheForNewDevices.type && !$props.type,
        }"
        @change="updateType"
      />
    </td>
    <td class="column-four extras" :class="{ hidden: !this.showMore }">
      <div class="mtu">
        <label for="MTU">
          {{ $t("dashboard.widgets.devices.labels.MTU") }}
        </label>
        <NumberInput
          name="MTU"
          :value="$props.MTU"
          class="MTU"
          @change="updateMTU"
          :max="1800"
          :min="1320"
          :validate="validateMTU"
          :invalidMessage="$t('errors.deviceMTU')"
          :placeholder="$t('dashboard.widgets.devices.placeholder.MTU')"
        />
      </div>
      <div class="additionalDNSServers">
        <label for="additionalDNSServers">
          {{ $t("dashboard.widgets.devices.labels.additionalDNSServers") }}
        </label>
        <TextInput
          :value="
            ($props.additionalDNSServers &&
              $props.additionalDNSServers.join(',')) ||
            ''
          "
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
    <td class="column-five extras" :class="{ hidden: !this.showMore }">
      <div class="routed">
        <label for="routed">{{
          $t("dashboard.widgets.devices.labels.routed")
        }}</label>
        <CheckBox
          name="routed"
          :checked="$props.routed"
          @change="(bool) => save({ routed: bool })"
        />
      </div>
    </td>
    <td class="column-six">
      <button v-if="qr" type="button" class="show-qr" @click="toggleQR">
        {{ $t("dashboard.widgets.devices.labels.show-qr") }}
      </button>
      <img
        v-if="qr"
        class="qr-code"
        :class="{ hidden: this.showQR }"
        :src="qr"
        alt="QR Code for config of mobile devices"
      />
      <button type="button" class="delete" @click="deleteDevice">
        {{ $t("dashboard.widgets.devices.labels.delete") }}
      </button>
      <button
        type="button"
        v-if="$props.config"
        class="download"
        @click="downloadConfig"
      >
        {{ $t("dashboard.widgets.devices.labels.download") }}
      </button>
    </td>
    <button v-if="!this.showMore" class="show-more" @click="toggleMore">
      {{ $t("dashboard.widgets.devices.labels.more") }}
    </button>
    <button v-if="this.showMore" class="show-less" @click="toggleMore">
      {{ $t("dashboard.widgets.devices.labels.less") }}
    </button>
  </tr>
</template>

<script>
import NumberInput from "components/Inputs/Number";
import TextInput from "components/Inputs/Text";
import CheckBox from "components/Inputs/CheckBox";
import Select from "components/Inputs/Select";
import { downloadText } from "../lib/download";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";

export default {
  emits: ["cancel-new-device", "saved", "removed"],
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
    additionalNames: Array,
    MTU: Number,
    config: String,
  },
  data() {
    return {
      invalidIPv4Message: "",
      invalidIPv6Message: "",
      invalidAdditionalDNSServersMessage: "",
      invalidAdditionalNames: "",
      invalidName: "",
      internalDeviceCacheForNewDevices: {},
      showMore: false,
      showQR: true,
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
  },
  mounted() {},
  methods: {
    toggleMore() {
      this.showMore = !this.showMore;
    },
    toggleQR() {
      this.showQR = !this.showQR;
    },
    downloadConfig() {
      const config = this.devices.find(
        (device) => this.$props.id === device.id
      )["config"];
      downloadText(config, `${this.$props.name}.conf`);
    },
    getNextHighestIPv4() {
      let nextHighest = 2;

      let dev = this.devices
        .map((device) => device.ip.v4)
        .sort((first, second) => first - second);
      dev.forEach((ip) => {
        if (ip === nextHighest) {
          nextHighest = ip + 1;
        }
      });
      return nextHighest;
    },
    deleteDevice() {
      if (!this.$props.id) {
        this.$emit("cancel-new-device");
      } else {
        this.$store.dispatch("removeDevice", { id: this.$props.id });
        this.$emit("removed");
      }
    },
    updateType(type) {
      this.save({ type });
    },
    updateIP({ v4, v6 }) {
      const ip = {};
      if (v4) {
        ip.v4 = v4;
      }
      if (v6) {
        ip.v6 = v6;
      }
      this.save({ ip });
    },
    updateName(name) {
      this.save({ name });
    },
    updateAdditionalDNSServers(serverString) {
      const servers = serverString.split(",").map((entry) => {
        return entry.trim();
      });
      this.save({ additionalDNSServers: servers });
    },
    updateAdditionalNames(nameString) {
      const names = nameString.split(",").map((entry) => {
        return entry.trim();
      });
      this.save({ additionalNames: names });
    },
    validateAdditionalDNSServers(serverString) {
      const correct =
        /^([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3},?)+$/.test(
          serverString
        );
      if (!correct) {
        this.invalidAdditionalDNSServersMessage = this.$t(
          "errors.deviceAdditionalDNSServers"
        );
      }
      return correct;
    },
    validateAdditionalNames(nameString) {
      const correct = /^[0-9A-Za-z-.,]+$/.test(nameString);
      if (!correct) {
        this.invalidAdditionalNames = this.$t(
          "errors.deviceAdditionalNamesWrong"
        );
        return false;
      }
      const names = nameString.split(",").map((entry) => {
        return entry.trim();
      });
      let taken = false;
      outerloop: for (let device of this.devices) {
        for (let newName of names) {
          if (device.name === newName) {
            taken = true;
            break outerloop;
          }
          if (device.additionalNames) {
            for (let name of device.additionalNames) {
              if (name === newName) {
                taken = true;
                break outerloop;
              }
            }
          }
        }
      }
      if (taken) {
        this.invalidAdditionalNames = this.$t(
          "errors.deviceAdditionalNamesTaken"
        );
        return false;
      }
      return true;
    },
    validateMTU(mtu) {
      return parseInt(mtu) >= 1320 && parseInt(mtu) < 1800;
    },
    validateName(name) {
      const correct = /^[0-9A-Za-z-]+$/.test(name);
      if (!correct) {
        this.invalidName = this.$t("errors.deviceNameWrong");
        return false;
      }

      let taken = false;
      outerloop: for (let device of this.devices) {
        if (device.name === name) {
          taken = true;
          break outerloop;
        }
        if (device.additionalNames) {
          for (let additionalName of device.additionalNames) {
            if (additionalName === name) {
              taken = true;
              break outerloop;
            }
          }
        }
      }
      if (taken) {
        this.invalidName = this.$t("errors.deviceNameTaken");
        return false;
      }
      return true;
    },
    updateMTU(mtu) {
      this.save({ MTU: mtu });
    },
    validatePort(port) {
      return parseInt(port) >= 1 && parseInt(port) <= 65535;
    },
    updatePort(port) {
      this.save({ port: port });
    },
    validateIPv4(ip) {
      this.invalidIPv4Message = "";
      if (ip == 1) {
        this.invalidIPv4Message = this.$t("errors.deviceIpServer");
        return false;
      }
      const isIpUsed = this.devices.reduce((prev, next) => {
        return prev || (next.ip.v4 == ip && next.id !== this.$props.id);
      }, false);

      if (isIpUsed) {
        this.invalidIPv4Message = this.$t("errors.deviceIpUsed");
        return false;
      }
      return true;
    },
    validateIPv6(ip) {
      try {
        if (!/^[0-9a-fA-F]{3}[2-9a-eA-E]$/.test(ip)) {
          this.invalidIPv6Message = this.$t("errors.wrongIPv6");
          throw "IPv6 has wrong format";
        }
        const parsedIPv6 = parseInt(ip, 16);

        const correct = parsedIPv6 < 65636 && parsedIPv6 > 1;
        if (!correct) {
          throw "IPv6 is out of range";
        }
        return true;
      } catch (error) {
        this.invalidIPv6Message = this.$t("errors.wrongIPv6");
        return false;
      }
    },
    async save(device) {
      // this cache will slowly build up
      this.internalDeviceCacheForNewDevices = merge(
        cloneDeep(this.$props),
        this.internalDeviceCacheForNewDevices,
        device
      );
      this.$emit("saved", this.internalDeviceCacheForNewDevices);
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
  & .ip-v6,
  .ip-v4 {
    margin-bottom: $spacing-small;
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

.port {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.additionalDNSServers,
.mtu {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

button {
  max-height: 1.5rem;
  margin-top: $spacing-small;
}

.qr-code {
  width: 12rem;
  height: 12rem;
  align-self: center;
  margin-bottom: $spacing-medium;
  margin-top: $spacing-medium;
}

.hidden {
  display: none !important;
}

.required {
  border: dotted $border-medium $primary;
}
</style>
