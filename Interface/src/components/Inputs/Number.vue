<template>
  <input
    ref="input"
    :value="internalNumber"
    type="number"
    :name="$props.name"
    :min="$props.min"
    :max="$props.max"
    :placeholder="$props.placeholder"
    :required="$props.required"
    @change="(e) => update(e.target.value)"
  />
</template>

<script>
export default {
  props: {
    placeholder: { type: String, default: "1024-65636" },
    min: Number,
    max: Number,
    value: Number,
    validate: Function,
    invalidMessage: String,
    required: Boolean,
  },
  data() {
    return { internalNumber: this.$props.value };
  },
  watch: {
    invalidMessage() {
      // The external validation method might update the invalid message,
      // in which case the update method needs to be called again to apply it to the input field
      this.update(this.internalNumber);
    },
  },
  methods: {
    update(number) {
      let newValue;
      this.$refs["input"].setCustomValidity("");
      try {
        newValue = parseInt(number);
        this.internalNumber = newValue;
        const valid = this.$props.validate(newValue);
        if (!valid) {
          this.$refs["input"].setCustomValidity(this.$props.invalidMessage);
          this.$refs["input"].reportValidity();
        } else {
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
