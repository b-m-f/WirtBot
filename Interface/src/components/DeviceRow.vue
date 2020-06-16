<template>
  <!-- TODO: return multiple <td> elements from this component when possible in vue3 -->
  <!-- This will allow the device table to wrap them correctly, and then use display: grid on the mobile table -->
  <tr v-if="editingMode" id="new-device" class="table-row">
    <td class="column-one">
      <input
        type="text"
        name="device-name"
        id="name"
        v-model="internalName"
        required
        placeholder=" "
      />
      <div v-if="expanded"></div>
    </td>
    <td class="column-two" id="ip-input">
      <div id="ip-v4">
        <p>{{ subnet.v4 }}</p>
        <input
          type="number"
          name="device-ipv4"
          id="ip"
          min="2"
          max="255"
          :placeholder="getNextHighestIPv4()"
          :value="internalIP.v4"
          required
          @input="(e) => updateIP({ v4: e.target.value })"
          ref="ip-input"
        />
      </div>
      <div v-if="expanded" id="ip-v6">
        <p :title="subnet.v6">{{ subnet.v6.substring(0, 4) }}::</p>
        <input
          type="text"
          name="ipv6"
          id="ip"
          pattern="^[0-9A-F]+$"
          placeholder="0001-ffff"
          :value="internalIP.v6"
          required
          @input="(e) => updateIP({ v6: e.target.value })"
          ref="ip-input"
        />
      </div>
    </td>
    <td class="column-three">
      <select
        id="device-type"
        :required="true"
        v-model="internalType"
        :class="{
          ['device-type']: true,
        }"
      >
        <option :value="type" v-for="type in deviceTypes" :key="type">{{ type }}</option>
      </select>
    </td>
    <td class="column-four">
      <input
        type="checkbox"
        id="routed"
        v-model="internalRouted"
      >
      <label for="routed">{{ $t("dashboard.widgets.devices.labels.routed") }}</label>
    </td>
    <td class="column-five">
      <div v-if="qr">
        <img class="qr-code" :src="qr" alt="QR Code for config of mobile devices" />
      </div>

      <button @click="downloadConfig">Download</button>
    </td>
    <td class="column-six">
      <button id="save" @click="save">Save</button>
      <button @click="stopEditingMode">Stop</button>
    </td>
  </tr>

  <tr v-else class="table-row device-overview">
    <td class="column-one">
      <p>{{ name }}</p>
    </td>
    <td class="column-two">
      <p>{{ subnet.v4 }}{{ ip.v4 }}</p>
      <!-- <p
        :title="`${subnet.v6}${ip.v6}`"
        v-if="expanded && ip.v6"
      >{{ subnet.v6.substring(0, 4) }}::{{ ip.v6 }}</p>-->
    </td>
    <td class="column-three">
      <p>{{ type }}</p>
    </td>
    <td class="column-four">
      <p>{{ routed ? $t('global.words.yes') : $t('global.words.no') }}</p>
    </td>
    <td class="column-five">
      <div v-if="qr">
        <img class="qr-code" :src="qr" alt="QR Code for config of mobile devices" />
      </div>
      <button @click="downloadConfig">Download</button>
    </td>
    <td class="column-six">
      <button @click="activateEditingMode">Edit</button>
      <button @click="deleteDevice">Delete</button>
    </td>
  </tr>
</template>

<script>
import { downloadText } from "../lib/download";
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
    routed: Boolean
  },
  data() {
    return {
      internalIP: this.$props.ip || {},
      internalName: this.$props.name,
      internalType: this.$props.type || "Linux",
      internalId: this.$props.id,
      selectTouched: false,
      internalEdit: this.$props.edit,
      internalRouted: this.$props.routed || false
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
    }
  },
  mounted() {},
  methods: {
    downloadConfig() {
      const config = this.devices.find(device => device.id === this.internalId)[
        "config"
      ];
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

      let dev = this.devices.map(device => device.ip.v4).sort();
      dev.forEach(ip => {
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
          prev || (next.ip == this.internalIP.v4 && next.id !== this.internalId)
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

      this.$emit("change", {
        id: this.internalId,
        name: this.internalName,
        type: this.internalType,
        ip: this.internalIP,
        routed: this.internalRouted
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#new-device {
  & #ip-input {
    & #ip-v4 {
      margin-bottom: $spacing-small;
    }
    & #ip-v6,
    #ip-v4 {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
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
}

.qr-code {
  width: 100%;
}
</style>
