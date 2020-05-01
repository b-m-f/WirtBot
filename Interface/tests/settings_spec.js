module.exports = {
  "Test that server needs to be set before connecting it": async function(
    browser
  ) {
    await browser.url("http://localhost:8080/settings");
    await browser.assert.not.visible("input[name='connect-to-server']");
  },
  "Test that server can be connected if it is set": async function(browser) {
    await browser.url("http://localhost:8080/settings");
    await browser.assert.visible("input[name='connect-to-server']");
  }
};
