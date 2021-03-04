export const serverWidget = async (page) => {
    return await page.$("css=#server-widget");
};

export const getConfig = async (page) => {
    const widget = await serverWidget(page);

    const portInput = await widget.$("input[name='server-port']");
    const port = await portInput.evaluate(e => e.value);

    const ipInput = await widget.$("input[name='ip-input']");
    const ip = await ipInput.evaluate(e => e.value);

    const nameInput = await widget.$("input[name='server-name']",);
    const name = await nameInput.evaluate(e => e.value);

    const hostnameInput = await widget.$("input[name='server-hostname']",);
    const hostname = await hostnameInput.evaluate(e => e.value);

    const subnetInput = await widget.$("input[name='server-subnet-v4']",);
    const subnet = await subnetInput.evaluate(e => e.value);

    return {
        ip: { v4: ip, v6: "" }, port: parseInt(port),
        name, hostname,
        subnet: { v4: subnet, v6: "1010:1010:1010:1010:" }
    };

};

const setIP = async (widget, ip) => {
    const input = await widget.$("input[name='ip-input']");
    await input.fill(ip);
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
    await addServer(page, server);
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