<template>
  <footer>
    <div class="button-and-links">
      <div>
        <ul>
          <li>
            <a
              href="https://wirtbot.com/about"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ $t("footer.about") }}</a
            >
          </li>
          <li>
            <a
              href="https://wirtbot.com/documentation"
              target="_blank"
              rel="noopener noreferrer"
              >{{ $t("footer.documentation") }}</a
            >
          </li>
        </ul>
      </div>
    </div>
    <p id="donation" :v-html="$t('footer.donation')"></p>
  </footer>
</template>

<script>
export default {
  components: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
footer {
  display: flex;
  flex-direction: column;
  margin-top: $spacing-large;
  padding: $spacing-large 0;

  & .button-and-links {
    display: flex;
    justify-content: center;
    align-items: center;
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
  }

  & p#donation {
    color: $primary;
    text-align: center;
  }
}
</style>
