import assert from "assert";
import { promises as fsPromises } from "fs";
import process from "process";
import { importBackup } from "./widgets/settings.mjs";
import { setDNSName, setAPIHost } from "./widgets/network.mjs";
import {
  addServer,
  downloadConfig as downloadServerConfig,
} from "./widgets/server.mjs";
import {
  getConfig as getDeviceConfig,
  downloadConfig as downloadDeviceConfig,
} from "./widgets/devices.mjs";
import { getConfig as getDNSConfig } from "./widgets/dns.mjs";
import { getConfig as getNetworkConfig } from "./widgets/network.mjs";
import { skipInitialConfig } from "./widgets/initial_setup.mjs";

const { readFile } = fsPromises;

export default async (browser) => {
  try {
    let page = await browser.newPage();
    await page.goto(process.env.URL);
    await skipInitialConfig(page);
    await addServer(page, { ip: "1.2.3.4", port: 1234 });
    // make sure that server is saved into store before closing
    // create config that should be overwritten
    await setAPIHost(page, process.env.API);
    // The DNS name has to set to .test to work in CI where the wirtbot is in the .test zone
    // Check the Build-Automation directory for more info
    await setDNSName(page, "test");

    await page.waitForTimeout(500);
    await page.close();

    let backups = [
      "./backups/1.4.5.json",
      "./backups/2.3.3.json",
      "./backups/2.3.4.json",
      "./backups/2.6.0.json",
    ];

    for (const backup of backups) {
      let page = await browser.newPage();
      await page.goto(process.env.URL);
      await importBackup(page, backup);

      const json = JSON.parse(await readFile(backup));

      await page.waitForSelector(".device[data-name='test-1']");
      const deviceConfig1 = await getDeviceConfig(
        await page.$(".device[data-name='test-1']")
      );
      await page.waitForSelector(".device[data-name='test-2']");
      const deviceConfig2 = await getDeviceConfig(
        await page.$(".device[data-name='test-2']")
      );

      const dnsConfig = await getDNSConfig(page);

      const networkConfig = await getNetworkConfig(page);

      if (json.version < "2.3.4") {
        json.network.dns.ip.v4 = json.network.dns.ip.v4.join(".");
      }
      if (json.version < "2.5.0") {
        json.network.dns.ignoredZones = ["fritz.box", "home", "lan", "local"];
      }

      assert.strictEqual(dnsConfig.ip.v4, json.network.dns.ip.v4);
      assert.strictEqual(dnsConfig.tls, json.network.dns.tls);
      assert.strictEqual(dnsConfig.tlsName, json.network.dns.tlsName);
      for (let zone of json.network.dns.ignoredZones) {
        assert(dnsConfig.ignoredZones.includes(zone));
      }

      assert.strictEqual(networkConfig.name, json.network.dns.name);

      assert.deepStrictEqual(deviceConfig1.ip, json.devices[1].ip);
      assert.strictEqual(deviceConfig1.name, json.devices[1].name);
      assert.strictEqual(deviceConfig1.MTU, json.devices[1].MTU);
      assert.strictEqual(deviceConfig1.type, json.devices[1].type);
      assert.deepStrictEqual(
        deviceConfig1.additionalDNSServers,
        json.devices[1].additionalDNSServers
      );

      assert.deepStrictEqual(deviceConfig2.ip, json.devices[0].ip);
      assert.strictEqual(deviceConfig2.name, json.devices[0].name);
      assert.strictEqual(deviceConfig2.MTU, json.devices[0].MTU);
      assert.strictEqual(deviceConfig2.type, json.devices[0].type);
      assert.deepStrictEqual(
        deviceConfig2.additionalDNSServers,
        json.devices[0].additionalDNSServers
      );

      // Check that the keys are correct by actually downloading the configs
      const deviceConfigPath = await downloadDeviceConfig(page, "test-1");
      const serverConfigPath = await downloadServerConfig(page);

      const downloadedDeviceConfig = await readFile(
        `${deviceConfigPath}`,
        "utf-8"
      );
      const downloadedServerConfig = await readFile(
        `${serverConfigPath}`,
        "utf-8"
      );

      const devicePrivateKeyFromDownloadedConfig = downloadedDeviceConfig
        .match(/PrivateKey = .*/)[0]
        .replace("PrivateKey = ", "");
      const serverPublicKeyFromDownloadedConfig = downloadedDeviceConfig
        .match(/PublicKey = .*/)[0]
        .replace("PublicKey = ", "");

      assert.deepStrictEqual(
        devicePrivateKeyFromDownloadedConfig,
        json.devices[1].keys.private
      );
      assert.deepStrictEqual(
        serverPublicKeyFromDownloadedConfig,
        json.server.keys.public
      );

      for (let device of json.devices) {
        assert.strictEqual(
          downloadedServerConfig.includes(device.keys.public),
          true
        );
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
