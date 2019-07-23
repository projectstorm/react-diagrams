import "jest";
import {E2EHelper} from "./E2EHelper";

describe("simple flow test", () => {

	beforeEach(async () => {
		await page.goto(`file://${__dirname}/../../dist/e2e/demo-simple-flow/index.html`);
	});

	it("drag link to port adds a link", async () => {
		// create a new link
		let helper = new E2EHelper(page);
		let node1 = await helper.node("17");
		let node2 = await helper.node("9");

		let port1 = await node1.port("18");
		let port2 = await node2.port("10");

		let newlink = await port1.link(port2);
		await expect(await newlink.exists()).toBeTruthy();
	});

	it("drag link to node does not add a link", async () => {
		// create a new link
		let helper = new E2EHelper(page);
		let node1 = await helper.node("17");
		let node2 = await helper.node("9");

		let port1 = await node1.port("18");

		let node2Bounds = await node2.element.boundingBox();
		let newlink = await port1.linkToPoint(node2Bounds.x, node2Bounds.y);

		await expect(newlink).toBeNull();
	});
});
