import * as assert from "assert";
import { promises as fsPromises } from "fs";
import process from "process";
const { readFile } = fsPromises;
import util from "util";


import { setDNSName } from "./widgets/network.mjs";
import { setDNSTlsName, enableDNSTLS, setDNSIP } from "./widgets/dns.mjs";
import { updateServer, addServer, downloadConfig as downloadServerConfig } from "./widgets/server.mjs";
import { addNewDevice, downloadConfig as downloadDeviceConfig } from "./widgets/devices.mjs";
import { skipInitialConfig } from "./widgets/initial_setup.mjs"

// This is where the Core writes its updates
const wirtBotFileDir = "/tmp/WirtBotTests";

export default async (browser) => {
    try {
        const page = await browser.newPage();
        await page.goto(process.env.URL);
        await skipInitialConfig(page);

        await setDNSName(page, "test");
        // The DNS name has to set to .test to work in CI where the wirtbot is in the .test zone
        // Check the Build-Automation directory for more info
        await enableDNSTLS(page);
        await setDNSIP(page, [1, 2, 3, 4]);
        await setDNSTlsName(page, "testdns.test");


        await addServer(page, { ip: [1, 2, 3, 4], port: 1234, subnet: "10.11.0.", name: "test" });
        await addNewDevice(page, { ip: { v4: 2 }, name: "test-1", type: "Android", additionalDNSServers: "2.2.2.2", MTU: 1500 });
        await addNewDevice(page, { ip: { v4: 3, v6: "fffe" }, name: "test-2", type: "Linux", additionalDNSServers: "4.4.4.4,5.5.5.5", MTU: 1320 });
        await addNewDevice(page, { ip: { v6: "fffa" }, name: "test-3", type: "Linux" });


        const deviceConfigPathOne = await downloadDeviceConfig(page, "test-1");

        await updateServer(page, { hostname: "test.test" });

        const deviceConfigPathTwo = await downloadDeviceConfig(page, "test-2");
        const deviceConfigPathThree = await downloadDeviceConfig(page, "test-3");
        const serverConfigPath = await downloadServerConfig(page);

        const deviceConfigOne = await readFile(`${deviceConfigPathOne}`, "utf-8");
        const deviceConfigTwo = await readFile(`${deviceConfigPathTwo}`, "utf-8");
        const deviceConfigThree = await readFile(`${deviceConfigPathThree}`, "utf-8");
        const serverConfig = await readFile(`${serverConfigPath}`, "utf-8");

        const serverConfigFromCore = await readFile(`${wirtBotFileDir}/server.conf`, "utf-8");
        const dnsConfigFromCore = await readFile(`${wirtBotFileDir}/Corefile`, "utf-8");


        assert.match(deviceConfigOne, /.*Endpoint = 1.2.3.4:1234/);
        assert.match(deviceConfigOne, /.*Address = 10.11.0.2/);
        assert.match(deviceConfigOne, /.*DNS = 10.11.0.1,2.2.2.2/);
        assert.match(deviceConfigOne, /.*MTU = 1500/);

        assert.match(deviceConfigTwo, /.*Endpoint = test.test:1234/);
        assert.match(deviceConfigTwo, /.*Address = 10.11.0.3,1010:1010:1010:1010:fffe/);
        assert.match(deviceConfigTwo, /.*DNS = 10.11.0.1,4.4.4.4,5.5.5.5/);
        assert.match(deviceConfigTwo, /.*MTU = 1320/);

        assert.match(deviceConfigThree, /.*Endpoint = test.test:1234/);
        assert.match(deviceConfigThree, /.*Address = 1010:1010:1010:1010:fffa/);
        assert.match(deviceConfigThree, /.*DNS = 1010:1010:1010:1010:0001/);

        assert.match(serverConfig, /.*ListenPort = 1234/);
        assert.match(serverConfig, /.*Address = 10.11.0.1,1010:1010:1010:1010:0001/);
        assert.strictEqual(serverConfig, serverConfigFromCore);

        assert.match(dnsConfigFromCore, /.*test-1.test/);
        assert.match(dnsConfigFromCore, /.*test-2.test/);
        assert.match(dnsConfigFromCore, /.*tls:\/\/1.2.3.4/);
        assert.match(dnsConfigFromCore, /.*tls_servername testdns.test/);

    } catch (error) {
        console.error(error);
        throw error;
    }


    // backup
    // let json = JSON.parse(data);
    // assert(typeof json.deviceTypes === 'object')
};
