const { setServer } = require("../helpers/dataFillers");
const util = require('util');
const fs = require("fs").promises
const assert = require('assert')
const setTimeoutAsync = util.promisify(setTimeout);

module.exports = {
    "Set server": async function (
        browser
    ) {
        await browser.url(`http://${process.env.TEST_URL}/`);

        await setServer(browser);
    },
    "Add device": async function (browser) {
        await browser.click("#add-device button");

        await browser.setValue("input[name='device-name']", "test1");
        await browser.setValue("input[name='device-ipv4']", "2");
        await browser.setValue("select.device-type", "Android");
        await browser.click("button.save");
    },
    "Update DNS": async function (browser) {
        await browser.assert.value("#dns-widget input[name='1']", "1")
        await browser.assert.value("#dns-widget input[name='2']", "1")
        await browser.assert.value("#dns-widget input[name='3']", "1")
        await browser.assert.value("#dns-widget input[name='4']", "1")
        await browser.clearValue("#dns-widget input[name='4']");
        await browser.setValue("#dns-widget input[name='4']", "2");
        await browser.execute(function () {
            var element = document.querySelector("#dns-widget input[name='4']");
            var event = new Event("change");
            element.dispatchEvent(event);
        });
        await browser.assert.value("#dns-widget input[name='4']", "2")
    },
    "Test that DNS gets updated correctly": async function (browser) {
        await setTimeoutAsync(5001, 'waitForDNSUpdate').then(async () => {
            try {
                const data = await fs.readFile('/dns/Corefile', "utf8")
                const wg = await fs.readFile('/etc/wireguard/server.conf', "utf8")
                assert.match(data, /.*forward . tls:\/\/1\.1\.1\.2.*/)
            }
            catch (error) {
                throw new Error(error);
            }

        })
    }
};
