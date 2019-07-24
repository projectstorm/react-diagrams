import 'jest';
import {E2ELink, E2ENode} from "./helpers/E2EHelper";

describe('simple test', () => {
	beforeAll(async () => {
		await page.goto(`file://${__dirname}/../.out/iframe.html?path=/story/simple-usage--simple-example`);
	});

	it('should delete a link and create a new one', async () => {
		// get the existing link
		let link = new E2ELink('13');
		await expect(await link.waitForElement()).toBeTruthy();

		// remove it
		await link.select();
		await page.keyboard.press('Delete');

		await expect(await link.getElement()).toBeFalsy();

		// create a new link
		let node1 = new E2ENode('7');
		let node2 = new E2ENode('10');

		let port1 = await node1.port('8');
		let port2 = await node2.port('11');

		let newlink = await port1.link(port2);
		await expect(await newlink.waitForElement()).toBeTruthy();
	});
});
