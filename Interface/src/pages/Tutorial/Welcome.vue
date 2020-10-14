<template>
  <div>
    <h1>{{ $t("tutorial.welcome.title") }}</h1>
    <p v-html="explainer"></p>
    <slot></slot>
    <router-link :to="{ name: 'tutorial-server-questionaire' }">
      <Button id="start" tabindex="1" empty>{{
        $t("tutorial.welcome.start")
      }}</Button>
    </router-link>
  </div>
</template>

<script>
import { getTranslationWithVariables } from "../../lib/helpers";
import Button from "shared-components/Button";
export default {
  components: { Button },
  computed: {
    explainer() {
      return getTranslationWithVariables(
        "tutorial.welcome.explainer",
        "dashboard",
        "<a href='/dashboard'>Dashboard</a>"
      );
    },
  },
};
</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
}
p {
  margin-bottom: $spacing-large;
}

#start {
  width: 30rem;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: $spacing-large;

  &.button {
    max-width: 20rem;
  }
}
</style>
