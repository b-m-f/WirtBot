export const dnsWidget = async (page) => {
  return await page.$("css=#dns-widget");
};

export const getValidity = async (page) => {
  const validName = await page.$eval(
    "#dns-widget input[name='tlsname']",
    (e) => e.validity.valid
  );
  return {
    name: validName,
  };
};

export const getConfig = async (page) => {
  const dns = await dnsWidget(page);
  const dnsTLSNameInput = await dns.$("input[name='tlsname']");
  const dnsTLSCheckbox = await dns.$("input[name='tls']");
  const dnsIP = await dns.$("input[name='ip-input']");
  const dnsIgnoredZones = await dns.$("textarea[name='ignoredZones']");
  const adblock = await dns.$("input[name='adblock']");
  const blockLists = await dns.$("textarea[name='blockLists']");
  const blockHosts = await dns.$("textarea[name='blockHosts']");

  const tlsEnabled = await dnsTLSCheckbox.evaluate((e) => e.checked);

  return {
    tlsName: await dnsTLSNameInput.evaluate((e) => e.value),
    tls: tlsEnabled,
    ip: {
      v4: await dnsIP.evaluate((e) => e.value),
    },
    ignoredZones: await dnsIgnoredZones.evaluate((e) => e.value),
    adblock: await adblock.evaluate((e) => e.checked),
    blockLists: await blockLists.evaluate((e) => e.value),
    blockHosts: await blockHosts.evaluate((e) => e.value),
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

export const enableAdblock = async (page) => {
  const dns = await dnsWidget(page);
  const checkbox = await dns.$("input[name='adblock']");
  await checkbox.check();
};

export const disableAdblock = async (page) => {
  const dns = await dnsWidget(page);
  const checkbox = await dns.$("input[name='adblock']");
  await checkbox.uncheck();
};

export const setDNSIP = async (page, ip) => {
  const dns = await dnsWidget(page);
  const input = await dns.$("input[name='ip-input']");
  await input.fill(ip);
};

export const setIgnoredZones = async (page, zones) => {
  const dns = await dnsWidget(page);
  const input = await dns.$("textarea[name='ignoredZones']");
  await input.fill(zones);
};

export const setBlockLists = async (page, lists) => {
  const dns = await dnsWidget(page);
  const input = await dns.$("textarea[name='blockLists']");
  await input.fill(lists);
};

export const setBlockHosts = async (page, hosts) => {
  const dns = await dnsWidget(page);
  const input = await dns.$("textarea[name='blockHosts']");
  await input.fill(hosts);
};
