export const serverWidget = async (page) => {
    return await page.$("css=#server-widget");
}

export const setIP = async (page, ip) => {
    const widget = await serverWidget(page);
    const one = await widget.$("input[name='1']")
    const two = await widget.$("input[name='2']")
    const three = await widget.$("input[name='3']")
    const four = await widget.$("input[name='4']")
    await one.type(ip[0].toString());
    await two.type(ip[1].toString());
    await three.type(ip[2].toString());
    await four.type(ip[3].toString());
}

export const setPort = async (page, port) => {
    const widget = await serverWidget(page);
    const input = await widget.$("input[name='server-port']")
    await input.type(port.toString());
}