export const deviceWidget = async (page) => {
    return await page.$("css=#device-widget");
}

const setIP = async (device, ip) => {
    const input = await device.$("input[name='device-ipv4']")
    await input.type(ip.toString())
}

const setName = async (device, name) => {
    const input = await device.$("input[name='device-name']")
    await input.fill(name)
}

const setType = async (device, type) => {
    const select = await device.$('.device-type')
    await select.scrollIntoViewIfNeeded()
    await select.selectOption(type)
}

const getDeviceByName = async (page, name) => {
    const widget = await deviceWidget(page);
    return await widget.$(`data-name=${name}`);
}

export const addNewDevice = async (page, { ip, name, type }) => {
    const widget = await deviceWidget(page);
    const addDeviceButton = await widget.$('#add-device');
    await addDeviceButton.click();
    let device = await widget.$('.device:last-child')
    // Vue might rerender and remove the old handle from the DOM
    // Because of this the device is refetched before every change
    await setIP(device, ip);
    device = await widget.$('.device:last-child')
    await setName(device, name);
    device = await widget.$('.device:last-child')
    await setType(device, type);
}

export const updateDevice = async (page, oldName, { ip, name, type }) => {
    // Vue might rerender and remove the old handle from the DOM
    // Because of this the device is refetched before every change
    if (ip) {
        let device = await getDeviceByName(page, oldName)
        await setIP(device, ip);
    }
    if (name) {
        let device = await getDeviceByName(page, oldName)
        await setName(device, name);
    }
    if (type) {
        let device = await getDeviceByName(page, oldName)
        await setType(device, type);
    }
}