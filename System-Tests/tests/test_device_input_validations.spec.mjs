import * as assert from "assert";
import { promises as fsPromises } from "fs";
const { readFile } = fsPromises;
import process from "process";

import { setDNSName } from "./widgets/network.mjs";
import { addServer, downloadConfig as downloadServerConfig } from "./widgets/server.mjs";
import { addNewDevice, downloadConfig as downloadDeviceConfig, setIPv6, setIPv4 } from "./widgets/devices.mjs";

// This is where the Core writes its updates
const wirtBotFileDir = "/tmp/WirtBotTests";

export default async (browser) => {
    try {
        const page = await browser.newPage();
        await page.goto(process.env.URL);

        await setDNSName(page, "test");
        // The DNS name has to set to .test to work in CI where the wirtbot is in the .test zone
        // Check the Build-Automation directory for more info
        await addServer(page, { ip: [1, 2, 3, 4], port: 1234 });

        // devices cant have same ip
        await addNewDevice(page, { ip: { v4: 2 }, name: "test-1", type: "Android" });
        await addNewDevice(page, { ip: { v4: 3 }, name: "test-2", type: "Android" });

        let device = await page.$(".device[data-name='test-1']");

        await setIPv4(device, 3);
        let valid = await page.$eval(".device[data-name='test-1'] input[name='device-ipv4']", e => {
            return e.validity.valid;
        });
        assert.strictEqual(valid, false);

        // cant set to 1, where the WirtBot is
        await setIPv4(device, 1);
        valid = await page.$eval(".device[data-name='test-1'] input[name='device-ipv4']", e => {
            return e.validity.valid;
        });
        assert.strictEqual(valid, false);

        // cant set above 255
        await setIPv4(device, 256);
        valid = await page.$eval(".device[data-name='test-1'] input[name='device-ipv4']", e => {
            return e.validity.valid;
        });
        assert.strictEqual(valid, false);

        // IPv6 cant be 0001, where the server is
        await setIPv6(device, 256);
        valid = await page.$eval(".device[data-name='test-1'] input[name='device-ipv6']", e => {
            return e.validity.valid;
        });
        assert.strictEqual(valid, false);

        // IPv6 cant be above fffe, where the server is
        await setIPv6(device, "ffff");
        valid = await page.$eval(".device[data-name='test-1'] input[name='device-ipv6']", e => {
            return e.validity.valid;
        });
        assert.strictEqual(valid, false);





    } catch (error) {
        console.error(error);
        throw error;
    }


    // backup
    // let json = JSON.parse(data);
    // assert(typeof json.deviceTypes === 'object')
};

