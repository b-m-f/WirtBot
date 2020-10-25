const fs = require("fs").promises
const assert = require('assert')
const util = require('util');
const glob = require('glob');
const setTimeoutAsync = util.promisify(setTimeout);

module.exports = {
    "Add server": async function (browser) {
        await browser.url(`http://${process.env.TEST_URL}/`);
        await browser.waitForElementVisible({
            selector: ".app",
            message: "Setting Server data",
        });

        await browser.click("#server-widget #edit");
        await browser.setValue("#server-widget input[name='hostname']", "localhost");
        await browser.execute(function () {
            var element = document.querySelector("#server-widget input[name='hostname']");
            var event = new Event("change");
            element.dispatchEvent(event);
        });

        await browser.setValue("#server-widget input[name='port']", "1233");
        await browser.execute(function () {
            var element = document.querySelector("#server-widget input[name='port']");
            var event = new Event("change");
            element.dispatchEvent(event);
        });

        await browser.click("#server-widget #edit");
    },
    "Add new device": async function (browser) {
        await browser.click("#add-device button");

        await browser.setValue("input[name='device-name']", "test1");
        await browser.setValue("input[name='device-ipv4']", "2");
        await browser.setValue("select.device-type", "Linux");
        await browser.click("button.save");
        browser.expect.elements(".table-row.device-overview").count.to.equal(1);
    },
    "Add complex device": async function (browser) {
        await browser.click("#expert-mode #expert");
        await browser.click("#add-device button");

        await browser.setValue("input[name='device-name']", "test2");
        await browser.setValue("input[name='device-ipv4']", "3");
        await browser.setValue("select.device-type", "Linux");
        await browser.setValue("input[name='MTU']", "1320");
        await browser.setValue("input[name='additionalDNSServers']", "1.1.1.1,2.2.2.2");
        await browser.click("input[name='routed']");
        await browser.pause(2000) // REFACTOR: this is done to wait for the debouce that is on MTU and additionalDNSServers
        await browser.click("button.save");
        browser.expect.elements(".table-row.device-overview").count.to.equal(2);
    },
    "Download and verify server configuration": async function (browser) {
        const downloadLocation = '/tmp/WirtTestDownloads/server.conf'
        await browser.click("#server-widget #download");

        try {
            await setTimeoutAsync(1000, 'waitForDownload').then(async () => {
                const data = await fs.readFile(downloadLocation, "utf8")
                assert.match(data, /.*ListenPort = 1233.*/)

                await fs.unlink(downloadLocation)
            });
        } catch (error) {
            await fs.unlink(downloadLocation)
            throw new Error(error);
        }
    },
    "Download and verify complex device configuration": async function (browser) {
        const downloadLocation = '/tmp/WirtTestDownloads/test2.conf'
        await browser.click(".table-row.device-overview:first-child .download");
        try {
            await setTimeoutAsync(1000, 'waitForDownload').then(async () => {
                const data = await fs.readFile(downloadLocation, "utf8")
                assert.match(data, /.*DNS = 10\.10\.0\.1,1\.1\.1\.1,2\.2\.2\.2.*/)
                assert.match(data, /.*MTU = 1320.*/)

                await fs.unlink(downloadLocation)
            });
        } catch (error) {
            await fs.unlink(downloadLocation)
            throw new Error(error);
        }
    },
    "Download and verify that backup is a simple JSON string": async function (browser) {
        await browser.click("#export button");
        try {
            await setTimeoutAsync(1000, 'waitForDownload').then(async () => {
                let files = glob.sync("/tmp/WirtTestDownloads/dasboard-backup-*.json");
                let file = files[files.length - 1];
                try {
                    const data = await fs.readFile(file, "utf8")
                    let json = JSON.parse(data);
                    assert(typeof json.version === 'number' )
                    fs.unlink(file)
                } catch (error) {
                    fs.unlink(file)
                    throw new Error(error);
                }
            });
        } catch (error) {
            throw new Error(error);
        }
    },
    "MTU is bounded": async function (browser) {
        await browser.click("#add-device button");

        await browser.setValue("input[name='device-name']", "mtu-test");
        await browser.setValue("input[name='MTU']", "20000");
        await browser.assert.visible("#alerts .warning");
        await browser.pause(3000)
        await browser.click("button.stop");
    },
    "additional DNS Servers must be a comma separated list of valid IPv4s": async function (browser) {
        await browser.click("#add-device button");
        await browser.setValue("input[name='additionalDNSServers']", "1.1.1.1,2.2.2.t");
        await browser.assert.visible("#alerts .warning");

        await browser.setValue("input[name='additionalDNSServers']", "1.1.1.1,2.2.2.");
        await browser.assert.visible("#alerts .warning");
        await browser.pause(3000)

        await browser.click("button.stop");
    },
};
