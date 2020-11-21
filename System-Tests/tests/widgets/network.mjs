import assert from "assert";

export const networkWidget = async (page) => {
    return await page.$("css=#network-widget");
};

export const getConfig = async (page) => {
    const widget = await networkWidget(page);
    const zoneNameInput = await widget.$("input[name='dns-name']");

    return {
        name: await zoneNameInput.evaluate(e => e.value)
    };
};

export const setDNSName = async (page, name) => {
    const network = await networkWidget(page);
    const zoneNameInput = await network.$("input[name='dns-name']");
    await zoneNameInput.fill(name);
};
