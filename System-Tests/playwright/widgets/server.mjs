export const serverWidget = async (page) => {
    return await page.$("css=#server-widget");
};

const setIP = async (widget, ip) => {
    const one = await widget.$("input[name='1']");
    const two = await widget.$("input[name='2']");
    const three = await widget.$("input[name='3']");
    const four = await widget.$("input[name='4']");
    await one.type(ip[0].toString());
    await two.type(ip[1].toString());
    await three.type(ip[2].toString());
    await four.type(ip[3].toString());
};

const setPort = async (widget, port) => {
    const input = await widget.$("input[name='server-port']");
    await input.type(port.toString());
};
const setName = async (widget, name) => {
    const input = await widget.$("input[name='server-name']");
    await input.type(name);
};
const setHostname = async (widget, hostname) => {
    const input = await widget.$("input[name='server-hostname']");
    await input.type(hostname);
};
const setSubnet = async (widget, subnet) => {
    const input = await widget.$("input[name='server-subnet']");
    await input.type(subnet);
};

export const addServer = async (page, { ip, port, hostname, subnet, name }) => {
    if (ip) {
        const widget = await serverWidget(page);
        await setIP(widget, ip);
    }
    if (port) {
        const widget = await serverWidget(page);
        await setPort(widget, port);
    }
    if (hostname) {
        const widget = await serverWidget(page);
        await setHostname(widget, hostname);
    }
    if (name) {
        const widget = await serverWidget(page);
        await setName(widget, name);
    }
    if (subnet) {
        const widget = await serverWidget(page);
        await setSubnet(widget, subnet);
    }
};