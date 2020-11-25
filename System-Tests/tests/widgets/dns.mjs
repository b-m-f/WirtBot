import assert from "assert";

export const dnsWidget = async (page) => {
    return await page.$("css=#dns-widget");
};

export const getValidity = async (page) => {
    const validName = await page.$eval("#dns-widget input[name='tlsname']", e => e.validity.valid);
    return {
        name: validName
    };
};

export const getConfig = async (page) => {
    const dns = await dnsWidget(page);
    const dnsTLSNameInput = await dns.$("input[name='tlsname']");
    const dnsTLSCheckbox = await dns.$("input[name='tls']");
    const dnsIP1 = await dns.$("input[name='1']");
    const dnsIP2 = await dns.$("input[name='2']");
    const dnsIP3 = await dns.$("input[name='3']");
    const dnsIP4 = await dns.$("input[name='4']");

    const tlsEnabled = await dnsTLSCheckbox.evaluate(e => e.checked);

    return {
        tlsName: await dnsTLSNameInput.evaluate(e => e.value),
        tls: tlsEnabled,
        ip: {
            v4: [
                await dnsIP1.evaluate(e => parseInt(e.value)),
                await dnsIP2.evaluate(e => parseInt(e.value)),
                await dnsIP3.evaluate(e => parseInt(e.value)),
                await dnsIP4.evaluate(e => parseInt(e.value))
            ]
        }
    };
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

export const setDNSIP = async (page, ip) => {
    const dns = await dnsWidget(page);
    const one = await dns.$("input[name='1']");
    const two = await dns.$("input[name='2']");
    const three = await dns.$("input[name='3']");
    const four = await dns.$("input[name='4']");
    await one.fill(ip[0].toString());
    await two.fill(ip[1].toString());
    await three.fill(ip[2].toString());
    await four.fill(ip[3].toString());
};
