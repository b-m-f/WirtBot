import assert from "assert";
import { promises as fsPromises } from "fs";
import process from "process";
import { importBackup } from "./widgets/settings.mjs";
import { skipInitialConfig } from "./widgets/initial_setup.mjs";
import { setDNSName, setAPIHost } from "./widgets/network.mjs";
import { addServer } from "./widgets/server.mjs";
import { addNewDevice } from "./widgets/devices.mjs";

const { readFile } = fsPromises;
// This is where the Core writes its updates
const wirtBotFileDir = "/tmp/WirtBotTests";

export default async (browser) => {
  try {
    let page = await browser.newPage();
    await page.goto(process.env.URL);
    await skipInitialConfig(page);
    await page.close();

    let backup = ["./backups/2.6.0.json"];

    page = await browser.newPage();
    await page.goto(process.env.URL);

    // create config that should be overwritten
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
      ip: { v4: 255 },
      name: "test-initial",
      type: "Android",
    });

    await updateResponse;
    await dnsUpdateResponse;

    let serverConfigFromCore = await readFile(
      `${wirtBotFileDir}/server.conf`,
      "utf-8"
    );
    assert.match(serverConfigFromCore, /.*AllowedIPs = 10.10.0.255.*/);

    // Overwrite config with backup

    updateResponse = page.waitForResponse(/.*\/update/);
    dnsUpdateResponse = page.waitForResponse(/.*\/update-device-dns-entries/);
    await importBackup(page, backup);

    await updateResponse;
    await dnsUpdateResponse;

    // Make sure initially setup device is removed
    serverConfigFromCore = await readFile(
      `${wirtBotFileDir}/server.conf`,
      "utf-8"
    );
    assert.doesNotMatch(serverConfigFromCore, /.*AllowedIPs = 10.10.0.255.*/);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
