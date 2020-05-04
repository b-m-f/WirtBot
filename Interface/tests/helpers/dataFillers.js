async function setServer(browser) {
  await browser.url("http://localhost:8080/dashboard");
  await browser.waitForElementVisible({
    selector: "body",
    message: "Setting Server data",
  });

  await browser.click("#server-widget #edit");
  await browser.setValue("#server-widget input[name='1']", "192");
  await browser.execute(function() {
    var element = document.querySelector("#server-widget input[name='1']");
    var event = new Event("change");
    element.dispatchEvent(event);
  });
  await browser.setValue("#server-widget input[name='2']", "168");
  await browser.execute(function() {
    var element = document.querySelector("#server-widget input[name='2']");
    var event = new Event("change");
    element.dispatchEvent(event);
  });
  await browser.setValue("#server-widget input[name='3']", "0");
  await browser.execute(function() {
    var element = document.querySelector("#server-widget input[name='3']");
    var event = new Event("change");
    element.dispatchEvent(event);
  });
  await browser.setValue("#server-widget input[name='4']", "2");
  await browser.execute(function() {
    var element = document.querySelector("#server-widget input[name='4']");
    var event = new Event("change");
    element.dispatchEvent(event);
  });

  await browser.setValue("#server-widget input[name='port']", "1233");
  await browser.execute(function() {
    var element = document.querySelector("#server-widget input[name='port']");
    var event = new Event("change");
    element.dispatchEvent(event);
  });

  await browser.click("#server-widget #edit");
  await browser.pause(300);
}

module.exports = {
  setServer,
};
