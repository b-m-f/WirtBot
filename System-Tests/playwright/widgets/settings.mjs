export const settingsWidget = async (page) => {
    return await page.$("css=#settings-widget");
};

export const downloadBackup = async (page) => {
    const widget = await settingsWidget(page);
    const downloadPath = new Promise((res) => {
        page.on("download", dl => {
            dl.path().then(res);
        });
    });
    const downloadButton = await widget.$("#export");
    await downloadButton.click();
    return downloadPath;
};

export const importBackup = async (page, backupPath) => {
    const widget = await settingsWidget(page);
    console.log(widget)
    const input = await widget.$("#import input");
    const importButton = await widget.$("#import button");

    await input.setInputFiles(backupPath);
    await importButton.click();


};