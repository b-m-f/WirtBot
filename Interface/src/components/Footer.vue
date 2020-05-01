<template>
  <footer :class="{mobile: isMobilePage}">
    <div>
      <Button @click.prevent="contact" empty>{{ $t("footer.contact") }}</Button>
    </div>
    <div>
      <ul>
        <li>
          <a href="/about">{{ $t("footer.about") }}</a>
        </li>
        <li>
          <a href="/docs" target="_blank" rel="noopener noreferrer">{{ $t("footer.documentation") }}</a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script>
import Button from "./Button";
export default {
  components: { Button },
  computed: {
    isMobilePage() {
      return this.$store.state.websiteBeingViewedOnMobileDevice;
    }
  },
  methods: {
    contact() {
      window.location = "mailto:contact@wirt.network";
    }
  }
};
</script>

<style lang="scss" scoped>
footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: $spacing-large;
  padding: $spacing-large 0;
  & ul {
    margin-left: $spacing-medium;
    display: flex;
    flex-direction: column;
  }

  & li {
    color: $primary;

    & a {
      text-decoration: none;
      color: $primary;
      line-height: 1.6;
    }
  }

  & .button {
    max-width: 20rem;
  }

  &.mobile {
    flex-direction: column;
  }
}
</style>
