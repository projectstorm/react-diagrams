import {Page} from "puppeteer";

export class E2EHelper {

	page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async node(name): Promise<HTMLElement> {
		return await this.page.evaluate(() => {
			return document.querySelector('div[data-nodeid="' + name + '"]');
		});
	}

}