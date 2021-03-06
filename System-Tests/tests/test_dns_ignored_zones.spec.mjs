import * as assert from "assert";
import { promises as fsPromises } from "fs";
import process from "process";
const { readFile } = fsPromises;
import util from "util";

import { setDNSName, setAPIHost } from "./widgets/network.mjs";
import { setIgnoredZones } from "./widgets/dns.mjs";
import { skipInitialConfig } from "./widgets/initial_setup.mjs";

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

    await setIgnoredZones(page, "test2,what,up.lan");
    // wait to propagate changes to backend
    await page.waitForTimeout(1000);

    const dnsConfigFromCore = await readFile(
      `${wirtBotFileDir}/Corefile`,
      "utf-8"
    );

    assert.match(dnsConfigFromCore, /.* except test test2 what up.lan/);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
