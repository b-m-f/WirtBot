
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

    const deviceConfig = await readFile(`${filePath}`);
    const serverConfig = await readFile(`${wirtBotFileDir}/server.conf`);
    console.log(deviceConfig);
    console.log(serverConfig);

    await browser.close();
};
