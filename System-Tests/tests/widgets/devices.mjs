export const deviceWidget = async (page) => {
  return await page.$("css=#device-widget");
};

export const getConfig = async (device) => {
  const v4Input = await device.$("input[name='device-ipv4']");
  const v4 = await v4Input.evaluate((e) => e.value);

  const v6Input = await device.$("input[name='device-ipv6']");
  const v6 = await v6Input.evaluate((e) => e.value);

  const additionalDNSServersInput = await device.$(
    "input[name='additionalDNSServers']"
  );
  const additionalDNSServers = await additionalDNSServersInput.evaluate(
    (e) => e.value
  );
  const nameInput = await device.$("input[name='device-name']");
  const name = await nameInput.evaluate((e) => e.value);

  const mtuInput = await device.$("input[name='MTU']");
  const MTU = await mtuInput.evaluate((e) => e.value);

  const typeSelect = await device.$(".device-type");
  const type = await typeSelect.evaluate((e) => e.value);

  return {
    type,
    name,
    MTU: parseInt(MTU) || undefined,
    additionalDNSServers: additionalDNSServers
      ? additionalDNSServers.split(",")
      : [],
    ip: { v4: parseInt(v4), v6 },
  };
};

export const setIPv4 = async (device, ip) => {
  const input = await device.$("input[name='device-ipv4']");
  await input.fill(ip.toString());
};

export const setIPv6 = async (device, ip) => {
  const input = await device.$("input[name='device-ipv6']");
  await input.fill(ip.toString());
};

const setName = async (device, name) => {
  const input = await device.$("input[name='device-name']");
  await input.fill(name);
};

const setAdditionalDNSServers = async (device, servers) => {
  const input = await device.$("input[name='additionalDNSServers']");
  await input.fill(servers);
};

const setMTU = async (device, MTU) => {
  const input = await device.$("input[name='MTU']");
  await input.fill(MTU.toString());
};

const setType = async (device, type) => {
  const select = await device.$(".device-type");
  await select.scrollIntoViewIfNeeded();
  await select.selectOption(type);
};

const getDeviceByName = async (page, name) => {
  const widget = await deviceWidget(page);
  return await widget.$(`.device[data-name=${name}]`);
};

export const addNewDevice = async (
  page,
  { ip: { v4, v6 }, name, type, additionalDNSServers, MTU }
) => {
  const widget = await deviceWidget(page);
  const addDeviceButton = await widget.$("#add-device");
  await addDeviceButton.click();
  let device = await widget.$(".device:last-child");
  await expandDevice(device);

  // Vue might rerender and remove the old handle from the DOM
  // Because of this the device is refetched before every change
  if (v4) {
    let device = await widget.$(".device:last-child");
    await setIPv4(device, v4);
  }
  if (v6) {
    let device = await widget.$(".device:last-child");
    await setIPv6(device, v6);
  }
  if (name) {
    let device = await widget.$(".device:last-child");
    await setName(device, name);
  }
  if (additionalDNSServers) {
    let device = await widget.$(".device:last-child");
    await setAdditionalDNSServers(device, additionalDNSServers);
  }
  if (MTU) {
    let device = await widget.$(".device:last-child");
    await setMTU(device, MTU);
  }
  if (type) {
    let device = await widget.$(".device:last-child");
    await setType(device, type);
  }
};

export const updateDevice = async (
  page,
  oldName,
  { ip: { v4, v6 }, name, type, additionalDNSServers, MTU }
) => {
  let device = await getDeviceByName(page, oldName);
  await expandDevice(device);
  // Vue might rerender and remove the old handle from the DOM
  // Because of this the device is refetched before every change
  if (v4) {
    let device = await getDeviceByName(page, oldName);
    await setIPv4(device, v4);
  }
  if (v6) {
    let device = await getDeviceByName(page, oldName);
    await setIPv6(device, v6);
  }
  if (name) {
    let device = await getDeviceByName(page, oldName);
    await setName(device, name);
  }
  if (type) {
    let device = await getDeviceByName(page, oldName);
    await setType(device, type);
  }
  if (additionalDNSServers) {
    let device = await getDeviceByName(page, oldName);
    await setAdditionalDNSServers(device, additionalDNSServers);
  }
  if (MTU) {
    let device = await getDeviceByName(page, oldName);
    await setMTU(device, MTU);
  }
};

export const downloadConfig = async (page, name) => {
  let device = await getDeviceByName(page, name);
  const downloadPath = new Promise((res) => {
    page.on("download", (dl) => {
      dl.path().then(res);
    });
  });
  const downloadButton = await device.$("button.download");
  await downloadButton.click();
  return downloadPath;
};

export const deleteDevice = async (page, name) => {
  let device = await getDeviceByName(page, name);
  const deleteButton = await device.$("button.delete");
  await deleteButton.click();
};

export const expandDevice = async (device) => {
  const button = await device.$("button.show-more");
  await button.click();
};

export const hideDevice = async (device) => {
  const button = await device.$("button.show-less");
  await button.click();
};
