export const skipInitialConfig = async (page) => {
    // during development and testing the public and private key are set to 
    // VUE_APP_PUBLIC_KEY=1lLU3VhXsrSGMxESmqfY4m2oEVkpfEHyKlCQU6MMPsI=
    // VUE_APP_PRIVATE_KEY=5mulHuvASgsqAR282LC4nTKoALXpqJWfOTcpQseXRYg=
    // via Environment variables. Which will be used to pass the initial setup page here as well

    const simulatedPayloadFromCore = Buffer.from(JSON.stringify({
        keys: {
            private: "5mulHuvASgsqAR282LC4nTKoALXpqJWfOTcpQseXRYg=",
            public: "1lLU3VhXsrSGMxESmqfY4m2oEVkpfEHyKlCQU6MMPsI="
        }
    })).toString('base64');
    const button = await page.locator("css=.submit");
    const configInput = await page.locator("css=#input");

    await configInput.fill(simulatedPayloadFromCore);
    await button.click();
};
