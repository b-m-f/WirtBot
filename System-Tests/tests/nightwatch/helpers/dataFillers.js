// This file fills the server with data.
// The network name ensures that the test-runner can reach the WirtBot api

async function setServer(browser) {
  await browser.url(`http://${process.env.TEST_URL}/`);
  await browser.waitForElementVisible({
    selector: "body",
    message: "Setting Server data",
  });

  await browser.clearValue("#network-widget input[name='dns-name']");
  await browser.setValue("#network-widget input[name='dns-name']", "test");

  await browser.execute(function () {
    var element = document.querySelector("#network-widget input[name='dns-name']");
    var event = new Event("change");
    element.dispatchEvent(event);
  });


  await browser.setValue("#server-widget input[name='1']", "1");
  await browser.setValue("#server-widget input[name='2']", "2");
  await browser.setValue("#server-widget input[name='3']", "3");
  await browser.setValue("#server-widget input[name='4']", "4");
  await browser.execute(function () {
    var element = document.querySelector("#server-widget input[name='1']");
    var event = new Event("change");
    element.dispatchEvent(event);
    var element = document.querySelector("#server-widget input[name='2']");
    var event = new Event("change");
    element.dispatchEvent(event);
    var element = document.querySelector("#server-widget input[name='3");
    var event = new Event("change");
    element.dispatchEvent(event);
    var element = document.querySelector("#server-widget input[name='4']");
    var event = new Event("change");
    element.dispatchEvent(event);
  });

  await browser.setValue("#server-widget input[name='server-port']", "1233");
  await browser.execute(function () {
    var element = document.querySelector("#server-widget input[name='server-port']");
    var event = new Event("change");
    element.dispatchEvent(event);
  });

  await browser.pause(300);
}

module.exports = {
  setServer,
};
