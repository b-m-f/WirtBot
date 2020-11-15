import process from "process";
import { firefox, chromium } from "playwright";
import simple_network from "./test_creating_simple_network.spec.mjs";
import complex_network from "./test_creating_complex_network.spec.mjs";

const tests = async () => {
    const browsers = {
        firefox: await firefox.launch({ headless: true }),
        chromium: await chromium.launch({ headless: true })
    };
    for (const key of Object.keys(browsers)) {
        try {
            const testSuites = [
                simple_network,
                complex_network
            ];
            for (const suite of testSuites) {
                let browserContext = await browsers[key].newContext({ acceptDownloads: true });
                await suite(browserContext);
            }
            browsers[key].close();
            console.log(`All tests in browser ${key} ran successfully`);
        } catch (error) {
            browsers[key].close();
            console.log(`Tests in browser ${key} failed`);
            throw "Tests failed";
        }
    }
};

const main = async () => {
    try {
        await tests();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
main();