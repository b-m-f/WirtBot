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
    placeholder: String,
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
        if (!number) {
          if (this.$props.required) {
            throw this.$t("warnings.required");
          } else {
            this.$emit("change", number);
            return;
          }
        }
        try {
          newValue = parseInt(number);
          this.internalNumber = newValue;
        } catch (error) {
          throw this.$t("warnings.notANumber");
        }
        if (this.$props.validate) {
          const valid = this.$props.validate(newValue);
          if (!valid) {
            throw this.$props.invalidMessage;
          } else {
            this.$emit("change", newValue);
            return;
          }
        }
      } catch (error) {
        this.$refs["input"].setCustomValidity(error);
        this.$refs["input"].reportValidity();
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
