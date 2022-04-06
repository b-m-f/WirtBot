export const networkWidget = async (page) => {
    return await page.locator("css=#network-widget");
};

export const getConfig = async (page) => {
    const widget = await networkWidget(page);
    const zoneNameInput = await widget.locator("input[name='dns-name']");

    return {
        name: await zoneNameInput.evaluate(e => e.value)
    };
};

export const setDNSName = async (page, name) => {
    const network = await networkWidget(page);
    const zoneNameInput = await network.locator("input[name='dns-name']");
    await zoneNameInput.fill(name);
};

export const setAPIHost = async (page, host) => {
    const network = await networkWidget(page);
    const hostInput = await network.locator("input[name='api-host']");
    await hostInput.fill(host);
};
