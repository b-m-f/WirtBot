import process from "process";
import { firefox, chromium } from "playwright";
import simple_network from "./test_creating_simple_network.mjs";

const tests = async () => {
    const browsers = {
        firefox: await firefox.launch({ headless: false, slowMo: 50 }),
        chromium: await chromium.launch({ headless: false, slowMo: 50 })
    };
    const success = Object.keys(browsers).map(async key => {
        try {
            const browserContext = await browsers[key].newContext({ acceptDownloads: true });
            await simple_network(browserContext);
            browsers[key].close();
            console.log(`All tests in browser ${key} ran successfully`);
            return true;

        } catch (error) {
            browsers[key].close();
            console.log(`Tests in browser ${key} failed`);
            return false;
        }

    }).reduce((prev, next) => prev && next);
    if (!success) {
        throw "Tests failed";
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