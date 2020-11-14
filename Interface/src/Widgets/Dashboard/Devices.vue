<template>
  <div id="device-widget">
    <h1>{{ $t("dashboard.widgets.devices.title") }}</h1>
    <DeviceTable
      :devices="devices"
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
import Button from "shared-components/Button";

export default {
  components: { DeviceTable, Button },
  data() {
    return {
      newDevice: undefined,
    };
  },
  computed: {
    devices() {
      if (this.newDevice) {
        return [this.newDevice, ...this.$store.state.devices];
      } else {
        return [...this.$store.state.devices];
      }
    },
  },
  methods: {
    addNewDevice() {
      // this will update the newDevice on this component and trigger
      // the computed to be evaluated again, thus creating a new empty device on top
      // of the ones available in the store.
      this.newDevice = Object.assign({}, this.newDevice);
    },
    removeNewDevice() {
      this.newDevice = undefined;
    },
  },
};
</script>

<style lang="scss" scoped>
#add-device {
  width: 100%;
}
</style>
