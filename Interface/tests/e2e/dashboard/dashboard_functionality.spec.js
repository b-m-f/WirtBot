const { setServer } = require("../helpers/dataFillers");

module.exports = {
  "Test cant add device without server": async function (browser) {
    await browser.url(`http://${process.env.TEST_URL}/dashboard`);
    await browser.waitForElementVisible(".app");

    await browser.click("#add-device button");
    await browser.setValue("input[name='device-name']", "test1");
    await browser.setValue("input[name='device-ipv4']", "4");
    await browser.setValue("select.device-type", "Linux");
    await browser.click("button.save");

    await browser.assert.visible("#alerts .warning");

    browser.expect.elements(".device").count.to.equal(0);
  },
  "Test dashboard server button only appears when data is input": async function (
    browser
  ) {
    await browser.assert.not.elementPresent("#server-widget #download");

    await setServer(browser);

    await browser.url(`http://${process.env.TEST_URL}/dashboard`);
    await browser.assert.visible("#server-widget #download");
  },
  "Test android devices have a QR code": async function (browser) {
    await browser.click("#add-device button");

    await browser.setValue("input[name='device-name']", "test1");
    await browser.setValue("input[name='device-ipv4']", "2");
    await browser.setValue("select.device-type", "Android");
    await browser.click("button.save");

    browser.expect.elements("img.qr-code").count.to.equal(1);
  },

  "Test iOS devices have a QR code": async function (browser) {
    await browser.url(`http://${process.env.TEST_URL}/dashboard`);
    await browser.waitForElementVisible("body");
    await browser.click("#add-device button");

    await browser.setValue("input[name='device-name']", "test2");
    await browser.clearValue("input[name='device-ipv4']");
    await browser.setValue("input[name='device-ipv4']", "4");
    await browser.setValue("select.device-type", "iOS");
    await browser.click("button.save");

    browser.expect.elements("img.qr-code").count.to.equal(2);
  },
  "Test that ip is set to next big available ip": async function (browser) {
    await browser.click("#add-device button");
    await browser.assert.attributeEquals(
      "input[name='device-ipv4']",
      "placeholder",
      "3"
    );
  },
  "Test that two devices can not have the same ip": async function (browser) {
    browser.expect
      .elements("#device-widget form .device-overview")
      .count.to.equal(2);

    await browser.click("#add-device button");
    await browser.setValue("input[name='device-name']", "test3");
    await browser.clearValue("input[name='device-ipv4']");
    await browser.setValue("input[name='device-ipv4']", "5");
    await browser.setValue("select.device-type", "Android");

    await browser.click("button.save");

    await browser.assert.visible("#alerts .warning");
    browser.expect
      .elements("#device-widget form .device-overview")
      .count.to.equal(3);
  },
};
