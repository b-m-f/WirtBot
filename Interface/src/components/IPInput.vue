<template>
  <div id="ip-inputs">
    <input
      ref="ip-1"
      type="number"
      name="1"
      min="1"
      max="255"
      v-on:keyup.enter="() => focusNext(2)"
      placeholder="000"
      @change="(e) => updateIp(e, 0)"
      :value="this.ip[0]"
    />
    <span>.</span>
    <input
      ref="ip-2"
      type="number"
      name="2"
      id
      min="0"
      max="255"
      v-on:keyup.enter="() => focusNext(3)"
      placeholder="000"
      @change="(e) => updateIp(e, 1)"
      :value="this.ip[1]"
    />
    <span>.</span>
    <input
      ref="ip-3"
      type="number"
      name="3"
      min="0"
      max="255"
      v-on:keyup.enter="() => focusNext(4)"
      placeholder="000"
      @change="(e) => updateIp(e, 2)"
      :value="this.ip[2]"
    />
    <span>.</span>
    <input
      ref="ip-4"
      type="number"
      name="4"
      id
      min="1"
      max="255"
      v-on:keyup.enter="() => focusNext(5)"
      placeholder="000"
      @change="(e) => updateIp(e, 3)"
      :value="this.ip[3]"
    />
  </div>
</template>

<script>
export default {
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
    updateIp(event, index) {
      let newValue;
      try {
        newValue = parseInt(event.target.value);
      } catch (error) {
        return;
      }

      this.ip[index] = newValue;

      if (newValue > 255) {
        return;
      }
      if ((index == 3 || index == 0) && newValue < 1) {
        return;
      }
      if (newValue < 0) {
        return;
      }

      // first and last have to be at least 1
      const ipComplete =
        this.ip.reduce((prev, next) => {
          return prev + next;
        }, 0) >= 2 &&
        this.ip[0] > 0 &&
        this.ip[3] > 0;

      this.$emit("change", { ip: this.ip, valid: ipComplete });
    },
  },
};
</script>

<style lang="scss" scoped>
#ip-inputs {
  max-width: 100%;

  & input {
    width: 5rem;
  }
}
</style>
