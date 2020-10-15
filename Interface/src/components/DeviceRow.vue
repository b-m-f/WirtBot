<template>
  <!-- TODO: return multiple <td> elements from this component when possible in vue3 -->
  <!-- This will allow the device table to wrap them correctly, and then use display: grid on the mobile table -->
  <tr
    v-if="editingMode"
    :class="{ mobile: isMobilePage, 'table-row': true, editing: 'true' }"
  >
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
            ref="ip-input"
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
            ref="ip-input"
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
        <input
          type="text"
          name="MTU"
          class="MTU"
          :value="MTU"
          :placeholder="$t('dashboard.widgets.devices.placeholder.MTU')"
          @input="(e) => updateMTU(e.target.value)"
          ref="MTU"
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
          :value="additionalDNSServers"
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
        <input type="checkbox" name="routed" :value="internalRouted" />
      </div>
    </td>
    <td class="column-six">
      <button class="save" @click="save">Save</button>
      <button class="stop" @click="stopEditingMode">Stop</button>
    </td>
  </tr>

  <tr
    v-else
    class="table-row"
    :class="{
      mobile: isMobilePage,
      'table-row': true,
      'device-overview': true,
    }"
  >
    <td class="column-one">
      <div class="name">
        <label>{{ $t("dashboard.widgets.devices.labels.name") }}</label>
        <p>{{ name }}</p>
      </div>
    </td>
    <td class="column-two">
      <div class="ip-v4">
        <label>{{ $t("dashboard.widgets.devices.labels.ipv4") }}</label>
        <p>{{ subnet.v4 }}{{ ip.v4 }}</p>
      </div>
      <!-- <p
        :title="`${subnet.v6}${ip.v6}`"
        v-if="expanded && ip.v6"
      >{{ subnet.v6.substring(0, 4) }}::{{ ip.v6 }}</p>-->
    </td>
    <td class="column-three">
      <div class="type">
        <label>{{ $t("dashboard.widgets.devices.labels.type") }}</label>
        <p>{{ type }}</p>
      </div>
    </td>
    <td class="column-four">
      <div class="routed">
        <label>{{ $t("dashboard.widgets.devices.labels.routed") }}</label>
        <p>{{ routed ? $t("global.words.yes") : $t("global.words.no") }}</p>
      </div>
    </td>
    <td class="column-five">
      <div class="MTU" v-if="expanded">
        <label>{{ $t("dashboard.widgets.devices.labels.MTU") }}</label>
        <p>{{ MTU }}</p>
      </div>
      <div class="additionalDNSServers" v-if="expanded">
        <label>{{
          $t("dashboard.widgets.devices.labels.additionalDNSServers")
        }}</label>
        <ul>
          <li v-for="(server, index) in additionalDNSServers" :key="index">
            {{ server }}
          </li>
        </ul>
      </div>
    </td>
    <td class="column-six">
      <button class="edit" @click="activateEditingMode">Edit</button>
      <button class="delete" @click="deleteDevice">Delete</button>
      <img
        v-if="qr"
        class="qr-code"
        :src="qr"
        alt="QR Code for config of mobile devices"
      />
      <button class="download" @click="downloadConfig">Download</button>
    </td>
  </tr>
</template>

<script>
import { downloadText } from "../lib/download";
import debounce from "lodash/debounce";

export default {
  props: {
    controls: Boolean,
    edit: Boolean,
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
      internalEdit: this.$props.edit,
      internalRouted: this.$props.routed || false,
      internalAdditionalDNSServers: this.$props.additionalDNSServers || [],
      internalMTU: this.$props.MTU,
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
    editingMode() {
      return this.edit || this.internalEdit;
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
    activateEditingMode() {
      this.internalEdit = true;
    },
    stopEditingMode() {
      this.internalEdit = false;

      if (!this.id) {
        this.$emit("cancelNewDevice");
      }
    },
    getNextHighestIPv4() {
      let nextHighest = 2;

      let dev = this.devices.map((device) => device.ip.v4).sort();
      dev.forEach((ip) => {
        if (ip === nextHighest) {
          nextHighest = ip + 1;
        }
        // TODO: Test this method completely
        // TODO: Test and refactor to make sure this throws an error at 255
      });
      return nextHighest;
    },
    deleteDevice() {
      this.$store.dispatch("removeDevice", { id: this.internalId });
      this.stopEditingMode();
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
      });
      this.updatingAdditionalDNSServers();
    },
    updateMTU(mtu) {
      if (this.updatingMTU) {
        this.updatingMTU.cancel();
      }
      this.updatingMTU = debounce(function () {
        try {
          if (parseInt(mtu) >= 1320 && parseInt(mtu) < 1800) {
            this.internalMTU = mtu;
          } else {
            throw "Error";
          }
        } catch (error) {
          this.$refs["MTU"].reportValidity();
          this.$store.dispatch(
            "alerts/addWarning",
            this.$t("warnings.deviceMTU")
          );
        }
      }, 1000);
      this.updatingMTU();
    },
    async checkIPv4(ip) {
      // remove invalidity from field
      this.$refs["ip-input"].setCustomValidity("");

      if (ip == 1) {
        this.$store.dispatch(
          "alerts/addWarning",
          this.$t("warnings.deviceIpServer")
        );
        this.$refs["ip-input"].setCustomValidity(
          this.$t("warnings.deviceIpServer")
        );
        this.$refs["ip-input"].reportValidity();
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
        this.$refs["ip-input"].setCustomValidity(
          this.$t("warnings.deviceIpUsed")
        );
        this.$refs["ip-input"].reportValidity();
        return false;
      } else {
        return true;
      }
    },
    checkIPv6(ip) {
      // remove invalidity from field
      this.$refs["ip-input"].setCustomValidity("");
      if (!/^[0-9A-F]+$/.test(ip)) {
        this.$refs["ip-input"].setCustomValidity(this.$t("warnings.wrongIPv6"));
        this.$refs["ip-input"].reportValidity();
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
      }

      if (this.internalIP.v6) {
        ip6OK = await this.checkIPv6(this.internalIP.v6);
      }

      if (ip4OK && ip6OK) {
        this.internalEdit = false;
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
  margin-bottom: $spacing-small;
}
.editing {
  & .routed {
    display: flex;
    justify-content: space-between;
    margin-bottom: $spacing-small;
  }
  & .ip-input {
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

  & .additionalDNSServers,
  .mtu {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}

.mobile {
  & .new-device {
    & .ip-input {
      flex-direction: column;
    }
  }
}

.edit {
}
.delete {
  margin-top: $spacing-small;
}
.save {
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
