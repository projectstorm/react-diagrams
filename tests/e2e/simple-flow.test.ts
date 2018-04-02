import "jest";
import * as puppeteer from "puppeteer";
import { E2EHelper } from "./E2EHelper";

var browser;

async function itShould(demo: string, directive, test: (page: puppeteer.Page, helper: E2EHelper) => any) {
	it(directive, async () => {
		let page = await browser.newPage();
		await page.goto("file://" + __dirname + "/../../dist/e2e/" + demo + "/index.html");
		let helper = new E2EHelper(page);
		await test(page, helper);
		await page.close();
	});
}

beforeAll(async () => {
	if (process.env.CIRCLECI) {
		console.log("using CircleCI");

		browser = await puppeteer.launch({
			args: ["--no-sandbox", "--disable-setuid-sandbox"]
		});
	} else {
		browser = await puppeteer.launch({
			headless: false
		});
	}
});

afterAll(() => {
	browser.close();
});

describe("simple flow test", async () => {
	itShould("demo-simple-flow", "drag link to port adds a link", async (page, helper) => {
		// create a new link
		let node1 = await helper.node("6");
		let node2 = await helper.node("9");

		let port1 = await node1.port("7");
		let port2 = await node2.port("10");

		let newlink = await port1.link(port2);
		await expect(await newlink.exists()).toBeTruthy();
	});

	itShould("demo-simple-flow", "drag link to node does not add a link", async (page, helper) => {
		// create a new link
		let node1 = await helper.node("6");
		let node2 = await helper.node("9");

		let port1 = await node1.port("7");

		let node2Bounds = await node2.element.boundingBox();

		let newlink = await port1.linkToPoint(node2Bounds.x, node2Bounds.y);
		await expect(await newlink.exists()).toBeFalsy();
	});
});
