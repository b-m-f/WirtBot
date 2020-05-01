<template>
  <!-- MOBILE -->
  <div v-if="isMobilePage" class="mobile">
    <form @submit.prevent="addDevice">
      <div class="device new-device">
        <input
          class="name"
          type="text"
          name="new-device"
          v-model="newDevice.name"
          required
          :placeholder="$t('device.name')"
        />
        <!-- TODO: add tooltip -->
        <div class="ip">
          <label for="device-ip">IP</label>
          <p class="subnet">{{ subnet }}</p>
          <input
            type="number"
            :name="`device-ip`"
            placeholder="000"
            v-model="newDevice.ip"
            min="2"
            max="255"
            required
          />
        </div>
        <select required v-model="newDevice.type" class="device-typ">
          <option disabled value>{{ $t("device.type") }}</option>
          <option :value="type" v-for="type in deviceTypes" :key="type">
            {{
            type
            }}
          </option>
        </select>
        <div class="routed">
          <label for="internet-gateway">{{ $t("device.routeThroughInternet") }}</label>
          <input type="checkbox" name="internet-gateway" v-model="newDevice.routed" />
        </div>
        <button type="submit" id="add-device">
          <font-awesome-icon :icon="['fas', 'plus']" />
        </button>
      </div>
    </form>
    <transition-group class="devices" name="list" tag="div">
      <div class="device" v-for="(device, index) in devices" :key="`device-${index}`">
        <div class="device-data">
          <div class="name">
            <input
              class="name-edit"
              v-if="devicesBeingEdited.includes(device.id)"
              type="text"
              :name="`device-name-${index}`"
              :value="device.name"
              @input="(e) => updateDevice(device, { name: e.target.value })"
              required
            />
            <p v-else>{{ device.name }}</p>
          </div>
          <div class="ip">
            <div v-if="devicesBeingEdited.includes(device.id)" class="ip-edit">
              <p class="subnet">{{ subnet }}</p>
              <input
                type="number"
                :name="`device-ip-${index}`"
                :value="device.ip"
                @input="(e) => updateDevice(device, { ip: e.target.value })"
                required
              />
            </div>
            <p v-else>{{ subnet }}{{ device.ip }}</p>
          </div>
          <select
            required
            @change="(e) => updateDevice(device, { type: e.target.value })"
            v-if="devicesBeingEdited.includes(device.id)"
            class="device-type"
          >
            <option disabled :selected="!device.type">
              {{
              $t("device.type")
              }}
            </option>
            <option
              :value="type"
              v-for="type in deviceTypes"
              :key="type"
              :selected="type === device.type"
            >{{ type }}</option>
          </select>
          <p v-else>{{ device.type }}</p>
          <div>
            <button
              v-if="devicesBeingEdited.includes(device.id)"
              @click.prevent="stopEditingDevice(device.id)"
            >
              <font-awesome-icon :icon="['fas', 'check']" />
            </button>
            <button v-else @click.prevent="editDevice(device.id)">
              <font-awesome-icon :icon="['fas', 'edit']" />
            </button>
            <button @click.prevent="removeDevice(device)">
              <font-awesome-icon :icon="['fas', 'trash']" />
            </button>
          </div>
        </div>
        <div class="routed">
          <label for="internet-gateway">{{ $t("device.routeThroughInternet") }}</label>
          <input
            type="checkbox"
            name="internet-gateway"
            v-model="device.routed"
            @change="(e) => updateDevice(device, { routed: e.target.checked })"
          />
        </div>
        <div v-if="device.config" class="config">
          <div v-if="device.qr">
            <img class="qr-code" :src="device.qr" alt="QR Code for config of mobile devices" />
          </div>
          <button @click.prevent>
            <font-awesome-icon :icon="['fas', 'file-download']" />
          </button>
        </div>
      </div>
    </transition-group>
  </div>
  <!-- DESKTOP -->
  <form @submit.prevent="addDevice" v-else class="desktop" ref="desktop-form">
    <table>
      <thead>
        <th>
          <p>{{ $t("device.name") }}</p>
        </th>
        <th>
          <p>{{ $t("device.ipInPrivateNetwork") }}</p>
        </th>
        <th>
          <p>{{ $t("device.type") }}</p>
        </th>
        <th>
          <p>{{ $t("device.routeThroughInternet") }}</p>
        </th>
        <th>
          <p>{{ $t("device.config") }}</p>
        </th>
        <th></th>
      </thead>
      <tbody>
        <tr>
          <td>
            <input type="text" name="device-name" v-model="newDevice.name" />
          </td>
          <td>
            <div class="device-ip">
              <p>{{ subnet }}</p>
              <input
                type="number"
                name="device-ip"
                max="255"
                min="2"
                placeholder="000"
                required
                v-model="newDevice.ip"
              />
            </div>
          </td>
          <td>
            <select required v-model="newDevice.type" class="device-type">
              <option disabled>{{ $t("device.type") }}</option>
              <option :value="type" v-for="type in deviceTypes" :key="type">
                {{
                type
                }}
              </option>
            </select>
          </td>
          <td>
            <input type="checkbox" name="internet-gateway" v-model="newDevice.routed" />
          </td>
          <td></td>
          <td>
            <button type="submit" id="add-device">
              <font-awesome-icon :icon="['fas', 'plus']" />
            </button>
          </td>
        </tr>
        <tr v-for="(device, index) in devices" :key="index" class="device">
          <td>
            <input
              v-if="devicesBeingEdited.includes(device.id)"
              type="text"
              :name="`device-name-${device.id}`"
              :value="device.name"
              @input="
                (e) =>
                  updateDevice(Object.assign(device, { name: e.target.value }))
              "
            />
            <p v-else>{{ device.name }}</p>
          </td>
          <td>
            <div class="device-ip" v-if="devicesBeingEdited.includes(device.id)">
              <p>{{ subnet }}</p>
              <input
                min="2"
                max="255"
                type="number"
                :name="`device-ip-${device.id}`"
                :value="device.ip"
                @input="
                  (e) =>
                    updateDevice(Object.assign(device, { ip: e.target.value }))
                "
              />
            </div>
            <p v-else>{{ subnet }}{{ device.ip }}</p>
          </td>
          <td>
            <select
              v-if="devicesBeingEdited.includes(device.id)"
              required
              :value="device.type"
              @change="
                (e) =>
                  updateDevice(Object.assign(device, { type: e.target.value }))
              "
            >
              <option disabled>{{ $t("device.type") }}</option>
              <option :value="type" v-for="type in deviceTypes" :key="type">
                {{
                type
                }}
              </option>
            </select>
            <p v-else>{{ device.type }}</p>
          </td>
          <td>
            <input
              type="checkbox"
              name="internet-gateway"
              :checked="device.routed"
              @change="
                (e) => updateDevice(device, { routed: e.target.checked })
              "
            />
          </td>
          <td v-if="device.config">
            <div v-if="device.qr">
              <img class="qr-code" :src="device.qr" alt="QR Code for config of mobile devices" />
            </div>
            <button @click.prevent="downloadConfig(device.config, device.name)">
              <font-awesome-icon :icon="['fas', 'file-download']" />
            </button>
          </td>
          <td class="controls">
            <button
              v-if="!devicesBeingEdited.includes(device.id)"
              @click.prevent="editDevice(device.id)"
            >
              <font-awesome-icon :icon="['fas', 'edit']" />
            </button>
            <button v-else @click.prevent="stopEditingDevice(device.id)">
              <font-awesome-icon :icon="['fas', 'check']" />
            </button>
            <button @click.prevent="removeDevice(device)">
              <font-awesome-icon :icon="['fas', 'trash']" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </form>
</template>

<script>
import { downloadText } from "../lib/download";

// https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id/6860916#6860916
function guidGenerator() {
  var S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

export default {
  computed: {
    devices() {
      return this.$store.state.devices;
    },
    deviceTypes() {
      return this.$store.state.deviceTypes;
    },
    isMobilePage() {
      return this.$store.state.websiteBeingViewedOnMobileDevice;
    },
    subnet() {
      return this.$store.state.server.subnet;
    }
  },
  data() {
    return {
      openDevices: new Set(),
      newDevice: {},
      devicesBeingEdited: []
    };
  },
  updated() {
    if (this.isMobilePage) {
      this.devices.forEach((device, index) => {
        if (!device.name) {
          this.openDevices.add(index);
        }
      });
    }
  },
  methods: {
    toggleCollapsedDevice(deviceIndex) {
      if (this.openDevices.has(deviceIndex)) {
        this.openDevices.delete(deviceIndex);
      } else {
        this.openDevices.add(deviceIndex);
      }
    },
    async updateDevice(device, deviceData) {
      try {
        const newDevice = Object.assign({}, device, deviceData);
        this.$store.dispatch("updateDevice", newDevice);
      } catch (error) {
        const errorMsg = `${this.$t(
          "warnings.deviceUpdate"
        )} ${error}. ${this.$t("warnings.documentation")}`;
        this.$store.dispatch("alerts/addWarning", errorMsg);
        console.error(errorMsg);
      }
    },
    addDevice() {
      // TODO: test that only 1 device with the same IP can be added
      const deviceIps = this.devices.map(device => device.ip);
      if (deviceIps.includes(this.newDevice.ip)) {
        this.$store.dispatch(
          "alerts/addWarning",
          this.$t("warnings.deviceIpUsed")
        );
        return;
      }
      if (parseInt(this.newDevice.ip) == 1) {
        this.$store.dispatch(
          "alerts/addWarning",
          this.$t("warnings.deviceIpServer")
        );
        return;
      }
      try {
        this.$store.dispatch(
          "addDevice",
          Object.assign(this.newDevice, {
            id: guidGenerator()
          })
        );

        this.newDevice = {
          ip: this.getNextHighestIp([...this.devices, this.newDevice])
        };
      } catch (error) {
        const errorMsg = `${this.$t("warnings.deviceAdd")} ${error}. ${this.$t(
          "warnings.documentation"
        )}`;
        this.$store.dispatch("alerts/addWarning", this.error);
        console.error(errorMsg);
      }
      ``;
    },
    getNextHighestIp(devices) {
      let nextHighest = 2;
      devices
        .map(device => device.ip)
        .forEach(ip => {
          if (parseInt(ip) === nextHighest) {
            nextHighest = parseInt(ip) + 1;
          }
          // TODO: Test this method completely
          // TODO: Test and refactor to make sure this throws an error at 255
        });
      return nextHighest;
    },
    editDevice(id) {
      this.devicesBeingEdited = [...this.devicesBeingEdited, id];
    },
    stopEditingDevice(idToRemove) {
      this.devicesBeingEdited = this.devicesBeingEdited.filter(
        id => id !== idToRemove
      );
    },
    removeDevice(device) {
      this.$store.dispatch("removeDevice", device);
    },
    downloadConfig(config, name) {
      downloadText(config, `${name}.conf`);
    }
  }
};
</script>

<style lang="scss" scoped>
.qr-code {
  width: 150px;
}

.mobile {
  max-width: calc(100vw - #{$spacing-small} - #{$spacing-small});

  .device {
    display: flex;
    justify-content: space-around;
    border: 1px solid black;
    border-radius: 5px;
    margin-bottom: $spacing-medium;
    padding: $spacing-small;

    input[type="number"] {
      max-width: 3rem;
    }
  }

  .new-device {
    flex-direction: column;
    button {
      margin-top: $spacing-small;
    }
    input.name {
      display: flex;
      margin-bottom: $spacing-small;
    }

    .ip {
      display: flex;
      margin-bottom: $spacing-small;

      label {
        margin-right: auto;
      }
    }
  }

  .routed {
    margin-top: $spacing-small;
    display: flex;
    justify-content: space-between;
    input {
      scale: 2;
      margin-right: $spacing-medium;
    }
  }

  p {
    margin: 0;
  }

  .devices {
    flex-wrap: wrap;
    & .device {
      & .routed {
        margin-top: $spacing-small;
        display: flex;
        flex-direction: column;
        & input {
          margin: auto 0;
        }
      }
    }
  }

  .device-data {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .config {
    display: flex;
    align-items: center;
  }

  .name-edit {
    max-width: 12rem;
  }

  .ip-edit {
    margin-top: $spacing-small;
    margin-bottom: $spacing-small;
    display: flex;
  }
}

.desktop {
  & select {
    font-size: $font-medium;
  }

  & th {
    padding-bottom: $spacing-medium;
  }

  & input[type="checkbox"] {
    scale: 2;
  }

  & p {
    margin: 0;
  }
  & tbody {
    & tr {
      &:first-child {
        & td {
          border-top: 4px solid black;
          padding-top: $spacing-small;
        }
      }
      & td {
        padding-top: $spacing-small;
        padding-bottom: $spacing-small;
        border-bottom: 1px solid black;
        border-left: 1px solid black;

        text-align: center;
        vertical-align: middle;

        &:last-child {
          border-right: 1px solid black;
        }

        &.controls {
          padding: 0 $spacing-small;
          button {
            margin: 0 auto;
          }
          button:first-child {
          }
        }
      }
    }
  }

  .device-ip {
    display: flex;
    justify-content: center;
    input {
      max-width: 4rem;
    }
  }

  .name {
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 1s;
}

.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
