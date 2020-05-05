<template>
  <div id="device-table" :class="{ mobile: isMobilePage }">
    <form ref="form" @submit.prevent="save">
      <table v-if="!isMobilePage">
        <thead>
          <th class="header-one">
            <p>{{ $t("device.name") }}:</p>
          </th>
          <th class="header-two">
            <p>{{ $t("device.ipInPrivateNetwork") }}:</p>
          </th>
          <th class="header-three">
            <p>{{ $t("device.type") }}:</p>
          </th>
          <th class="header-four">
            <p>{{ $t("device.downloadConfig") }}:</p>
          </th>
        </thead>
        <tbody>
          <DeviceRow
            v-for="(device, index) in devices"
            :key="device.id || 'newDevice'"
            :id="device.id"
            :ip="device.ip"
            :type="device.type"
            :name="device.name"
            :edit="!device.id"
            :qr="device.qr"
            @change="save"
            @cancelNewDevice="cancelNewDevice"
            :class="{ even: index % 2 == 0 }"
            :expanded="expanded"
          />
        </tbody>
      </table>
      <table v-else>
        <DeviceRow
          v-for="(device, index) in devices"
          :key="device.id || 'newDevice'"
          ref="mobile-row"
          :qr="device.qr"
          :id="device.id"
          :ip="device.ip"
          :type="device.type"
          :name="device.name"
          :edit="!device.id"
          @change="save"
          @cancelNewDevice="cancelNewDevice"
          :class="{ even: index % 2 == 0 }"
          :expanded="expanded"
        />
      </table>
    </form>
  </div>
</template>

<script>
import DeviceRow from "./DeviceRow";
export default {
  components: { DeviceRow },
  props: { devices: Array, expanded: Boolean },
  data() {
    return {};
  },
  computed: {
    isMobilePage() {
      return this.$store.state.websiteBeingViewedOnMobileDevice;
    }
  },
  methods: {
    cancelNewDevice() {
      this.$emit("cancelNewDevice");
    },
    async updateDevice(device) {
      const old = this.devices.find(dvc => dvc.id === device.id);
      const updatedDevice = Object.assign({}, old, device);
      try {
        await this.$store.dispatch("updateDevice", updatedDevice);

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    async save({ type, id, ip, name }) {
      await this.saveDevice({
        ip,
        type,
        name,
        id
      });
    },
    reportValidity() {
      this.$refs.form.reportValidity();
    },
    async saveDevice({ ip, name, type, id }) {
      if (!name || !type || (!ip.v4 && !ip.v6)) {
        // TODO: this is calling a method on the child directly, to trigger its form validation
        // Something that should generally be avoided
        this.reportValidity();
        return false;
      }
      if (id) {
        return await this.updateDevice({ ip, name, type, id });
      }
      // https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id/6860916#6860916
      function guidGenerator() {
        var S4 = function() {
          return (((1 + Math.random()) * 0x10000) | 0)
            .toString(16)
            .substring(1);
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

      const newId = guidGenerator();
      const device = {
        id: newId,
        ip,
        name,
        type
      };
      await this.$store.dispatch("addDevice", device);
      this.$emit("deviceSaved");
      return true;
    }
  }
};
</script>

<style lang="scss">
#device-table {
  & table {
    width: calc(100% - #{$spacing-medium * 2}); // removing the padding
    height: 100%;
    & thead {
      width: 100%;
      height: 100%;
      display: grid;
      grid-gap: $spacing-medium;
      grid-template-areas: "header-one header-two header-three header-four";
      grid-template-columns:
        calc(20% - #{$spacing-medium}) calc(20% - #{$spacing-medium})
        calc(20% - #{$spacing-medium}) calc(40% - #{$spacing-medium});
      margin-bottom: $spacing-medium;
    }
    & tr {
      width: 100%;
      height: 100%;
      display: grid;
      grid-gap: $spacing-medium;
      grid-template-areas: "one two three four five";
      grid-template-columns:
        calc(20% - #{$spacing-medium}) calc(20% - #{$spacing-medium})
        calc(20% - #{$spacing-medium}) calc(20% - #{$spacing-medium})
        calc(20% - #{$spacing-medium});
      padding-top: $spacing-medium;
      padding-bottom: $spacing-medium;
      &.even {
        background-color: $grey-light;
      }
    }

    & th {
      text-align: start;
      font-weight: bold;
      color: $primary;
    }
  }
  &.mobile {
    & table {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
    }
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
      align-items: center;
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
          padding-top: $spacing-small;
        }
        & .column-three {
          padding-top: $spacing-small;
          flex-direction: row;
        }
        & .column-four {
          padding-top: $spacing-small;
          flex-direction: row;
        }
        & .column-five {
          flex-direction: row;
          padding-right: 0;
          padding-top: $spacing-small;
        }
        &.even {
          background-color: $grey-light;
        }
      }
    }
  }
  &.header-one {
    grid-area: header-one;
  }
  & .header-two {
    grid-area: header-two;
  }
  & .header-three {
    grid-area: header-three;
  }
  & .header-four {
    grid-area: header-four;
  }

  & .column-one {
    padding-left: $spacing-medium;
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
}
</style>
