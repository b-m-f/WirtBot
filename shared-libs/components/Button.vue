<template>
  <div class="button" :id="id">
    <button
      @click="$emit('click', $event)"
      :class="{ empty: empty, upper: uppercase }"
    >
      <slot></slot>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    empty: Boolean,
    id: String,
    uppercase: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.button {
  min-width: 6rem;
  min-height: 3rem;
  padding: calc(#{$spacing-x-small} + #{$border-small});
  width: 30rem;

  button {
    width: 100%;
    cursor: pointer;
    min-width: calc(6rem- #{$spacing-x-small} * 2);
    min-height: 3rem;
    background: linear-gradient(90deg, #f67a74 0%, $secondary 100%);
    color: $white;
    border: none;
    font-size: $heading-medium;

    &.empty {
      background: $white;
      color: $secondary;
      border: solid $secondary $border-small;
    }
    &:hover {
      border: solid $secondary $border-small;
    }

    &.upper {
      text-transform: uppercase;
    }
  }

  &:hover {
    padding: $spacing-x-small;
    border: solid $secondary $border-small;
    border-radius: $spacing-x-small;
  }
}
</style>
