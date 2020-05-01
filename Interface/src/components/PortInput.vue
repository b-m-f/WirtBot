<template>
  <input
    ref="port"
    id="port"
    :value="port"
    type="number"
    name="port"
    min="1024"
    max="65636"
    placeholder="1024-65636"
    @change="updatePort"
  />
</template>

<script>
export default {
  props: {
    port: { type: Number, default: undefined },
  },
  methods: {
    updatePort(event) {
      let newValue;
      try {
        newValue = parseInt(event.target.value);
      } catch (error) {
        return;
      }
      if (newValue >= 1024 && newValue <= 65535) {
        this.port = newValue;
        this.$emit("change", { port: newValue, valid: true });
      } else {
        this.$emit("change", { port: newValue, valid: false });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#port {
  max-width: 100%;
}
</style>
