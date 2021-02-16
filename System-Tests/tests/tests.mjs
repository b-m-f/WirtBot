import process from "process";
import { firefox, chromium } from "playwright";

const testRunner = async (testPaths) => {
    const browsers = {
        firefox: await firefox.launch({ headless: true }),
        chromium: await chromium.launch({ headless: true, args: ['--disable-dev-shm-usage'] })
    };
    let testSuites = [];
    try {
        testSuites = [
            // Promise.all resolves as an array with 1 element somehow
            await Promise.all(testPaths.map(async test => {
                return { name: test, module: await import(`./${test}`) };
            }))
        ][0].map(suite => {
            return { name: suite.name, module: suite.module.default };
        });
    } catch (error) {
        console.log(error);

    }
    for (const key of Object.keys(browsers)) {
        for (const suite of testSuites) {
            try {
                let browserContext = await browsers[key].newContext({ acceptDownloads: true });
                await suite.module(browserContext);

                console.log(`Test: ${suite.name} in browser ${key} ran successfully`);
                browsers[key].close();
            } catch (error) {
                browsers[key].close();
                console.log(`Test: ${suite.name} in browser ${key} failed`);
                throw "Tests failed";
            }
        }
    }
};

const main = async () => {
    try {
        if (!process.env.URL) {
            throw "Please define the Interface url with the URL environment variable";
        }
        if (!process.env.API) {
            throw "Please defined the API Url with the URL environment variable";
        }
        const testPaths = process.argv.slice(2);
        await testRunner(testPaths);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
main();