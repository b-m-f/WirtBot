const tests = require("./dns.spec")

module.exports = {
    "Resize window": async function (browser) {
        await browser.resizeWindow(480, 800)
    },
    ...tests
}