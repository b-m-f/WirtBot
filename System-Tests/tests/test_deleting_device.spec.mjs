import * as assert from "assert";
import { promises as fsPromises } from "fs";
const { readFile } = fsPromises;
import process from "process";

import { setDNSName, setAPIHost } from "./widgets/network.mjs";
import {
  addServer,
  downloadConfig as downloadServerConfig,
} from "./widgets/server.mjs";
import { addNewDevice, deleteDevice } from "./widgets/devices.mjs";
import { skipInitialConfig } from "./widgets/initial_setup.mjs";

// This is where the Core writes its updates
const wirtBotFileDir = "/tmp/WirtBotTests";

export default async (browser) => {
  try {
    const page = await browser.newPage();
    await page.goto(process.env.URL);
    await skipInitialConfig(page);

    await setAPIHost(page, process.env.API);
    // The DNS name has to set to .test to work in CI where the wirtbot is in the .test zone
    // Check the Build-Automation directory for more info
    await setDNSName(page, "test");

    let updateResponse = page.waitForResponse(/.*\/update/);
    let dnsUpdateResponse = page.waitForResponse(
      /.*\/update-device-dns-entries/
    );
    await addServer(page, { ip: "1.2.3.4", port: 1234 });
    await addNewDevice(page, {
      ip: { v4: 2 },
      name: "test-1",
      type: "Android",
    });

    await updateResponse;
    await dnsUpdateResponse;

    // Wait for alerts to pop up
    await page.waitForTimeout(500);

    const numberOfSuccessAlertsForDNSAndConfig = await page.$$eval(
      "#alerts .success",
      (items) => items.length
    );
    assert.strictEqual(numberOfSuccessAlertsForDNSAndConfig, 2);

    const serverConfigPath = await downloadServerConfig(page);

    let serverConfig = await readFile(`${serverConfigPath}`, "utf-8");
    const serverConfigFromCore = await readFile(
      `${wirtBotFileDir}/server.conf`,
      "utf-8"
    );

    assert.match(serverConfig, /.*ListenPort = 1234.*/);
    assert.match(serverConfig, /.*Address = 10.10.0.1.*/);
    assert.match(serverConfig, /.*AllowedIPs = 10.10.0.2.*/);
    assert.strictEqual(serverConfig, serverConfigFromCore);

    // Delete device and make sure it is removed from the server config
    updateResponse = page.waitForResponse(/.*\/update/);
    dnsUpdateResponse = page.waitForResponse(/.*\/update-device-dns-entries/);

    await deleteDevice(page, "test-1");
    await updateResponse;
    await dnsUpdateResponse;

    serverConfig = await readFile(`${wirtBotFileDir}/server.conf`, "utf-8");
    assert.doesNotMatch(serverConfig, /.*AllowedIPs = 10.10.0.2.*/);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
