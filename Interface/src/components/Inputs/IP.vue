<template>
  <TextInput
    name="ip-input"
    :placeholder="'000.000.000.000'"
    @change="(e) => updateIp(e)"
    :value="this.ip"
    :validate="validateIP"
    ref="input"
    :invalidMessage="this.$t('warnings.wrongIPv4')"
  />
</template>

<script>
import TextInput from "components/Inputs/Text";

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
      let newValue;
      let valid = true;
      try {
        newValue = ip.split(".").map((val, index) => {
          const number = parseInt(val);
          if (!number) {
            valid = false;
            return 0;
          }
          if (number > 255) {
            valid = false;
            return number;
          }
          if ((index == 3 || index == 0) && number < 1) {
            valid = false;
            return number;
          }
          if (newValue < 0) {
            valid = false;
            return number;
          }
          return number;
        });

        if (newValue.length < 4) {
          valid = false;
        }
        return valid;
      } catch (error) {
        return false;
      }
    },
    updateIp(ip) {
      const valid = this.validateIP(ip);
      this.$emit("change", { ip, valid: valid });
    },
  },
};
</script>

<style lang="scss" scoped>
#ip-inputs {
  max-width: 100%;

  & input {
    width: 3rem;
  }
}
</style>
