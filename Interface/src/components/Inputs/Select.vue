<template>
  <select
    :name="$props.name"
    ref="select"
    :required="$props.required"
    @change="update"
    :value="$props.selected || ''"
  >
    <option :value="''">
      {{ $t("dashboard.widgets.devices.placeholder.selectType") }}
    </option>
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
  emits: ['change'],
  props: {
    name: String,
    options: Array,
    required: Boolean,
    selected: [String, Number, Object],
  },
  methods: {
    update(event) {
      this.$emit("change", event.target.value);
    },
  },
};
</script>

<style lang="scss" scoped></style>
