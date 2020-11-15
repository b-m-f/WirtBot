import { firefox } from "playwright";
import simple_network from "./test_creating_simple_network.mjs";

const tests = async () => {
    const browser = await firefox.launch({ headless: false, slowMo: 50 });
    const browserContext = await browser.newContext({ acceptDownloads: true });
    await simple_network(browserContext);
};

const main = async () => {
    try {
        await tests();
        console.log("All tests ran successfully");
    } catch (error) {
        console.error(error);
    }
};
main();