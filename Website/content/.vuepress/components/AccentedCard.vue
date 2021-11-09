<template>
  <Card id="card" :class="{ blue: type === 'info', padded: padded }">
    <slot></slot
  ></Card>
</template>

<script>
import Card from "./Card";
export default {
  components: { Card },
  props: { type: { type: String, required: true }, padded: Boolean },
};
</script>

<style lang="scss" scoped>
#card {
  &.blue {
    border-left: $border-large solid $primary;
  }
  &.padded {
    padding: $spacing-large;
  }
}
</style>
