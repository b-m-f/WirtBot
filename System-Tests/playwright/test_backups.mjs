
import * as assert from "assert";
import { promises as fsPromises } from "fs";
import { importBackup } from "./widgets/settings.mjs";
import { getServerConfig } from "./widgets/server.mjs";


const { readFile } = fsPromises;




export default async (browser) => {
    try {
        const page = await browser.newPage();
        await page.goto("http://localhost:8080/");

        let backups = ["./backups/1.4.5.json"];

        for (const backup of backups) {
            await importBackup(page, backup);

            try {
                const json = JSON.parse(await readFile(backup));
                const serverConfig = await getServerConfig(page);

                console.log(serverConfig);

            } catch (error) {
                console.error(error);

            }



        }



    } catch (error) {
        console.error(error);
        throw error;
    }


};
