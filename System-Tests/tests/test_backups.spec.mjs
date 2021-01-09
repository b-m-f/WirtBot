import assert from "assert";
import { promises as fsPromises } from "fs";
import process from "process";
import { importBackup } from "./widgets/settings.mjs";
import { getConfig as getServerConfig, downloadConfig as downloadServerConfig } from "./widgets/server.mjs";
import { getConfig as getDeviceConfig, downloadConfig as downloadDeviceConfig } from "./widgets/devices.mjs";
import { getConfig as getDNSConfig } from "./widgets/dns.mjs";
import { getConfig as getNetworkConfig } from "./widgets/network.mjs";


const { readFile } = fsPromises;




export default async (browser) => {
    try {
        const page = await browser.newPage();
        await page.goto(process.env.URL);

        let backups = ["./backups/1.4.5.json"];

        for (const backup of backups) {
            await importBackup(page, backup);

            const json = JSON.parse(await readFile(backup));
            const serverConfig = await getServerConfig(page);

            const deviceConfig1 = await getDeviceConfig(await page.$(".device[data-name='test-1']"));
            const deviceConfig2 = await getDeviceConfig(await page.$(".device[data-name='test-2']"));

            const dnsConfig = await getDNSConfig(page);

            const networkConfig = await getNetworkConfig(page);

            assert(
                dnsConfig.ip.v4.join(",") ==
                json.network.dns.ip.v4.join(",")
            );
            assert.strictEqual(dnsConfig.tls, json.network.dns.tls);
            assert.strictEqual(dnsConfig.tlsName, json.network.dns.tlsName);

            assert.strictEqual(networkConfig.name, json.network.dns.name);

            assert.strictEqual(serverConfig.name, json.server.name);
            assert.deepStrictEqual(serverConfig.ip, json.server.ip);
            assert.strictEqual(serverConfig.hostname, json.server.hostname);
            assert.deepStrictEqual(serverConfig.subnet, json.server.subnet);
            assert.strictEqual(serverConfig.port, json.server.port);

            // How could the mapping from device in backup and from browser be more transparent
            assert.deepStrictEqual(deviceConfig1.ip, json.devices[1].ip);
            assert.strictEqual(deviceConfig1.name, json.devices[1].name);
            assert.strictEqual(deviceConfig1.MTU, json.devices[1].MTU);
            assert.strictEqual(deviceConfig1.type, json.devices[1].type);
            assert.deepStrictEqual(deviceConfig1.additionalDNSServers, json.devices[1].additionalDNSServers);

            assert.deepStrictEqual(deviceConfig2.ip, json.devices[0].ip);
            assert.strictEqual(deviceConfig2.name, json.devices[0].name);
            assert.strictEqual(deviceConfig2.MTU, json.devices[0].MTU);
            assert.strictEqual(deviceConfig2.type, json.devices[0].type);
            assert.deepStrictEqual(deviceConfig2.additionalDNSServers, json.devices[0].additionalDNSServers);

            // Check that the keys are correct by actually downloading the configs
            const deviceConfigPath = await downloadDeviceConfig(page, "test-1");
            const serverConfigPath = await downloadServerConfig(page);

            const downloadedDeviceConfig = await readFile(`${deviceConfigPath}`, "utf-8");
            const downloadedServerConfig = await readFile(`${serverConfigPath}`, "utf-8");
            assert.deepStrictEqual(downloadedDeviceConfig.keys, json.devices[0].keys);
            assert.deepStrictEqual(downloadedServerConfig.keys, 2);

        }

    } catch (error) {
        console.error(error);
        throw error;
    }


};
