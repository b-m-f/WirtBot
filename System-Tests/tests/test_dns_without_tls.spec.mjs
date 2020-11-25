
import * as assert from "assert";
import { promises as fsPromises } from "fs";
import process from "process";
const { readFile } = fsPromises;
import util from "util";


import { setDNSName } from "./widgets/network.mjs";
import { setDNSTlsName, enableDNSTLS, setDNSIP, disableDNSTLS } from "./widgets/dns.mjs";
import { addServer } from "./widgets/server.mjs";
import { addNewDevice } from "./widgets/devices.mjs";

// This is where the Core writes its updates
const wirtBotFileDir = "/tmp/WirtBotTests";

export default async (browser) => {
    try {
        const page = await browser.newPage();
        await page.goto(process.env.URL);

        await setDNSName(page, "test");
        // The DNS name has to set to .test to work in CI where the wirtbot is in the .test zone
        // Check the Build-Automation directory for more info
        await enableDNSTLS(page);
        await setDNSIP(page, [1, 2, 3, 4]);
        await setDNSTlsName(page, "testdns.test");


        await addServer(page, { ip: [1, 2, 3, 4], port: 1234, subnet: "10.11.0.", name: "test" });
        await addNewDevice(page, { ip: { v4: 2 }, name: "test-1", type: "Android", additionalDNSServers: "2.2.2.2", MTU: 1500 });


        let dnsConfigFromCore = await readFile(`${wirtBotFileDir}/Corefile`, "utf-8");

        assert.match(dnsConfigFromCore, /.*tls:\/\/1.2.3.4/);
        assert.match(dnsConfigFromCore, /.*tls_servername testdns.test/);

        await disableDNSTLS(page);
        dnsConfigFromCore = await readFile(`${wirtBotFileDir}/Corefile`, "utf-8");

        assert.match(dnsConfigFromCore, /forward . 1.2.3.4/);
        assert.doesNotMatch(dnsConfigFromCore, /.*tls_servername/);

    } catch (error) {
        console.error(error);
        throw error;
    }


    // backup
    // let json = JSON.parse(data);
    // assert(typeof json.deviceTypes === 'object')
};
