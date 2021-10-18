<template>
  <TextInput
    name="ip-input"
    :placeholder="'000.000.000.000'"
    @change="(e) => updateIp(e)"
    :value="this.ip"
    :validate="validateIP"
    ref="input"
    :invalidMessage="this.$t('errors.wrongIPv4')"
  />
</template>

<script>
import TextInput from "components/Inputs/Text";
import { validateIPv4 } from "../../lib/helpers";

export default {
  components: { TextInput },
  props: {
    ip: String,
  },
  data() {
    return {
      valid: true,
    };
  },
  methods: {
    validateIP(ip) {
      return validateIPv4(ip);
    },
    updateIp(ip) {
      const valid = this.validateIP(ip);
      this.$emit("change", { ip, valid: valid });
    },
  },
};
</script>

<style lang="scss" scoped>
#ip-input {
  max-width: 100%;

  & input {
    width: 3rem;
  }
}
</style>
