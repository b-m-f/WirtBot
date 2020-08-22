<template>
  <input
    ref="port"
    id="port"
    :value="internalPort"
    type="number"
    name="port"
    min="1024"
    max="65636"
    :placeholder="$props.placeholder"
    @change="updatePort"
  />
</template>

<script>
export default {
  props: {
    port: { type: Number, default: undefined },
    placeholder: { type: String, default: "1024-65636" },
  },
  data() {
    return { internalPort: this.$props.port };
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
        this.internalPort = newValue;
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
