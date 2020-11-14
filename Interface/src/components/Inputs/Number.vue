<template>
  <input
    ref="input"
    :value="internalNumber"
    type="number"
    :name="$props.name"
    :min="$props.min"
    :max="$props.max"
    :placeholder="$props.placeholder"
    @change="update"
  />
</template>

<script>
export default {
  props: {
    port: { type: Number, default: undefined },
    placeholder: { type: String, default: "1024-65636" },
    min: Number,
    max: Number,
    value: Number,
    validate: Function,
    invalidMessage: String,
  },
  data() {
    return { internalNumber: this.$props.value };
  },
  methods: {
    update(event) {
      let newValue;
      this.$refs["input"].setCustomValidity("");
      try {
        newValue = parseInt(event.target.value);
        const valid = this.$props.validate(newValue);
        if (!valid) {
          this.$refs["input"].setCustomValidity(this.$props.invalidMessage);
          this.$refs["input"].reportValidity();
        } else {
          this.internalNumber = newValue;
          this.$emit("change", newValue);
        }
      } catch (error) {
        return;
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
