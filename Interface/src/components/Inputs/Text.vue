<template>
  <input
    v-if="!$props.multiline"
    ref="input"
    :value="internalText || $props.value"
    type="text"
    :name="$props.name"
    :placeholder="$props.placeholder"
    :required="$props.required"
    @input="(e) => update(e.target.value)"
  />
  <textarea
    v-else
    :name="$props.name"
    ref="input"
    :value="internalText || $props.value"
    :placeholder="$props.placeholder"
    :required="$props.required"
    @input="(e) => update(e.target.value)"
  ></textarea>
</template>

<script>
export default {
  props: {
    placeholder: String,
    value: String,
    validate: Function,
    invalidMessage: String,
    required: Boolean,
    name: String,
    multiline: Boolean,
  },
  data() {
    return {
      internalText: "",
    };
  },
  watch: {
    invalidMessage() {
      // The external validation method might update the invalid message,
      // in which case the update method needs to be called again to apply it to the input field
      this.update(this.internalText);
    },
  },
  methods: {
    update(text) {
      this.$refs["input"].setCustomValidity("");
      this.internalText = text;
      try {
        if (!text) {
          if (this.$props.required) {
            throw this.$t("errors.required");
          } else {
            this.$emit("change", text);
            return;
          }
        }
        if (this.$props.validate) {
          const valid = this.$props.validate(text);
          if (!valid) {
            throw this.$props.invalidMessage;
          } else {
            this.$emit("change", text);
            return;
          }
        }
        this.$emit("change", text);
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
textarea {
  width: 13rem;
  height: 5rem;
}
</style>
