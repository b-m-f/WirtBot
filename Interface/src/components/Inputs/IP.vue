<template>
  <div id="ip-inputs">
    <NumberInput
      ref="ip-1"
      :name="'1'"
      :min="1"
      :max="255"
      v-on:keyup.enter="() => focusNext(2)"
      :placeholder="'000'"
      @change="(e) => updateIp(e, 0)"
      :value="this.ip[0]"
    />
    <span>.</span>
    <NumberInput
      ref="ip-2"
      :name="'2'"
      :min="0"
      :max="255"
      v-on:keyup.enter="() => focusNext(3)"
      :placeholder="'000'"
      @change="(e) => updateIp(e, 1)"
      :value="this.ip[1]"
    />
    <span>.</span>
    <NumberInput
      ref="ip-3"
      :name="'3'"
      :min="0"
      :max="255"
      v-on:keyup.enter="() => focusNext(4)"
      :placeholder="'000'"
      @change="(e) => updateIp(e, 2)"
      :value="this.ip[2]"
    />
    <span>.</span>
    <NumberInput
      ref="ip-4"
      :name="'4'"
      :min="1"
      :max="255"
      v-on:keyup.enter="() => focusNext(5)"
      :placeholder="'000'"
      @change="(e) => updateIp(e, 3)"
      :value="this.ip[3]"
    />
  </div>
</template>

<script>
import NumberInput from "components/Inputs/Number";
export default {
  components: { NumberInput },
  props: {
    ip: {
      type: Array,
      default: () => [undefined, undefined, undefined, undefined],
    },
  },
  methods: {
    focusNext(next) {
      const map = { 1: "ip-1", 2: "ip-2", 3: "ip-3", 4: "ip-4" };
      if (this.$refs[map[next]]) {
        this.$refs[map[next]].focus();
      }
    },
    updateIp(ip, index) {
      let newValue;
      try {
        newValue = parseInt(ip);
      } catch (error) {
        return;
      }

      const newIp = this.ip;
      newIp[index] = newValue;

      if (newValue > 255) {
        this.$emit("change", { ip: newIp, valid: false });
        return;
      }
      if ((index == 3 || index == 0) && newValue < 1) {
        this.$emit("change", { ip: newIp, valid: false });
        return;
      }
      if (newValue < 0) {
        this.$emit("change", { ip: newIp, valid: false });
        return;
      }

      // first and last have to be at least 1
      const ipComplete =
        newIp.reduce((prev, next) => {
          return prev + next;
        }, 0) >= 2 &&
        this.ip[0] > 0 &&
        this.ip[3] > 0;

      this.$emit("change", { ip: newIp, valid: ipComplete });
    },
  },
};
</script>

<style lang="scss" scoped>
#ip-inputs {
  max-width: 100%;

  & input {
    width: 3rem;
  }
}
</style>
