const device_tests = require("./dashboard_device_widget.spec")
const functionlity_tests = require("./dashboard_functionality.spec")

module.exports = {
    "Resize window": async function (browser) {
        await browser.resizeWindow(480, 800)
    },
    ...device_tests,
    ...functionlity_tests
}