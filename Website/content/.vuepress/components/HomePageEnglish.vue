<template>
  <div class="homepage-component">
    <div id="one">
      <div class="text">
        <h1>Create a private network for all your devices.</h1>
        <p>
          Connecting all your devices has never been easier, thanks to
          WireGuard®. WirtBot simplifies the process of creating your own
          private network into 3 steps. No registration, no accounts - Just a
          network that belongs to you.
        </p>
        <a href="/documentation/setup">
          <Button> Get started </Button>
        </a>
      </div>
      <img src="devices.svg" alt="Picture of connected devices" srcset />
    </div>
    <div id="two">
      <div>
        <img src="wirt-bot.svg" alt="Picture of the WirtBot" srcset />
      </div>
      <div class="text">
        <h2>Hi, I'm WirtBot®.</h2>
        <p>
          I have one job and I do it well. I forward traffic at the highest
          speed, without compromising security.
        </p>
      </div>
    </div>
    <div id="three">
      <h1>
        Enjoy all the benefits of a professional set-up, without the hassle.
      </h1>
      <div class="grid">
        <div>
          <img src="browser.svg" alt="Image of a browser" />
          <h2>Browser based</h2>
          <p>
            WirtBot is configured right in your browser. No data leaves your
            computer, unless it is meant to configure your WirtBot. You can
            easily verify this with your browsers Developer tools.
          </p>
        </div>
        <div>
          <img src="lightning.svg" alt="Image of a browser" />
          <h2>Lightning fast</h2>
          <p>
            Security does not have to mean slow. Using WireGuard makes your
            WirtBot perform at very high speed.
          </p>
        </div>
        <div>
          <img src="glass.svg" alt="Image of a browser" />
          <h2>Secure</h2>
          <p>
            Modern cryptography is used in the WirtBot to ensure that your
            network is secure. In addition you get stealth that would make Sam
            Fisher jealous.
          </p>
        </div>
      </div>
    </div>
    <div id="four">
      <h1>
        Simple process, broken down in a few simple steps so you dont have to.
      </h1>
      <ul>
        <li>
          <h2>1. Build a WirtBot</h2>
          <div>
            <p></p>
          </div>
        </li>
        <li>
          <h2>2. Configure your WirtBot using the WirtUI</h2>
          <div>
            <p></p>
          </div>
        </li>
        <li>
          <h2>3. Configure and grow your network</h2>
          <div>
            <p></p>
          </div>
        </li>
      </ul>
    </div>
    <div id="docs">
      <h1>WirtBot works for you</h1>
      <div class="cards">
        <Card padded>
          <h2>At home</h2>
          <p>
            Build a Cloud or Video streaming service that you own or whatever
            else you would like to bring online. From your home into your cloud.
          </p>
          <a href="/documentation/what-can-i-do-with-wirt"> Learn more </a>
        </Card>
        <Card padded>
          <h2>For companies</h2>
          <p>
            Secure monitoring, self-hosted Groupware or a development
            environment that can be accessed from anywhere in the world. WirtBot
            got you covered and keeps secure communication concerns out of your
            architecture. Just don't expect wonders if you are an enterprise.
            This project is meant for people, families and small company scale.
          </p>
          <a href="/documentation/what-can-i-do-with-wirt"> Learn more </a>
        </Card>
      </div>
    </div>
    <div id="ready">
      <h2>Ready to get started?</h2>
      <p>Build your own WirtBot today, for free! No registration required</p>
      <a href="/documentation/setup">
        <Button> Get started now </Button>
      </a>
    </div>
  </div>
</template>

<script>
import Button from "shared-components/Button";
import Card from "shared-components/Card";

export default {
  components: { Button, Card },
};
</script>

<style lang="scss" scoped>
.homepage-component {
  width: 100%;
  display: flex;
  flex-direction: column;

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

  @media screen and (max-width: 1000px) {
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

  @media screen and (max-width: 1000px) {
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

  @media screen and (max-width: 1000px) {
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

  @media screen and (max-width: 1000px) {
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

  @media screen and (max-width: 1000px) {
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
