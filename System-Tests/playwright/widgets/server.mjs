export const serverWidget = async (page) => {
    return await page.$("css=#server-widget");
};

export const getConfig = async (page) => {
    const widget = await serverWidget(page);

    const portInput = await widget.$("input[name='server-port']");
    const port = await portInput.evaluate(e => e.value);

    const ip1Input = await widget.$("input[name='1']");
    const ip1 = await ip1Input.evaluate(e => e.value);

    const ip2Input = await widget.$("input[name='2']");
    const ip2 = await ip2Input.evaluate(e => e.value);

    const ip3Input = await widget.$("input[name='3']");
    const ip3 = await ip3Input.evaluate(e => e.value);

    const ip4Input = await widget.$("input[name='4']");
    const ip4 = await ip4Input.evaluate(e => e.value);

    const nameInput = await widget.$("input[name='server-name']",);
    const name = await nameInput.evaluate(e => e.value);

    const hostnameInput = await widget.$("input[name='server-hostname']",);
    const hostname = await hostnameInput.evaluate(e => e.value);

    const subnetInput = await widget.$("input[name='server-subnet-v4']",);
    const subnet = await subnetInput.evaluate(e => e.value);

    return { ip: [ip1, ip2, ip3, ip4], port, name, hostname, subnet };

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
    await input.fill(name);
};
const setHostname = async (widget, hostname) => {
    const input = await widget.$("input[name='server-hostname']");
    await input.fill(hostname);
};
const setSubnet = async (widget, subnet) => {
    const input = await widget.$("input[name='server-subnet-v4']");
    await input.fill(subnet);
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
export const updateServer = async (page, server) => {
    addServer(page, server);
};

export const downloadConfig = async (page) => {
    const widget = await serverWidget(page);
    const downloadPath = new Promise((res) => {
        page.on("download", dl => {
            dl.path().then(res);
        });
    });
    const downloadButton = await widget.$("#download");
    await downloadButton.click();
    return downloadPath;

};