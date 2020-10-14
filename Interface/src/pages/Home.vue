<template>
  <div :class="{ home: true, mobile: isMobilePage }">
    <div id="one">
      <div class="text">
        <h1>{{ $t("home.one.title") }}</h1>
        <p>{{ $t("home.one.subheader") }}</p>
        <router-link :to="{ name: 'tutorial-welcome' }">
          <Button>{{ $t("home.one.getStarted") }}</Button>
        </router-link>
      </div>
      <img src="devices.svg" alt="Picture of connected devices" srcset />
    </div>
    <div id="two">
      <div>
        <img src="wirt-bot.svg" alt="Picture of the wirt robot" srcset />
      </div>
      <div class="text">
        <h2>{{ $t("home.two.hi") }}</h2>
        <p>{{ $t("home.two.job") }}</p>
      </div>
    </div>
    <div id="three">
      <h1>{{ $t("home.three.title") }}</h1>
      <div class="grid">
        <div>
          <img src="browser.svg" alt="Image of a browser" />
          <h2>{{ $t("home.three.browser.title") }}</h2>
          <p>{{ $t("home.three.browser.text") }}</p>
        </div>
        <div>
          <img src="lightning.svg" alt="Image of a browser" />
          <h2>{{ $t("home.three.fast.title") }}</h2>
          <p>{{ $t("home.three.fast.text") }}</p>
        </div>
        <div>
          <img src="glass.svg" alt="Image of a browser" />
          <h2>{{ $t("home.three.secure.title") }}</h2>
          <p>{{ $t("home.three.secure.text") }}</p>
        </div>
      </div>
    </div>
    <div id="four">
      <h1>{{ $t("home.four.title") }}</h1>
      <ul>
        <li>
          <h2>1. {{ $t("home.four.one.title") }}</h2>
          <div>
            <p>{{ $t("home.four.one.text") }}</p>
          </div>
        </li>
        <li>
          <h2>2. {{ $t("home.four.two.title") }}</h2>
          <div>
            <p>{{ $t("home.four.two.text") }}</p>
          </div>
        </li>
        <li>
          <h2>3. {{ $t("home.four.three.title") }}</h2>
          <div>
            <p>{{ $t("home.four.three.text") }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div id="docs">
      <h1>{{ $t("home.docs.title") }}</h1>
      <div class="cards">
        <Card padded>
          <h2>{{ $t("home.docs.atHome.title") }}</h2>
          <p>{{ $t("home.docs.atHome.text") }}</p>
          <a
            href="/docs/what-can-i-do-with-wirt"
            target="_blank"
            rel="noopener noreferrer"
            >{{ $t("home.docs.atHome.link") }}</a
          >
        </Card>
        <Card padded>
          <h2>{{ $t("home.docs.atCompanies.title") }}</h2>
          <p>{{ $t("home.docs.atCompanies.text") }}</p>
          <a
            href="/docs/what-can-i-do-with-wirt"
            target="_blank"
            rel="noopener noreferrer"
            >{{ $t("home.docs.atCompanies.link") }}</a
          >
        </Card>
      </div>
    </div>
    <div id="ready">
      <h2>{{ $t("home.ready.title") }}</h2>
      <p>{{ $t("home.ready.sub") }}</p>
      <router-link :to="{ name: 'tutorial-welcome' }">
        <Button>{{ $t("home.ready.link") }}</Button>
      </router-link>
    </div>
  </div>
</template>

<script>
import Button from "shared-components/Button";
import Card from "shared-components/Card";

export default {
  components: { Button, Card },
  computed: {
    isMobilePage() {
      return this.$store.state.websiteBeingViewedOnMobileDevice;
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > div {
    width: 100%;
  }

  & #one {
    display: flex;
    justify-content: space-between;
    padding-bottom: $spacing-large;

    & .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      max-width: 35rem;
    }

    & img {
      width: 28rem;
      height: 28rem;
    }

    & .button {
      max-width: 20rem;
      margin-top: $spacing-large;
    }
  }

  &.mobile {
    & #one {
      justify-content: center;
      margin-left: auto;
      margin-right: auto;
      flex-wrap: wrap;
      margin-top: $spacing-large;
      & .text {
        & h1 {
          text-align: center;
        }
        & .button {
          margin-left: auto;
          margin-right: auto;
        }

        & p {
          text-align: center;
        }
        width: 25rem;
        margin-bottom: $spacing-medium;
      }
      & img {
        overflow: hidden;
      }
    }
  }
  & #two {
    display: flex;
    justify-content: center;
    background: $background;
    padding-bottom: $spacing-large;
    padding-top: $spacing-large;

    & img {
      width: 30rem;
      height: 30rem;
    }

    & .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
  &.mobile {
    & #two {
      & img {
        width: 15rem;
        height: 15rem;
        max-width: 50vw;
      }
    }
  }

  & #three {
    & h1 {
      margin-left: auto;
      margin-right: auto;
      max-width: 30rem;
    }
    padding-bottom: $spacing-x-large;
    padding-top: $spacing-x-large;

    & .grid {
      display: grid;
      grid-template-areas: "one two three";
      grid-template-rows: "1fr 1fr 1fr";
      grid-gap: $spacing-large;
      & > div {
        display: flex;
        flex-direction: column;
        align-items: center;

        &:nth-child(1) {
          grid-area: one;
        }
        &:nth-child(2) {
          grid-area: two;
        }
        &:nth-child(3) {
          grid-area: three;
        }
      }

      & img {
        max-width: 7rem;
      }
    }
  }

  &.mobile {
    & #three {
      & h1 {
        text-align: center;
      }
      & .grid {
        margin-right: $spacing-medium;
        margin-left: $spacing-medium;
        grid-template-areas: "one two" "three three";
        grid-template-rows: "1fr 1fr";
      }
    }
  }

  & #four {
    background: $grey-dark;
    padding-bottom: $spacing-large;
    padding-top: $spacing-large;

    & h1 {
      text-align: center;
    }

    & ul {
      display: flex;
      flex-direction: column;

      & li {
        display: flex;
        // border-top: $border-medium solid $black;
        height: $spacing-x-large;
        padding-left: $spacing-x-large;
        padding-top: $spacing-medium;

        &:last-child {
          // border-bottom: $border-medium solid $black;
        }
        & h2 {
          margin: 0;
        }

        & button {
          margin-left: auto;
        }
      }
    }
  }

  &.mobile {
    & #four {
      & ul {
        & li {
          padding-left: $spacing-medium;
        }
      }
    }
  }

  & #docs {
    display: flex;
    flex-direction: column;
    padding-bottom: $spacing-large;
    padding-top: $spacing-large;

    & h1 {
      text-align: center;
    }

    & .cards {
      display: flex;
      & > div {
        max-width: 14rem;
        margin-right: $spacing-large;
        &:last-child() {
          margin-right: 0;
        }
      }
    }
  }

  &.mobile {
    & #docs {
      & .cards {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        & > div {
          margin-right: 0;
          margin-bottom: $spacing-large;
          &:last-child() {
            margin-bottom: 0;
          }
        }
      }
    }
  }

  & #ready {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: $spacing-large;
    padding-top: $spacing-large;
    background: $primary;
    color: $white;
  }

  &.mobile {
    & #ready {
      & p {
        text-align: center;
      }
      & .button {
        max-width: 20rem;
      }
    }
  }
}
</style>
