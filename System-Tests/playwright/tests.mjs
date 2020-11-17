import process from "process";
import { firefox, chromium } from "playwright";

const testRunner = async (testPaths) => {
    const browsers = {
        firefox: await firefox.launch({ headless: true }),
        chromium: await chromium.launch({ headless: true })
    };
    let testSuites = [];
    try {
        testSuites = [
            await Promise.all(testPaths.map(async test => (await import(`./${test}`))))
        ].map(module => module[0].default);
    } catch (error) {
        console.log(error);

    }
    for (const key of Object.keys(browsers)) {
        try {
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
        const testPaths = process.argv.slice(2);
        await testRunner(testPaths);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
main();