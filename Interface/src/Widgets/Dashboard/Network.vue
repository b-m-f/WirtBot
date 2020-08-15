<template>
  <div id="network-widget">
    <h1>{{ $t("dashboard.widgets.network.title") }}</h1>
    <div class="row">
      <label>{{ $t("dashboard.widgets.network.dnsName") }}</label>
      <input v-if="!network.dnsName || edit" type="text" name="dnsName" :value="network.dnsName" @change="(e) => updateDNSName(e.target.value)"/>
      <p v-else>{{ network.dnsName }}</p>
    </div>
    <button id="edit" @click="toggleEdit">
      <span v-if="edit">{{ $t("dashboard.stopEdit") }}</span>
      <span v-else>{{ $t("dashboard.edit") }}</span>
    </button>
   </div>
</template>

<script>

export default {
  data() {
    return {
      edit: false
    };
  },
  computed: {
    network() {
      return this.$store.state.network;
    }
  },
  props: {
    expertMode: Boolean
  },
  methods: {
    updateDNSName(name) {
      this.$store.dispatch("updateDNSName",  name);
    },
    toggleEdit() {
      if (!this.blocked) {
        this.edit = !this.edit;
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  margin-left: auto;
  display: flex;
  justify-content: space-between;
  padding: $spacing-small 0;
}
button#edit {
  display: block;
  margin-left: auto;
  border: none;
  color: $secondary;
  text-decoration: underline;
  border: none;
  cursor: pointer;
  padding: $spacing-medium;
  background: $white;
}
</style>
