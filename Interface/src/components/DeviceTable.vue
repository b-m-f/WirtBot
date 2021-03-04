<template>
  <div id="device-table">
    <form ref="form">
      <table>
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
      if (type && (ip.v4 || ip.v6) && name) {
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
        calc(33.3% - #{$spacing-medium}) calc(33.3%);
      padding-top: $spacing-medium;
      padding-bottom: $spacing-medium;
      padding-left: $spacing-small;
      padding-right: $spacing-small;
      &.even {
        background-color: $grey-light;
      }
      @media screen and (max-width: $mobile-width) {
        grid-template-areas: "one" "two" "three" "four" "five" "six";
        grid-template-columns: 100%;
      }
      @media screen and (min-width: $mobile-width) and (max-width: $tablet-width) {
        grid-template-areas: "one two" "three four" "five six";
        grid-template-columns: calc(50% - #{$spacing-medium}) calc(50%);
      }
    }
  }
  & .column-one {
    display: flex;
    justify-content: flex-start;
    align-content: center;
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
