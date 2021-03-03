<template>
  <header id="app-header">
    <div
      :class="{ container: true }"
    >
      <nav>
        <div id="left">
          <div id="logo">
            <router-link to="/">
              <img src="logo.svg" alt="WirtBot logo" />
            </router-link>
          </div>
          <div id="documentation">
            <a
              href="https://wirtbot.com/documentation"
              target="_blank"
              rel="noopener noreferrer"
              >{{ $t("header.documentation") }}</a
            >
          </div>
          <div id="github">
            <a
              href="https://github.com/b-m-f/WirtBot"
              target="_blank"
              rel="noopener noreferrer"
              >GitHub</a
            >
          </div>
        </div>
        <div id="right"></div>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  components: {},
};
</script>

<style scoped lang="scss">
#app-header {
  display: flex;
  min-height: 4rem;
  margin-top: $spacing-medium;
  width: 100%;
}
#logo {
  display: flex;
  align-items: center;
  height: 100%;
  margin-right: $spacing-x-large;

  & img {
    height: 4rem;
    width: 10rem;
    &:hover {
      background: $secondary;
    }
    &:focus {
      background: $secondary;
    }
  }
}

.container {
  width: calc(100% - #{$spacing-medium});

  display: flex;
  & a {
    color: $black;
    text-decoration: none;
  }
}

.desktop {
  &.container {
    & nav {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-transform: uppercase;
      flex-wrap: 1;

      & a {
        font-size: $heading-medium;
        &:hover {
          color: $secondary;
        }
        &:focus {
          color: $secondary;
        }
        &.router-link-active {
          color: $secondary;
        }
      }

      & .button {
        max-width: 14rem;
        height: 2rem;
      }
      & #left {
        display: flex;
        justify-content: space-around;
        align-items: center;
        & div {
          margin-right: $spacing-medium;

          &:last-child {
            margin-right: 0;
          }
        }
      }

      & #right {
        display: flex;
        align-items: center;

        & .button {
          margin-left: $spacing-medium;
        }
      }
    }
  }
}
</style>
