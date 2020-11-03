# Testing

Philosophy: Test the user story and its functionality.

This means to test the actual website. Unit tests can not help much in most cases.
They should only be written for Functions that implement complex behaviour, such as the WASM code and some JavaScript functions.

Refer to the existing unit tests to see when a Unit test would be appropriate. In all other cases test your feature with an E2E test written with [nightwatch](https://nightwatchjs.org/).

## Caveats

### State

The app always stores all its state.
All tests inside one testcase will share this state.

Different test cases in different files will all use their own browser and start with a clean state.
Functions that need specific data to be present can use the `helpers/data-fillers`.

### Settings values are wrong

If values of an input are already set, but you would like to set a completely new one make sure to use `clearValue` first.
Otherwise the two values are added together.
