<template>
  <TextInput
    name="ip-hostname-input"
    :placeholder="'IP or Hostname'"
    @change="(e) => update(e)"
    :value="this.value"
    :validate="validateIPandHostname"
    ref="input"
    :invalidMessage="this.$t('errors.wrongIPv4OrHostname')"
  />
</template>

<script>
import TextInput from "components/Inputs/Text";
import { validateIPv4 } from "../../lib/helpers";

export default {
  components: { TextInput },
  props: {
    value: String,
  },
  data() {
    return {
      valid: true,
    };
  },
  methods: {
    validateIPandHostname(value) {
      return this.validateIP(value) || this.validateHostname(value);
    },
    validateIP(value) {
      return validateIPv4(value);
    },
    validateHostname(value) {
      const hostnameRegex = new RegExp("^[a-z0-9]+[.]{1}[a-z]+$");
      return hostnameRegex.test(value);
    },
    update(value) {
      const valid = this.validateIPandHostname(value);
      // The IP will always match a hostname regex as well. Because of this the stricter IP check is done first,
      // and the in case it matches an IP is returned
      if (this.validateIP(value)) {
        this.$emit("change", { ip: value, valid: valid });
      } else if (this.validateHostname(value)) {
        this.$emit("change", { hostname: value, valid: valid });
      } else {
        this.$emit("change", { valid });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#ip-hostname-input {
  max-width: 100%;

  & input {
    width: 3rem;
  }
}
</style>
