import * as assert from "assert";
import { promises as fsPromises } from "fs";
const { readFile } = fsPromises;
import process from "process";

import { setDNSName } from "./widgets/network.mjs";
import { addServer, downloadConfig as downloadServerConfig } from "./widgets/server.mjs";
import { addNewDevice, downloadConfig as downloadDeviceConfig } from "./widgets/devices.mjs";

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
        await addNewDevice(page, { ip: { v4: 2 }, name: "test-1", type: "Android" });

        const numberOfSuccessAlertsForDNSAndConfig = await page.$$eval("#alerts .success", (items) => items.length);
        assert.strictEqual(numberOfSuccessAlertsForDNSAndConfig, 2);

        const deviceConfigPath = await downloadDeviceConfig(page, "test-1");
        const serverConfigPath = await downloadServerConfig(page);

        const deviceConfig = await readFile(`${deviceConfigPath}`, "utf-8");
        const serverConfig = await readFile(`${serverConfigPath}`, "utf-8");
        const serverConfigFromCore = await readFile(`${wirtBotFileDir}/server.conf`, "utf-8");


        assert.match(deviceConfig, /.*Endpoint = 1.2.3.4:1234/);
        assert.match(deviceConfig, /.*Address = 10.10.0.2.*/);

        assert.match(serverConfig, /.*ListenPort = 1234.*/);
        assert.match(serverConfig, /.*Address = 10.10.0.1.*/);
        assert.strictEqual(serverConfig, serverConfigFromCore);

    } catch (error) {
        console.error(error);
        throw error;
    }
};
