import 'jest';
import { E2ENode } from './helpers/E2EHelper';

describe('simple flow test', () => {
	beforeEach(async () => {
		await page.goto(`file://${__dirname}/../.out/iframe.html?path=/story/simple-usage--simple-flow-example`);
	});

	it('drag link to port adds a link', async () => {
		// create a new link
		let node1 = new E2ENode('18');
		let node2 = new E2ENode('10');

		let port1 = await node1.port('19');
		let port2 = await node2.port('11');

		let newlink = await port1.link(port2);
		await expect(await newlink.waitForElement()).toBeTruthy();
	});

	it('drag link to node does not add a link', async () => {
		// create a new link
		let node1 = new E2ENode('18');
		let node2 = new E2ENode('10');

		let port1 = await node1.port('19');

		let node2Bounds = await (await node2.waitForElement()).boundingBox();
		let newlink = await port1.linkToPoint(node2Bounds.x, node2Bounds.y);

		await expect(newlink).toBeFalsy();
	});
});
