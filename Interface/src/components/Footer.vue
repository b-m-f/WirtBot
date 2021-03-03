<template>
  <footer>
    <div class="button-and-links">
      <div>
        <Button @click.prevent="contact" empty>{{
          $t("footer.contact")
        }}</Button>
      </div>
      <div>
        <ul>
          <li>
            <a href="/about">{{ $t("footer.about") }}</a>
          </li>
          <li>
            <a href="/docs" target="_blank" rel="noopener noreferrer">{{
              $t("footer.documentation")
            }}</a>
          </li>
        </ul>
      </div>
    </div>
    <p id="donation" v-html="donationMessage"></p>
  </footer>
</template>

<script>
import Button from "shared-components/Button";
import { getTranslationWithVariables } from "../lib/helpers";
export default {
  components: { Button },
  computed: {
    donationMessage() {
      return getTranslationWithVariables(
        "footer.donation",
        "address",
        "<pre>0x39DF85776c626117B945afECF08C4DD262817522</pre>"
      );
    },
  },
  methods: {
    contact() {
      window.location = "mailto:contact@wirt.network";
    },
  },
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
