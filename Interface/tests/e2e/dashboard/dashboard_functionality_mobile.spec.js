const functionality_tests = require("./dashboard_functionality.spec")

module.exports = {
    "Resize window": async function (browser) {
        await browser.resizeWindow(480, 800)
    },
    ...functionality_tests
}