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
        <h2>For free.</h2>
        <p>
          WirtBot was built completely in the open and will always be free. A
          thank you to the Open Source community.
        </p>
        <a href="/documentation/setup">
          <Button> Get started </Button>
        </a>
      </div>
      <img src="devices.svg" alt="Picture of connected devices" srcset />
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
}
</style>
