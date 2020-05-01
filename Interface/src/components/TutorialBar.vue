<template>
  <div>
    <ul>
      <li v-for="(step, index) in internalSteps" :key="index">
        <div id="controls">
          <div :class="{ line: true, first: index == 0 }"></div>
          <div
            :class="{ active: activeIndex > index, first: index == 0 }"
            id="circle"
          ></div>
          <div
            :class="{ line: true, last: index == internalSteps.length - 1 }"
          ></div>
        </div>
        <div
          v-if="showSections && step && (step.first || step.last)"
          :class="{ bar: true, hidden: !step }"
        ></div>
        <div
          class="name-section"
          :class="{ single: step.name && step.first, name: step.name }"
          v-if="showSections"
        >
          <p v-if="showSections && step && step.name">
            {{ step.name }}
          </p>
          <div
            v-else
            :class="{
              line: true,
              dotted: true,
              first: step.first,
              last: step.last,
            }"
          ></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    steps: Object,
    activeIndex: Number,
    showSections: Boolean,
  },
  computed: {
    internalSteps() {
      const expandedSteps = Object.keys(this.$props.steps).reduce(
        (prev, next) => {
          const stepArray = new Array(this.$props.steps[next]).fill();
          const middleElement = Math.floor((stepArray.length - 1) / 2); // finds the middle element in 0 indexed
          stepArray[0] = { first: true };
          if (stepArray.length > 1) {
            stepArray[stepArray.length - 1] = { last: true };
          }
          stepArray[middleElement] = Object.assign(
            {},
            stepArray[middleElement],
            {
              name: next,
            }
          );
          return [...prev, ...stepArray];
        },
        []
      );
      return expandedSteps;
    },
  },
};
</script>

<style lang="scss" scoped>
ul {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
li {
  display: flex;
  flex-direction: column;
  flex: 1;
  #controls {
    display: flex;
    flex-direction: row;
    & .line {
      border-bottom: solid $grey-light $border-small;
      flex: 1;
      margin-bottom: calc(26px / 2);
      &.first {
        border-bottom: none;
      }
      &.last {
        border-bottom: none;
      }
    }

    #circle {
      height: 26px;
      width: 26px;
      border-radius: 50%;
      margin-right: $spacing-small;

      margin-left: $spacing-small;
      &.first {
        margin-left: 0;
      }
      background-color: rgba($primary, 0.5);
      &.active {
        background-color: $primary;
      }
    }
  }
  .bar {
    height: $spacing-large;
    border-left: dotted $grey-light $border-medium;
    margin-left: auto;
    margin-right: auto;

    &.hidden {
      display: none;
    }
  }

  .name-section {
    &.name {
      margin-top: $spacing-medium;
    }

    .line {
      border-bottom: dotted $grey-light $border-medium;
      flex: 1;
      &.first {
        width: 55%;
        margin-left: auto;
      }
      &.last {
        width: 55%;
        margin-right: auto;
      }
    }
    & p {
      text-align: center;
    }
    &.single {
      margin-top: 0;
    }
  }
}
</style>
