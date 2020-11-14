
<template>
  <select
    :name="$props.name"
    ref="select"
    :required="$props.required"
    @change="update"
    :value="$props.selected"
  >
    <option
      :value="option"
      v-for="(option, index) in $props.options"
      :key="index"
    >
      {{ option }}
    </option>
  </select>
</template>

<script>
export default {
  props: {
    name: String,
    options: Array,
    required: Boolean,
    selected: [String, Number, Object],
  },
  methods: {
    update(event) {
      console.log(event.target.value);
      this.$emit("change", event.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
