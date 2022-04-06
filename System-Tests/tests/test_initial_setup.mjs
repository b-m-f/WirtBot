

import * as assert from "assert";
import process from "process";


import { skipInitialConfig } from "./widgets/initial_setup.mjs";


export default async (browser) => {
    try {
        const page = await browser.newPage();
        await page.goto(process.env.URL);
        await skipInitialConfig(page);
        const content = await page.textContent("#top-bar h1");
        assert.strictEqual(content, "Dashboard");

    } catch (error) {
        console.error(error);
        throw error;
    }
};
