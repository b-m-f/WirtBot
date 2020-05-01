async function setServer(browser) {
  await browser.url("http://localhost:8080/quick");
  await browser.waitForElementVisible({
    selector: "body",
    message: "Setting Server data"
  });
  await browser.setValue("input[name='server-ip-1']", "192");
  await browser.setValue("input[name='server-ip-2']", "168");
  await browser.setValue("input[name='server-ip-3']", "0");
  await browser.setValue("input[name='server-ip-4']", "2");

  await browser.setValue("input[name='server-port']", "1233");
  await browser.pause(300);
}

module.exports = {
  setServer
};
