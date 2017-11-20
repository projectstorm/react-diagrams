import "jest";
import * as puppeteer from "puppeteer"

it('should load the diagram with no issues', async () => {
	let browser = await puppeteer.launch({
		headless: true
	});
	let page = await browser.newPage();
	await page.goto('file://'+__dirname+'/../.out/index.html');
	await browser.close();
});