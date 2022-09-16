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
  emits: ["change"],
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
    debounce(func, timeout = 800) {
      return (...args) => {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
          func.apply(this, args);
        }, timeout);
      };
    },
    update(text) {
      this.$refs["input"].setCustomValidity("");
      this.internalText = text;
      const emit = this.debounce(() => this.$emit("change", text));
      try {
        if (!text) {
          if (this.$props.required) {
            clearTimeout(this._timer);
            throw this.$t("errors.required");
          } else {
            emit();
            return;
          }
        }
        if (this.$props.validate) {
          const valid = this.$props.validate(text);
          if (!valid) {
            clearTimeout(this._timer);
            throw this.$props.invalidMessage;
          } else {
            emit();
            return;
          }
        }
        emit();
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
