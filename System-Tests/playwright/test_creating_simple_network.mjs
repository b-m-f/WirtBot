
import * as assert from "assert";
import { promises as fsPromises } from "fs";
const { readFile } = fsPromises;

import { setDNSName } from "./widgets/network.mjs";
import { addServer } from "./widgets/server.mjs";
import { addNewDevice, downloadConfig } from "./widgets/devices.mjs";

// This is where the Core writes its updates
const wirtBotFileDir = "/tmp/WirtBotTests";

export default async (browser) => {
    // Create pages, interact with UI elements, assert values
    const page = await browser.newPage();
    await page.goto("http://localhost:8080/");

    await setDNSName(page, "test");
    await addServer(page, { ip: [1, 2, 3, 4], port: 1234 });

    await addNewDevice(page, { ip: { v4: 2 }, name: "test-1", type: "Android" });

    const filePath = await downloadConfig(page, "test-1");

    const deviceConfig = await readFile(`${filePath}`, "utf-8");
    const serverConfig = await readFile(`${wirtBotFileDir}/server.conf`, "utf-8");


    try {
        assert.match(deviceConfig, /.*DNS = 10\.10\.0\.1,1\.1\.1\.1,2\.2\.2\.2.*/);
        assert.match(deviceConfig, /.*MTU = 1320.*/);
        assert.match(serverConfig, /.*ListenPort = 1233.*/);

    } catch (error) {
        console.error(error);
        throw error;
    }


    // backup
    // let json = JSON.parse(data);
    // assert(typeof json.deviceTypes === 'object')
    console.log(deviceConfig);
    console.log(serverConfig);
};
