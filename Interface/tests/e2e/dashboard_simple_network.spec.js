const fs = require("fs")

module.exports = {
    "Add server": async function (browser) {
        await browser.url(`http://${process.env.TEST_URL}/dashboard`);
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
        await browser.click("button#save");
    },
    "Add routed device": async function (browser) {
        await browser.click("#add-device button");

        await browser.setValue("input[name='device-name']", "test2");
        await browser.setValue("input[name='device-ipv4']", "3");
        await browser.setValue("select.device-type", "Linux");
        await browser.click("input[name='routed']");
        await browser.click("button#save");
    },
    "Download and verify server configuration": async function (browser) {
        // await browser.click("#server-widget #download");
        // function checkDownload() {
        //     fs.readFile('/Downloads/server.conf', (err, data) => {
        //         if (err) throw err;
        //         console.log(data);
        //     });

        // }
        // await setTimeout(checkDownload, 1500);
    },
};
