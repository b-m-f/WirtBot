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
  emits: ["validated"],
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
      if (process.env.VUE_NO_DEBOUNCE) {
        return (...args) => func.apply(this, args);
      }
      return (...args) => {
        console.log(this._timer);
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
          func.apply(this, args);
        }, timeout);
      };
    },
    update(text) {
      this.$refs["input"].setCustomValidity("");
      this.internalText = text;
      const debouncedEmit = this.debounce(() => this.$emit("validated", text));
      try {
        if (!text) {
          if (this.$props.required) {
            throw this.$t("errors.required");
          } else {
            debouncedEmit();
            return;
          }
        }
        if (this.$props.validate) {
          const valid = this.$props.validate(text);
          if (!valid) {
            throw this.$props.invalidMessage;
          } else {
            debouncedEmit();
            return;
          }
        }
        debouncedEmit();
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
