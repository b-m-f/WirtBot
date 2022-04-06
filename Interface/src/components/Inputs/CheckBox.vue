
<template>
  <input
    type="checkbox"
    :name="$props.name"
    :checked="$props.checked"
    @input="(e) => update(e.target.checked)"
  />
</template>

<script>
export default {
  emits: ["change"],
  props: {
    checked: Boolean,
    name: String,
  },
  methods: {
    update(bool) {
      this.$emit("change", bool);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
