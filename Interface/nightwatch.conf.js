module.exports = {
  // An array of folders (excluding subfolders) where your tests are located;
  // if this is not specified, the test source must be passed as the second argument to the test runner.
  src_folders: ["tests/e2e"],
  exclude: ["tests/e2e/helpers"],

  test_settings: {
    default: {
      webdriver: {
        start_process: true,
        server_path: require("chromedriver").path,
        port: 9515,
        cli_args: [
        ],
      },
      launch_url: "http://localhost:8080",
      desiredCapabilities: {
        browserName: "chrome",
        chromeOptions: {
          w3c: false,
          args: [
            "window-size=1920,1080"
          ],
          prefs: {
            "Browser.setDownloadBehavior": {
              behavior: "allow",
              downloadPath: "/tmp/WirtTestDownloads/"
            },
            "download.default_directory": "/tmp/WirtTestDownloads/",
            "download.prompt_for_download": "false",
            "download.directory_upgrade": "true",
            "profile": {
            }
          }
        },
      },
    },
    integration: {
      launch_url: "http://test-server:8080",
      webdriver: {
        start_process: false,
        host: "chrome",
        port: 4444,
      },
      desiredCapabilities: {
        browserName: "chrome",
        chromeOptions: {
          w3c: false,
          args: [
            "--headless",
            "--no-sandbox",
            "window-size=1920,1080",
          ],
          prefs: {
            "Browser.setDownloadBehavior": {
              behavior: "allow",
              downloadPath: "/tmp/WirtTestDownloads/"
            },
            "download.default_directory": "/tmp/WirtTestDownloads/",
            "download.prompt_for_download": "false",
            "download.directory_upgrade": "true",
            "profile": {
            }
          }
        },
      },
    },
  }
};
