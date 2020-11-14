
<template>
  <input
    type="checkbox"
    :name="$props.name"
    :checked="$props.checked"
    @change="(e) => update(e.target.checked)"
  />
</template>

<script>
export default {
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
