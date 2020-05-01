<template>
  <ul>
    <li
      v-for="(alert, index) in alerts"
      :key="index"
      :class="{
        success: alert.type === 'success',
        warning: alert.type === 'warning',
        info: alert.type === 'info'
      }"
    >{{ alert.message }}</li>
  </ul>
</template>

<script>
export default {
  computed: {
    alerts() {
      return this.$store.state.alerts.alerts;
    }
  }
};
</script>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;

  li {
    list-style-type: none;
    margin: 0;
    padding: $spacing-small;
    margin-bottom: $spacing-small;
    font-size: $font-medium;
    color: $white;
    border-radius: 4px;

    &.info {
      color: $black;
      background-color: $info;
    }
    &.success {
      background-color: $success;
    }
    &.warning {
      background-color: $warning;
    }
  }
}
</style>
