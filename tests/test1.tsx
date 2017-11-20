import "jest";
import * as puppeteer from "puppeteer"

var browser;
let index = 0;

async function itShould(directive, test: (page: puppeteer.Page) => any){
	it(directive, async () => {
		let page = await browser.newPage();
		await page.goto('file://' + __dirname + '/../.out/index.html');
		await test(page);
		await page.close();
	});
}

beforeAll(async () => {
	browser = await puppeteer.launch({
		headless: false
	});
});

afterAll(() => {
	browser.close();
});


describe("simple test", async () => {

	itShould('should drag a new link', async (page) => {
		await page.mouse.move(410, 152);
		await page.mouse.down();
		await page.mouse.move(610, 352);
		await page.mouse.up();
	});

	itShould('should drag a node', async (page) => {
		await page.mouse.move(390, 145);
		await page.mouse.down();
		await page.mouse.move(300, 300);
		await page.mouse.up();
	});
})