const tests = require("./dashboard_simple_network.spec")

module.exports = {
    "Resize window": async function (browser) {
        await browser.resizeWindow(480, 800)
    },
    ...tests
}