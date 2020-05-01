<template>
  <div id="done">
    <h1>{{ $t("tutorial.done.congrats") }}</h1>
    <p>{{ $t("tutorial.done.info") }}</p>

    <router-link :to="{ name: 'dashboard' }">
      <Button empty id="go-to-dashboard">{{
        $t("tutorial.done.goToDashBoard")
      }}</Button>
    </router-link>
  </div>
</template>

<script>
import Button from "../../components/Button";

export default {
  components: { Button },
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>

<style scoped lang="scss">
#done {
  display: flex;
  flex-direction: column;
  align-items: center;

  & #go-to-dashboard {
    margin-top: $spacing-large;
  }
}
</style>
