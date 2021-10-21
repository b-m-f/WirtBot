import process from "process";
import assert from "assert";

import { setDNSName, setAPIHost } from "./widgets/network.mjs";
import { addServer, getConfig as getServerConfig } from "./widgets/server.mjs";
import {
  addNewDevice,
  downloadConfig as downloadDeviceConfig,
} from "./widgets/devices.mjs";
import { setDNSIP, getConfig as getDNSConfig } from "./widgets/dns.mjs";
import { skipInitialConfig } from "./widgets/initial_setup.mjs";
import { promises as fsPromises } from "fs";
const { readFile } = fsPromises;

// This is where the Core writes its updates
const wirtBotFileDir = "/tmp/WirtBotTests";

export default async (browser) => {
  try {
    const page = await browser.newPage();
    await page.goto(process.env.URL);
    await skipInitialConfig(page);

    await setAPIHost(page, process.env.API);
    await setDNSName(page, "test");
    // The DNS name has to set to .test to work in CI where the wirtbot is in the .test zone
    // Check the Build-Automation directory for more info

    // Test that the server IP wont update for the devices on incorrect input
    await addServer(page, { ip: "1.2.3.4", port: 1234 });
    await addNewDevice(page, {
      ip: { v4: 2 },
      name: "test-1",
      type: "Android",
    });
    await page.waitForSelector(".device[data-name='test-1']");
    await page.reload();
    await addServer(page, { ip: "1.2.3", port: 1234 });
    const serverConfigOnPage = await getServerConfig(page);

    const deviceConfigPath = await downloadDeviceConfig(page, "test-1");
    const deviceConfig = await readFile(`${deviceConfigPath}`, "utf-8");

    assert.strictEqual(serverConfigOnPage.ip.v4, "1.2.3");
    let valid = await page.$eval(
      "#server-widget input[name='ip-input']",
      (e) => {
        return e.validity.valid;
      }
    );
    assert.strictEqual(valid, false);
    assert.match(deviceConfig, /.*Endpoint = 1.2.3.4/);

    // Test that DNS Ip wont update on incorrect input
    await setDNSIP(page, "1.1.1");
    const dnsConfigOnpage = await getDNSConfig(page);
    let dnsConfigFromCore = await readFile(
      `${wirtBotFileDir}/Corefile`,
      "utf-8"
    );

    assert.strictEqual(dnsConfigOnpage.ip.v4, "1.1.1");
    valid = await page.$eval("#dns-widget input[name='ip-input']", (e) => {
      return e.validity.valid;
    });
    assert.strictEqual(valid, false);
    assert.match(dnsConfigFromCore, /.*tls:\/\/1.1.1.1/);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
