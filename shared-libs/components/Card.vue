<template>
  <div class="card" :class="{ padded: padded }" :id="id">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    id: String,
    padded: Boolean,
  },
};
</script>

<style lang="scss" scoped>
div.card {
  max-width: 100%;
  padding: calc(#{$spacing-x-small} * 2) calc(#{$spacing-x-small} * 2);
  &.padded {
    padding: calc(#{$spacing-medium} * 2) calc(#{$spacing-large} * 2);
  }
  @include box-shadow-light;
  border-radius: $spacing-x-small;
}
</style>
