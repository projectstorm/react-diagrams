import "jest";
import {E2EHelper} from "./E2EHelper";

describe("simple test", () => {

	beforeAll(async () => {
		await page.goto(`file://${__dirname}/../../dist/e2e/demo-simple/index.html`)
	});

	it("should delete a link and create a new one", async () => {
		// get the existing link
		let helper = new E2EHelper(page);
		let link = await helper.link("12");
		await expect(await link.exists()).toBeTruthy();

		// remove it
		await link.select();
		await page.keyboard.press("Delete");

		await expect(await link.exists()).toBeFalsy();

		// create a new link
		let node1 = await helper.node("6");
		let node2 = await helper.node("9");

		let port1 = await node1.port("7");
		let port2 = await node2.port("10");

		let newlink = await port1.link(port2);
		await expect(await newlink.exists()).toBeTruthy();
	});
});
