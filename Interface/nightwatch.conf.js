module.exports = {
  // An array of folders (excluding subfolders) where your tests are located;
  // if this is not specified, the test source must be passed as the second argument to the test runner.
  src_folders: ["tests"],
  exclude: ["tests/helpers"],

  webdriver: {
    start_process: true,
    port: 4444,
    server_path: require("geckodriver").path,
    cli_args: [
      // very verbose geckodriver logs
      // '-vv'
    ]
  },

  test_settings: {
    default: {
      launch_url: "http://localhost:8080",
      desiredCapabilities: {
        browserName: "firefox",
        alwaysMatch: {
          // Enable this if you encounter unexpected SSL certificate errors in Firefox
          // acceptInsecureCerts: true,
          "moz:firefoxOptions": {
            args: ["-verbose"]
          }
        }
      }
    },
    integration: {
      launch_url: "http://localhost:8080",

      desiredCapabilities: {
        alwaysMatch: {
          // Enable this if you encounter unexpected SSL certificate errors in Firefox
          // acceptInsecureCerts: true,
          "moz:firefoxOptions": {
            args: ["-headless"]
          }
        }
      }
    }
  }
};
