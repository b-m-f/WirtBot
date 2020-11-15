import assert from "assert";

export const dnsWidget = async (page) => {
    return await page.$("css=#dns-widget");
};

export const setDNSTlsName = async (page, name) => {
    const dns = await dnsWidget(page);
    const dnsTLSNameInput = await dns.$("input[name='tlsname']");
    await dnsTLSNameInput.fill(name);
};

export const enableDNSTLS = async (page) => {
    const dns = await dnsWidget(page);
    const checkbox = await dns.$("input[name='tls']");
    await checkbox.check();
};


export const disableDNSTLS = async (page) => {
    const dns = await dnsWidget(page);
    const checkbox = await dns.$("input[name='tls']");
    await checkbox.uncheck();
};


export const setDNSIP = async (page, name) => {
    const dns = await dnsWidget(page);
    const dnsNameInput = await dns.$("input[name='dns-name']");
    await dnsNameInput.fill(name);
};
