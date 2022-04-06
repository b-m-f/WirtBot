export const settingsWidget = async (page) => {
  return await page.locator("css=#settings-widget");
};

export const downloadBackup = async (page) => {
  const widget = await settingsWidget(page);
  const downloadPath = new Promise((res) => {
    page.on("download", (dl) => {
      dl.path().then(res);
    });
  });
  const downloadButton = await widget.locator("#export");
  await downloadButton.click();
  return downloadPath;
};

export const importBackup = async (page, backupPath) => {
  const widget = await settingsWidget(page);
  const input = await widget.locator("#import input");
  const importButton = await widget.locator("#import button");

  await input.setInputFiles(backupPath);
  await importButton.click();
  // give the state some time to finish building
  await page.waitForTimeout(1500);
};
