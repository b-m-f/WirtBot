<template>
  <div id="device-widget">
    <h1>{{ $t("dashboard.widgets.devices.title") }}</h1>
    <DeviceTable
      :devices="devicesToBeDisplayedByTable || this.devices"
      @device-saved="removeNewDevice"
      @cancel-new-device="removeNewDevice"
    />
    <Button id="add-device" uppercase @click="addNewDevice">{{
      $t("dashboard.widgets.devices.addDevice")
    }}</Button>
  </div>
</template>

<script>
import DeviceTable from "components/DeviceTable";
import Button from "components/Button";

export default {
  components: { DeviceTable, Button },
  data() {
    return {
      newDevice: undefined,
      // This will be undefined on first render as the store should be accessed via computed properties.
      // With this knowledge in mind the :devices parameter to the DeviceTables has a fallback to the computed devices property.
      // Only when a new device is to be added will this property become active on this component
      devicesToBeDisplayedByTable: this.devices,
    };
  },
  computed: {
    devices() {
      return this.$store.state.devices;
    },
  },
  methods: {
    addNewDevice() {
      this.devicesToBeDisplayedByTable = [
        ...this.devices,
        Object.assign({}, this.newDevice),
      ];
    },
    removeNewDevice() {
      this.devicesToBeDisplayedByTable = this.devices;
    },
  },
};
</script>

<style lang="scss" scoped>
#add-device {
  width: 100%;
}
</style>
