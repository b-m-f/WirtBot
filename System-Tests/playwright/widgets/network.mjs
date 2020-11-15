import assert from 'assert';

export const networkWidget = async (page) => {
    return await page.$("css=#network-widget");
}

export const setDNSName = async (page, name) => {
    const network = await networkWidget(page);
    const dnsNameInput = await network.$("input[name='dns-name']")
    await dnsNameInput.fill(name);
}
