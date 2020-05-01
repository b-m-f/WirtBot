const { setServer } = require("./helpers/dataFillers");

module.exports = {
  "Test cant add device without server": async function(browser) {
    await browser.url("http://localhost:8080/dashboard");
    await browser.waitForElementVisible("body");

    await browser.setValue("input[name='device-name']", "test1");
    await browser.setValue("input[name='device-ip']", "3");
    await browser.setValue("select.device-type", "Android");
    await browser.setValue("input[name='internet-gateway']", "false");

    await browser.click("button#add-device");

    await browser.assert.visible("#alerts .warning");

    browser.expect.elements(".device").count.to.equal(0);
  },
  "Test dashboard server button only appears when data is input": async function(
    browser
  ) {
    await browser.assert.not.elementPresent("#download-server-config");

    await setServer(browser);

    await browser.url("http://localhost:8080/dashboard");
    await browser.assert.visible("#download-server-config");
  },
  "Test android devices have a QR code": async function(browser) {
    await browser.setValue("input[name='device-name']", "test1");
    await browser.setValue("input[name='device-ip']", "2");
    await browser.setValue("select.device-type", "Android");
    await browser.setValue("input[name='internet-gateway']", "false");

    await browser.click("button#add-device");

    browser.expect.elements("img.qr-code").count.to.equal(1);
  },

  "Test iOS devices have a QR code": async function(browser) {
    await setServer(browser);
    await browser.url("http://localhost:8080/dasboard");
    await browser.waitForElementVisible("body");

    await browser.setValue("input[name='device-name']", "test2");
    await browser.clearValue("input[name='device-ip']");
    await browser.setValue("input[name='device-ip']", "4");
    await browser.setValue("select.device-type", "iOS");
    await browser.setValue("input[name='internet-gateway']", "false");

    await browser.click("button#add-device");

    browser.expect.elements("img.qr-code").count.to.equal(2);
  },
  "Test that ip is set to next big available ip": async function(browser) {
    await browser.assert.value("input[name='device-ip']", "3");
  },
  "Test that two devices can not have the same ip": async function(browser) {
    browser.expect.elements("form .device").count.to.equal(2);

    await browser.setValue("input[name='device-name']", "test3");
    await browser.clearValue("input[name='device-ip']");
    await browser.setValue("input[name='device-ip']", "4");
    await browser.setValue("select.device-type", "Android");
    await browser.setValue("input[name='internet-gateway']", "true");

    await browser.click("button#add-device");

    await browser.assert.visible("#alerts .warning");
    browser.expect.elements("form .device").count.to.equal(2);
  },
};
