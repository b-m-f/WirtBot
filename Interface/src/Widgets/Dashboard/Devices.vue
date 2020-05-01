<template>
  <div>
    <h1>{{ $t("dashboard.widgets.devices.title") }}</h1>
    <DeviceTable
      :devices="devices"
      @deviceSaved="removeNewDevice"
      :expanded="expertMode"
      @cancelNewDevice="removeNewDevice"
    />
    <Button
      id="add-device"
      uppercase
      @click="addNewDevice"
    >{{ $t("dashboard.widgets.devices.addDevice") }}</Button>
  </div>
</template>

<script>
import DeviceTable from "../../components/DeviceTable";
import Button from "../../components/Button";

export default {
  components: { DeviceTable, Button },
  data() {
    return {
      newDevice: undefined
    };
  },
  props: {
    expertMode: Boolean
  },
  computed: {
    devices() {
      if (this.newDevice) {
        return [this.newDevice, ...this.$store.state.devices];
      } else {
        return [...this.$store.state.devices].reverse();
      }
    }
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
    }
  }
};
</script>

<style lang="scss" scoped>
#expert-mode {
  & h2 {
    text-align: center;
    margin-bottom: 0;
    margin-right: auto;
  }
  // set the height to be same as h2 even when h2 is not displayed
  height: $heading-medium;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  & label {
    margin-right: $spacing-small;
  }
}

#add-device {
  width: 100%;
}
</style>
