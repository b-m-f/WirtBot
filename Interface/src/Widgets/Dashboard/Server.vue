<template>
  <div id="server-widget">
    <h1>{{ $t("dashboard.widgets.server.title") }}</h1>
    <div class="row">
      <label>{{ $t("dashboard.widgets.server.name") }}</label>
      <TextInput :value="server.name" name="server-name" @change="updateName" />
    </div>
    <div class="row">
      <label>{{ $t("dashboard.widgets.server.ip") }}</label>
      <IPInput
        :ip="server.ip.v4"
        @change="({ ip, valid }) => updateIp({ ip: { v4: ip }, valid })"
      />
    </div>
    <div class="row">
      <label>{{ $t("dashboard.widgets.server.hostname") }}</label>
      <TextInput
        :value="server.hostname"
        name="server-hostname"
        id="server-hostname"
        @change="updateHostname"
      />
    </div>
    <div class="row">
      <label>{{ $t("dashboard.widgets.server.port") }}</label>
      <NumberInput
        name="server-port"
        :value="server.port"
        @change="updatePort"
        :validate="validatePort"
        :invalidMessage="$t('warnings.serverPort')"
        placeholder="1024-65636"
      />
    </div>
    <div class="row">
      <label>{{ $t("dashboard.widgets.server.subnetv4") }}</label>
      <TextInput
        :value="server.subnet.v4"
        name="server-subnet-v4"
        id="server-subnet-v4"
        @change="(subnet) => updateSubnet({ v4: subnet })"
        :invalidMessage="$t('warnings.wrongIPv4Subnet')"
        :validate="validSubnetV4"
      />
    </div>
    <div class="row">
      <label>{{ $t("dashboard.widgets.server.subnetv6") }}</label>
      <TextInput
        :value="server.subnet.v6"
        name="server-subnet-v6"
        id="server-subnet-v6"
        @change="(subnet) => updateSubnet({ v6: subnet })"
        :invalidMessage="$t('warnings.wrongIPv6Subnet')"
        :validate="validSubnetV6"
      />
    </div>
    <Button id="download" @click="downloadConfig" v-if="server.config">
      {{ $t("dashboard.widgets.server.download") }}
    </Button>
  </div>
</template>
aaa
<script>
import NumberInput from "components/Inputs/Number";
import TextInput from "components/Inputs/Text";
import IPInput from "components/Inputs/IP";
import Button from "shared-components/Button";
import { downloadText } from "../../lib/download";

export default {
  components: { NumberInput, IPInput, Button, TextInput },
  computed: {
    server() {
      return this.$store.state.server;
    },
  },
  methods: {
    downloadConfig() {
      const config = this.server.config;
      downloadText(config, `server.conf`);
    },
    updateHostname(hostname) {
      this.$store.dispatch("updateServer", { hostname });
    },
    validSubnetV4(subnet) {
      const parts = subnet.split(".").map((part) => {
        try {
          const number = parseInt(part);
          if (isNaN(number)) {
            throw "Not a number";
          }
        } catch (error) {
          return -1;
        }
      });

      if (parts.length !== 3) {
        return false;
      }
      if (parts[0] < 1) {
        return false;
      }

      for (let part of parts) {
        if (part > 255 || part < 0) {
          return false;
        }
      }

      return true;
    },
    validSubnetV6(subnet) {
      const parts = subnet.split(":");
      // Make sure that at least the first part is given correctly
      try {
        const firstPart = parseInt(parts[0], 16);
        if (firstPart < 1 || firstPart > 65535) {
          return false;
        }
      } catch (error) {
        return false;
      }
      console.log(parts);

      // take care of shorthand syntax
      const potentialShortHandIndex = parts.findIndex((part) => {
        // empty string would occur if a split between two : has no element
        return part === "";
      });
      if (potentialShortHandIndex > -1) {
        if (parts[parts.length - 1] === "") {
          if (potentialShortHandIndex === parts.length - 1) {
            // only 1 colon was appended
            return false;
          }
          parts.pop();
        }
        parts.splice(potentialShortHandIndex, 1);
        const amountToBeInserted = 7 - parts.length;
        const newParts = [...Array(amountToBeInserted)].map(() => "0000");
        parts.splice(potentialShortHandIndex, 0, ...newParts);
      }

      if (parts.length !== 7) {
        // no shorthand was given and also not enough parts
        return false;
      }

      const partsAsInt = parts.map((part) => {
        if (!part.match(/^[0-9A-Fa-f]{1,4}$/)) {
          return -1;
        }
        try {
          return parseInt(part, 16);
        } catch (error) {
          return -1;
        }
      });

      for (let part of partsAsInt) {
        if (part > 65535 || part < 0) {
          return false;
        }
      }

      return true;
    },

    updateSubnet({ v4, v6 }) {
      if (v4 && this.validSubnetV4(v4)) {
        this.$store.dispatch("updateServer", {
          subnet: { ...this.server.subnet, v4 },
        });
      }
      if (v6 && this.validSubnetV6(v6)) {
        this.$store.dispatch("updateServer", {
          subnet: { ...this.server.subnet, v6 },
        });
      }
    },
    updateName(name) {
      this.$store.dispatch("updateServer", { name });
    },
    updateIp({ ip, valid }) {
      if (valid) {
        this.$store.dispatch("updateServer", { ip });
        this.blocked = false;
      } else {
        this.blocked = true;
      }
    },
    validatePort(port) {
      return port > 1024 && port < 65636;
    },
    updatePort(port) {
      this.$store.dispatch("updateServer", { port });
      this.blocked = false;
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

#download {
  &.button {
    max-width: 20rem;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
