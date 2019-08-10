import * as _ from 'lodash';
import { FrameBase } from 'puppeteer';
import { E2EBase } from './E2EBase';
import { E2ENode } from './E2ENode';
import { E2ELink } from './E2ELink';

export class E2EPort extends E2EBase {
	parent: E2ENode;

	constructor(name: string, parent: E2ENode) {
		super(name);
		this.parent = parent;
	}

	async getLinks(): Promise<E2ELink[]> {
		const attribute = await page.evaluate(id => {
			return document.querySelector(id).getAttribute('data-links');
		}, this.selector());
		if (attribute.trim() === '') {
			return [];
		}

		return _.map(attribute.split(','), id => {
			const e = new E2ELink(id);
			e.isID = true;
			return e;
		});
	}

	async link(port: E2EPort): Promise<E2ELink> {
		let currentLinks = _.map(await this.getLinks(), 'name');

		let bounds = await (await this.getElement()).boundingBox();

		// click on this port
		page.mouse.move(bounds.x, bounds.y);
		page.mouse.down();
		//
		let bounds2 = await (await port.getElement()).boundingBox();

		// drag to other port
		page.mouse.move(bounds2.x, bounds2.y);
		page.mouse.up();

		let newLinks = _.map(await this.getLinks(), 'name');

		const s = new E2ELink(_.difference(newLinks, currentLinks)[0]);
		s.isID = true;
		return s;
	}

	async linkToPoint(x: number, y: number): Promise<E2ELink> {
		let currentLinks = _.map(await this.getLinks(), 'id');

		let bounds = await (await this.getElement()).boundingBox();

		// click on this port
		page.mouse.move(bounds.x, bounds.y);
		page.mouse.down();

		// drag to point
		page.mouse.move(x, y);
		page.mouse.up();

		let newLinks = _.map(await this.getLinks(), 'id');

		const link = _.difference(newLinks, currentLinks)[0];
		if (!link) {
			return null;
		}

		// get the parent to get the link
		return new E2ELink(link);
	}

	async getSelector(): Promise<FrameBase> {
		return (await this.parent.getElement()) as any;
	}

	protected selector(): string {
		return `${this.parent.selector()} .port[data-name="${this.name}"]`;
	}
}
