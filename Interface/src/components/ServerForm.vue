<template>
  <form :class="{ server: true, mobile: isMobilePage }">
    <div class="field ip">
      <label for="server-ip" @submit.prevent>IP</label>
      <div class="ip-inputs">
        <input
          class="ip-digit"
          :key="1"
          type="number"
          placeholder="000"
          :name="`server-ip-${1}`"
          :value="server.ip[0]"
          @input="
            (e) =>
              updateServer({
                ip: insertNewDigitIntoExistingIPAtIndex(
                  e.target.value,
                  server.ip,
                  0
                ),
              })
          "
        />
        <span>.</span>
        <input
          class="ip-digit"
          :key="2"
          placeholder="000"
          type="number"
          :name="`server-ip-${2}`"
          :value="server.ip[1]"
          @input="
            (e) =>
              updateServer({
                ip: insertNewDigitIntoExistingIPAtIndex(
                  e.target.value,
                  server.ip,
                  1
                ),
              })
          "
        />
        <span>.</span>
        <input
          class="ip-digit"
          :key="3"
          placeholder="000"
          type="number"
          :name="`server-ip-${3}`"
          :value="server.ip[2]"
          @input="
            (e) =>
              updateServer({
                ip: insertNewDigitIntoExistingIPAtIndex(
                  e.target.value,
                  server.ip,
                  2
                ),
              })
          "
        />
        <span>.</span>
        <input
          class="ip-digit"
          :key="4"
          placeholder="000"
          type="number"
          :name="`server-ip-${4}`"
          :value="server.ip[3]"
          @input="
            (e) =>
              updateServer({
                ip: insertNewDigitIntoExistingIPAtIndex(
                  e.target.value,
                  server.ip,
                  3
                ),
              })
          "
        />
        <font-awesome-icon
          v-if="server.ip[0] && server.ip[1] && server.ip[2] && server.ip[3]"
          :icon="['fas', 'check-square']"
          class="check"
        />
      </div>
    </div>
    <div class="field port">
      <label for="server-port">Port</label>
      <div>
        <input
          type="number"
          name="server-port"
          min="1024"
          max="65,535"
          placeholder="1024 - 65636"
          :value="server.port"
          @input="
            (e) => {
              updateServer({ port: parseInt(e.target.value) });
            }
          "
        />
        <font-awesome-icon class="check" v-if="server.port" :icon="['fas', 'check-square']" />
      </div>
    </div>
  </form>
</template>

<script>
import { getKeys } from "../lib/wireguard";

export default {
  data() {
    return {
      fetchingKey: false
    };
  },
  computed: {
    server() {
      return this.$store.state.server;
    },
    isMobilePage() {
      return this.$store.state.websiteBeingViewedOnMobileDevice;
    }
  },
  methods: {
    async updateServer(serverData) {
      try {
        if (!this.server.keys) {
          serverData = Object.assign({}, serverData, {
            keys: await this.getKeyPair()
          });
        }
        this.$store.dispatch("updateServer", serverData);
      } catch (error) {
        this.$store.dispatch(
          "alerts/addWarning",
          `${this.$t("warnings.serverUpdate")} ${this.$t(
            "warnings.documentation"
          )}`
        );
        console.error(error);
      }
    },
    async getKeyPair() {
      if (!this.fetchingKey) {
        try {
          this.fetchingKey = true;
          const keys = await getKeys();
          this.fetchingKey = false;
          return keys;
        } catch (error) {
          this.fetchingKey = false;
          this.$store.dispatch(
            "alerts/addWarning",
            `${this.$t("warnings.keysGeneration")} ${error}. ${this.$t(
              "warnings.documentation"
            )}`
          );
          console.error(error);
        }
      }
    },
    insertNewDigitIntoExistingIPAtIndex(newValue, ip, index) {
      if (parseInt(newValue) > 255) newValue = 255;
      if (index === 3 || index === 0) {
        if (parseInt(newValue) < 1) newValue = 1;
      } else {
        if (parseInt(newValue) < 0) newValue = 0;
      }
      ip.splice(index, 1, newValue);
      return ip;
    }
  }
};
</script>

<style lang="scss" scoped>
.server {
  width: 36rem;
  & .check {
    font-size: $font-medium;
    margin-left: $spacing-small;
    margin-top: auto;
    margin-bottom: auto;
  }

  & .ip {
    display: flex;
    justify-content: space-between;
    margin-top: $spacing-medium;

    label {
      display: inline-block;
    }

    &:first-child {
      margin-top: none;
    }
    .ip-inputs {
      margin-left: auto;
      .ip-digit {
        margin-left: 0;
      }
      .ip-digit {
        // TODO: fix this magic number
        // this keeps the IP input line as long as the one below
        // Research while inputs become huge here when removing the max-width
        margin-left: 0;
      }
      span {
        font-size: $font-medium;
      }
    }
  }

  & .port {
    display: flex;
    justify-content: space-between;
    margin-top: $spacing-medium;
    label {
      display: inline-block;
    }

    &:first-child {
      margin-top: none;
    }
    input {
      margin-left: auto;
      max-width: 7rem;
    }
  }
}

.server.mobile {
  max-width: 100%;
  & .ip {
    flex-direction: column;
    & .ip-inputs {
      margin-left: 0;
    }
  }

  & .port {
    flex-direction: column;

    & input {
      margin-left: 0;
    }
  }
}
</style>
