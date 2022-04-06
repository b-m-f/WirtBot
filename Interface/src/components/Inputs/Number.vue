<template>
  <input
    ref="input"
    :value="internalNumber || this.$props.value"
    type="number"
    :name="$props.name"
    :min="$props.min"
    :max="$props.max"
    :placeholder="$props.placeholder"
    :required="$props.required"
    @input="(e) => update(e.target.value)"
  />
</template>

<script>
export default {
  emits: ['change'],
  props: {
    placeholder: String,
    min: Number,
    max: Number,
    value: Number,
    validate: Function,
    invalidMessage: String,
    required: Boolean,
    name: String,
  },
  data() {
    return {
      internalNumber: null,
    };
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
            throw this.$t("errors.required");
          } else {
            this.$emit("change", number);
            return;
          }
        }
        try {
          newValue = parseInt(number);
          this.internalNumber = newValue;
        } catch (error) {
          throw this.$t("errors.notANumber");
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
      this.$emit("change", newValue);
    },
  },
};
</script>

<style lang="scss" scoped>
input {
  max-width: 6rem;
}
</style>
