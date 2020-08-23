module.exports = {
  // An array of folders (excluding subfolders) where your tests are located;
  // if this is not specified, the test source must be passed as the second argument to the test runner.
  src_folders: ["tests/e2e"],
  exclude: ["tests/e2e/helpers"],

  test_settings: {
    default: {
      webdriver: {
        start_process: true,
        port: 4444,
        server_path: require("geckodriver").path,
        cli_args: [
          // very verbose geckodriver logs
          // '-vv'
        ],
      },
      launch_url: "http://localhost:8080",
      desiredCapabilities: {
        browserName: "firefox",
        alwaysMatch: {
          // Enable this if you encounter unexpected SSL certificate errors in Firefox
          // acceptInsecureCerts: true,
          "moz:firefoxOptions": {
            args: ["-verbose"],
          },
        },
      },
    },
    integration: {
      launch_url: "http://test-server:8080",
      webdriver: {
        start_process: false,
      },
      selenium: {
        host: "firefox",
        port: "4444",
      },
      desiredCapabilities: {
        browserName: "firefox",
        alwaysMatch: {
          // Enable this if you encounter unexpected SSL certificate errors in Firefox
          // acceptInsecureCerts: true,
          "moz:firefoxOptions": {
            args: ["-headless"],
            "prefs": {
              "media.navigator.streams.fake": true,
              "media.navigator.permission.disabled": true
            },
          },
        },
      },
    },
  },
};
