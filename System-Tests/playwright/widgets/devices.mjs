export const deviceWidget = async (page) => {
    return await page.$("css=#device-widget");
}

export const setIP = async (device, ip) => {
    const input = await device.$("input[name='device-ipv4']")
    console.log(input)
    await input.type(ip.toString())
}

export const setName = async (device, name) => {
    const input = await device.$("input[name='device-name']")
    console.log(input)
    await input.fill(name)
}

export const setType = async (device, type) => {
    const select = await device.$(".device-type")
    await select.selectOption(type)
}

export const getDeviceByName = async (page, name) => {
    const widget = await deviceWidget(page);
    return await widget.$(`data-name=${name}`);
}

export const addNewDevice = async (page, { ip, name, type }) => {
    const widget = await deviceWidget(page);
    const addDeviceButton = await widget.$('#add-device');
    await addDeviceButton.click();
    const device = await widget.$('.device:last-child')
    await setIP(device, ip);
    await setName(device, name);
    await setType(device, type);
}

