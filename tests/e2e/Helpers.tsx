import {Page} from "puppeteer";

export class Helpers{

	page: Page;

	constructor(page: Page){
		this.page = page;
	}

	element(){
		this.page.evaluate(() => document.querySelector('.scrape').textContent);
	}

	node(name: string){
		this.page.evaluate(() => document.querySelector('.scrape').textContent);
	}

	nodePort(node: string, port: string){
	}

}