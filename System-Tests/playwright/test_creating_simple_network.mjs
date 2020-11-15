import { chromium } from 'playwright';

import assert from 'assert';

import { setDNSName } from './widgets/network.mjs'
import { setIP, setPort } from './widgets/server.mjs'
import { addNewDevice } from './widgets/devices.mjs'


export default async () => {
	const browser = await chromium.launch({ headless: false, slowMo: 50 });
	// Create pages, interact with UI elements, assert values
	const page = await browser.newPage();
	await page.goto('http://localhost:8080/');

	await setDNSName(page, 'test');
	await setIP(page, [1, 2, 3, 4]);
	await setPort(page, 1234);

	await addNewDevice(page, { ip: 2, name: 'test-1', type: 'Android' })

	await page.waitForTimeout(2000)


	await browser.close();
}
