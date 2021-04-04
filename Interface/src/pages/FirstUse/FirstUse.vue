<template>
  <div id="page">
    <h1>{{ $t("firstUse.welcome") }}</h1>
    <h3>{{ $t("firstUse.pleaseAddConfig") }}</h3>
    <textarea
      id="input"
      :value="config"
      @change="(e) => updateConfig(e.target.value)"
    >
    </textarea>
    <button type="button" class="submit" @click="connectWirtBot">
      {{ $t("firstUse.connect") }}
    </button>
    <button type="button" class="skip" @click="skip">
      {{ $t("firstUse.useBackup") }}
    </button>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      config: "",
    };
  },
  computed: {},
  methods: {
    updateConfig(text) {
      this.config = text;
    },
    connectWirtBot() {
      try {
        const keys = JSON.parse(atob(this.config)).keys;
        this.$store.dispatch("setKeys", keys);
        this.$store.dispatch("disableFirstUse");
      } catch (error) {
        this.$store.dispatch(
          "alerts/addError",
          `${this.$t("errors.failedToParseInitialData")}`
        );
      }
    },
    skip() {
      this.$store.dispatch("disableFirstUse");
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
#page {
  display: flex;
  align-items: center;
  flex-direction: column;
}
#input {
  margin-top: $spacing-medium;
  width: 30vw;
  height: 10rem;
}

button {
  margin-top: $spacing-medium;
}
</style>
