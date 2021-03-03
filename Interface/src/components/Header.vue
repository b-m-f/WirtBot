<template>
  <header id="app-header">
    <nav>
      <div id="left">
        <div id="logo">
          <router-link to="/">
            <img src="logo.svg" alt="WirtBot logo" />
          </router-link>
        </div>
      </div>
      <div id="right">
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
    </nav>
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
  justify-content: center;
}

nav {
  & a {
    color: $black;
    text-decoration: none;
  }
  width: calc(100% - #{$spacing-medium});
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

    & #logo {
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
    & div {
      margin-right: $spacing-medium;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  & #right {
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;

    @media screen and (max-width: $mobile-width) {
      flex-direction: column;
    }

    & .button {
      margin-left: $spacing-medium;
    }
  }
}
</style>
