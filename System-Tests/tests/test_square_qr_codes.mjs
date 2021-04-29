import * as assert from "assert";
import { promises as fsPromises } from "fs";
const { readFile } = fsPromises;
import process from "process";

import { setDNSName, setAPIHost } from "./widgets/network.mjs";
import {
  addServer,
  downloadConfig as downloadServerConfig,
} from "./widgets/server.mjs";
import {
  addNewDevice,
  downloadConfig as downloadDeviceConfig,
} from "./widgets/devices.mjs";
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

    const updateResponse = page.waitForResponse(/.*\/update/);
    const dnsUpdateResponse = page.waitForResponse(
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
    await page.waitForTimeout(200);

    const width = await page.$eval(
      ".device[data-name='test-1'] .qr-code",
      (el) => window.getComputedStyle(el).fontSize
    );
    const height = await page.$eval(
      ".device[data-name='test-1'] .qr-code",
      (el) => window.getComputedStyle(el).fontSize
    );
    assert.strictEqual(width, height);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
