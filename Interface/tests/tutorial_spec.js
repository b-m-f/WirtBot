module.exports = {
  "Test links to server": async function(browser) {
    await browser.url("http://localhost:8080/tutorial");
    await browser.waitForElementVisible("body");
    await browser.click("#start > button");

    await browser.assert.urlEquals("http://localhost:8080/tutorial/server/");
  },
  "Test show info on setup": async function(browser) {
    await browser.click("#no > button");
    await browser.assert.urlEquals("http://localhost:8080/tutorial/no-server/");
  },
  "Test link to IP input": async function(browser) {
    await browser.url("http://localhost:8080/tutorial/server/");
    await browser.click("#yes > button");
    await browser.assert.urlEquals("http://localhost:8080/tutorial/server/ip");
    await browser.assert.visible("input[name='1']");
    await browser.assert.visible("input[name='2']");
    await browser.assert.visible("input[name='3']");
    await browser.assert.visible("input[name='4']");
  },
  "Test have to input correct ip values to get to port": async function(
    browser
  ) {
    await browser.assert.urlEquals("http://localhost:8080/tutorial/server/ip");

    await browser.setValue("input[name='1']", "0");
    await browser.execute(function() {
      var element = document.querySelector("input[name='1']");
      var event = new Event("change");
      element.dispatchEvent(event);
    });

    await browser.setValue("input[name='2']", "0");
    await browser.execute(function() {
      var element = document.querySelector("input[name='2']");
      var event = new Event("change");
      element.dispatchEvent(event);
    });

    await browser.setValue("input[name='3']", "0");
    await browser.execute(function() {
      var element = document.querySelector("input[name='3']");
      var event = new Event("change");
      element.dispatchEvent(event);
    });

    await browser.setValue("input[name='4']", "0");
    await browser.execute(function() {
      var element = document.querySelector("input[name='4']");
      var event = new Event("change");
      element.dispatchEvent(event);
    });

    await browser.assert.urlEquals("http://localhost:8080/tutorial/server/ip");

    await browser.clearValue("input[name='1']");
    await browser.setValue("input[name='1']", "1");
    await browser.execute(function() {
      var element = document.querySelector("input[name='1']");
      var event = new Event("change");
      element.dispatchEvent(event);
    });
    await browser.assert.urlEquals("http://localhost:8080/tutorial/server/ip");

    await browser.clearValue("input[name='4']");
    await browser.setValue("input[name='4']", "1");
    await browser.execute(function() {
      var element = document.querySelector("input[name='4']");
      var event = new Event("change");
      element.dispatchEvent(event);
    });
    await browser.assert.urlEquals(
      "http://localhost:8080/tutorial/server/port"
    );
  },
  "Test have to input correct port values to get to devices": async function(
    browser
  ) {
    await browser.assert.urlEquals(
      "http://localhost:8080/tutorial/server/port"
    );

    await browser.setValue("input[name='port']", "1");
    await browser.execute(function() {
      var element = document.querySelector("input[name='port']");
      var event = new Event("change");
      element.dispatchEvent(event);
    });

    await browser.clearValue("input[name='port']");
    await browser.setValue("input[name='port']", "101212121");
    await browser.execute(function() {
      var element = document.querySelector("input[name='port']");
      var event = new Event("change");
      element.dispatchEvent(event);
    });

    await browser.clearValue("input[name='port']");
    await browser.setValue("input[name='port']", "2323");
    await browser.execute(function() {
      var element = document.querySelector("input[name='port']");
      var event = new Event("change");
      element.dispatchEvent(event);
    });

    await browser.assert.urlEquals(
      "http://localhost:8080/tutorial/devices/add"
    );
  },
  "Test that device setup can be skipped": async function(browser) {
    await browser.click("a#skip");

    await browser.assert.urlEquals("http://localhost:8080/tutorial/done");
  },
  "Test that IP must be at least 2": async function(browser) {
    await browser.url("http://localhost:8080/tutorial/devices/add");
    await browser.setValue("input[name='device-ipv4']", "1");
    await browser.execute(function() {
      var element = document.querySelector("input[name='device-ipv4']");
      var event = new Event("change");
      element.dispatchEvent(event);
    });

    await browser.executeAsync(
      function(done) {
        var element = document.querySelector("input[name='device-ipv4']");
        var valid = element.checkValidity();
        done(valid);
      },
      [],
      async ({ value }) => {
        await browser.assert.equal(value, false);
      }
    );

    await browser.clearValue("input[name='device-ipv4']");
    await browser.setValue("input[name='device-ipv4']", "2");
    await browser.execute(function() {
      var element = document.querySelector("input[name='device-ipv4']");
      var event = new Event("change");
      element.dispatchEvent(event);
    });
    await browser.executeAsync(
      function(done) {
        var element = document.querySelector("input[name='device-ipv4']");
        var valid = element.validity.valid;
        done(valid);
      },
      [],
      async ({ value }) => {
        await browser.assert.equal(value, true);
      }
    );
  },
  "Test that you can not continue without specifying all data for a device": async function(
    browser
  ) {
    await browser.click("button#save");
    await browser.assert.not.urlEquals(
      "http://localhost:8080/tutorial/devices/success"
    );
    await browser.assert.urlEquals(
      "http://localhost:8080/tutorial/devices/add"
    );
  },
  "Test that name needs to specified": async function(browser) {
    await browser.setValue("input[name='device-name']", "");
    await browser.execute(function() {
      var element = document.querySelector("input[name='device-name']");
      var event = new Event("change");
      element.dispatchEvent(event);
    });

    await browser.executeAsync(
      function(done) {
        var element = document.querySelector("input[name='device-name']");
        var valid = element.validity.valid;
        done(valid);
      },
      [],
      async ({ value }) => {
        await browser.assert.equal(value, false);
      }
    );

    await browser.clearValue("input[name='device-name']");
    await browser.setValue("input[name='device-name']", "test");
    await browser.execute(function() {
      var element = document.querySelector("input[name='device-name']");
      var event = new Event("change");
      element.dispatchEvent(event);
    });
    await browser.executeAsync(
      function(done) {
        var element = document.querySelector("input[name='device-name']");
        var valid = element.validity.valid;
        done(valid);
      },
      [],
      async ({ value }) => {
        await browser.assert.equal(value, true);
      }
    );
  },
  "Test that type needs to specified to be redirected to next step": async function(
    browser
  ) {
    await browser.setValue("select#device-type", "Android");
    await browser.execute(function() {
      var element = document.querySelector("select#device-type");
      var event = new Event("change");
      element.dispatchEvent(event);
    });

    await browser.click("button#save ");
    await browser.assert.urlEquals(
      "http://localhost:8080/tutorial/devices/success"
    );
  },

  "Test that config can be downloaded": async function(browser) {},
  "Test that last step is reached": async function(browser) {
    await browser.click("#finish > button");
    await browser.assert.urlEquals("http://localhost:8080/tutorial/done");
  },

  //   "Test links to server": async function(browser) {},
};
