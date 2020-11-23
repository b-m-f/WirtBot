<template>
  <div id="device-table" :class="{ mobile: isMobilePage }">
    <form ref="form">
      <table v-if="!isMobilePage">
        <tbody>
          <DeviceRow
            v-for="(device, index) in devices"
            :key="device.id || 'newDevice'"
            :id="device.id"
            :ip="device.ip"
            :type="device.type"
            :name="device.name"
            :routed="device.routed"
            :qr="device.qr"
            :config="device.config"
            :additionalDNSServers="device.additionalDNSServers"
            :MTU="device.MTU"
            @saved="save"
            @cancel-new-device="cancelNewDevice"
            :class="{ even: index % 2 == 0 }"
          />
        </tbody>
      </table>
      <DeviceRow
        v-else
        v-for="(device, index) in devices"
        :key="device.id || 'newDevice'"
        ref="mobile-row"
        :qr="device.qr"
        :id="device.id"
        :ip="device.ip"
        :config="device.config"
        :type="device.type"
        :name="device.name"
        :additionalDNSServers="device.additionalDNSServers"
        :MTU="device.MTU"
        :routed="device.routed"
        @saved="save"
        @cancel-new-device="cancelNewDevice"
        :class="{ even: index % 2 == 0 }"
      />
    </form>
  </div>
</template>

<script>
import DeviceRow from "./DeviceRow";
import { guidGenerator } from "../lib/helpers";

export default {
  components: { DeviceRow },
  props: { devices: Array },
  data() {
    return {};
  },
  computed: {
    isMobilePage() {
      return this.$store.state.websiteBeingViewedOnMobileDevice;
    },
  },
  methods: {
    cancelNewDevice() {
      this.$emit("cancel-new-device");
    },
    async updateDevice(device) {
      const old = this.devices.find((dvc) => dvc.id === device.id);
      const updatedDevice = Object.assign({}, old, device);
      try {
        await this.$store.dispatch("updateDevice", updatedDevice);

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    async save({ type, id, ip, name, routed, additionalDNSServers, MTU }) {
      // Only save if all required attributes have been provided
      if (type && ip && name) {
        await this.saveDevice({
          ip,
          type,
          name,
          id,
          routed,
          additionalDNSServers,
          MTU,
        });
      }
    },
    reportValidity() {
      this.$refs.form.reportValidity();
    },
    async saveDevice({
      ip,
      name,
      type,
      id,
      routed,
      additionalDNSServers,
      MTU,
    }) {
      if (id) {
        return await this.updateDevice({
          ip,
          name,
          type,
          id,
          routed,
          additionalDNSServers,
          MTU,
        });
      }

      const newId = guidGenerator();
      const device = {
        id: newId,
        ip,
        name,
        type,
        routed,
        additionalDNSServers,
        MTU,
      };
      await this.$store.dispatch("addDevice", device);
      this.$emit("device-saved");
      return true;
    },
  },
};
</script>

<style lang="scss">
#device-table {
  & table {
    width: calc(100% - #{$spacing-medium * 2}); // removing the padding
    & tr {
      width: 100%;
      height: 100%;
      display: grid;
      grid-gap: $spacing-medium;
      grid-template-areas: "one two three " "four five six";
      grid-template-columns:
        calc(33.3% - #{$spacing-medium})
        calc(33.3% - #{$spacing-medium}) calc(33.3% - #{$spacing-medium});
      padding-top: $spacing-medium;
      padding-bottom: $spacing-medium;
      &.even {
        background-color: $grey-light;
      }
    }
  }
  &.mobile {
    & form {
      display: flex;
      flex-direction: column;
      align-items: center;
      & tr {
        width: 30%;
        min-width: 18rem;
        margin-top: $spacing-small;
        margin-left: $spacing-small;
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        justify-content: center;
        padding: 0;

        &.table-row {
          border: $grey-light $border-small solid;
          padding: $spacing-medium;

          & .column-one {
            padding-left: 0;
            flex-direction: row;
            & p {
              font-size: $heading-medium;
            }
          }
          & .column-two {
            flex-direction: row;
            padding-top: $spacing-small;
          }
          & .column-three {
            padding-top: $spacing-small;
            flex-direction: row;
          }
          & .column-four {
            padding-top: $spacing-small;
            flex-direction: column;
          }
          & .column-five {
            flex-direction: column;
            padding-right: 0;
            padding-top: $spacing-small;
          }
          & .column-six {
            flex-direction: column;
            padding-right: 0;
            padding-top: $spacing-small;
          }
          &.even {
            background-color: $grey-light;
          }
        }
      }
    }
  }
  & .column-one {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    grid-area: one;
  }
  & .column-two {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    grid-area: two;
  }
  & .column-three {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    grid-area: three;
  }
  & .column-four {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    grid-area: four;
  }
  & .column-five {
    padding-right: $spacing-medium;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    grid-area: five;
  }
  & .column-six {
    padding-right: $spacing-medium;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    grid-area: six;
  }
}
</style>
