import * as assert from "assert";
import { promises as fsPromises } from "fs";
import process from "process";
const { readFile } = fsPromises;

import { setDNSName, setAPIHost } from "./widgets/network.mjs";
import {
  disableAdblock,
  enableAdblock,
  setBlockLists,
  setBlockHosts,
} from "./widgets/dns.mjs";
import { addServer } from "./widgets/server.mjs";
import { addNewDevice } from "./widgets/devices.mjs";
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
    let dnsUpdateResponse = page.waitForResponse(
      /.*\/update-device-dns-entries/
    );
    await setDNSName(page, "test");
    await dnsUpdateResponse;

    dnsUpdateResponse = page.waitForResponse(/.*\/update-device-dns-entries/);
    await disableAdblock(page);
    await dnsUpdateResponse;

    // flush changes to backend
    await page.waitForTimeout(100);
    let dnsConfigFromCore = await readFile(
      `${wirtBotFileDir}/Corefile`,
      "utf-8"
    );

    assert.doesNotMatch(dnsConfigFromCore, /.*ads {/);
    assert.doesNotMatch(dnsConfigFromCore, /.*default-lists/);

    dnsUpdateResponse = page.waitForResponse(/.*\/update-device-dns-entries/);
    await enableAdblock(page);
    await dnsUpdateResponse;

    dnsUpdateResponse = page.waitForResponse(/.*\/update-device-dns-entries/);
    await addServer(page, {
      ip: "1.2.3.4",
      port: 1234,
      subnet: "10.11.0.",
      name: "test",
    });
    await dnsUpdateResponse;

    dnsUpdateResponse = page.waitForResponse(/.*\/update-device-dns-entries/);
    await addNewDevice(page, {
      ip: { v4: 2 },
      name: "test-1",
      type: "Android",
      additionalDNSServers: "2.2.2.2",
      MTU: 1500,
    });
    await dnsUpdateResponse;

    // flush changes to backend
    await page.waitForTimeout(100);
    dnsConfigFromCore = await readFile(`${wirtBotFileDir}/Corefile`, "utf-8");

    assert.match(dnsConfigFromCore, /.*ads {/);
    assert.match(dnsConfigFromCore, /.*default-lists/);

    dnsUpdateResponse = page.waitForResponse(/.*\/update-device-dns-entries/);
    await setBlockHosts(page, "google.com,test.com");
    await dnsUpdateResponse;

    dnsUpdateResponse = page.waitForResponse(/.*\/update-device-dns-entries/);
    await setBlockLists(
      page,
      "http://test.com/list.txt,http://test2       .com/list.txt"
    );
    await dnsUpdateResponse;

    // flush changes to backend
    await page.waitForTimeout(100);
    dnsConfigFromCore = await readFile(`${wirtBotFileDir}/Corefile`, "utf-8");

    assert.match(dnsConfigFromCore, /blacklist http:\/\/test.com\/list.txt/);
    assert.match(dnsConfigFromCore, /blacklist http:\/\/test2.com\/list.txt/);
    assert.match(dnsConfigFromCore, /block google.com/);
    assert.match(dnsConfigFromCore, /block test.com/);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
