import {ElementHandle, FrameBase} from 'puppeteer';
import * as _ from 'lodash';

export abstract class E2EElement {
	id: string;

	constructor(id: string) {
		this.id = id;
	}

	async getSelector(): Promise<FrameBase> {
		return page;
	}

	async getElement(): Promise<ElementHandle | null>{
		if(!await this.getSelector()){
			return null;
		}
		return (await this.getSelector()).$(this.selector())
	};

	async waitForElement(): Promise<ElementHandle | null>{
		return (await this.getSelector()).waitForSelector(this.selector(), {
			timeout: 1000
		})
	};

	protected abstract selector(): string;
}

export class E2ENode extends E2EElement {

	async port(id: string): Promise<E2EPort> {
		return new E2EPort(id, this);
	}

	protected selector(): string {
		return `div[data-nodeid="${this.id}"]`;
	}
}

export class E2EPort extends E2EElement {
	parent: E2ENode;

	constructor(id: string, parent: E2ENode) {
		super(id);
		this.parent = parent;
	}

	async getLinks(): Promise<E2ELink[]> {
		const element = await this.getElement();
		const attribute = await page.evaluate( (obj) => {
			return obj.getAttribute('data-links');
		}, element);
		if(attribute.trim() === ""){
			return [];
		}
		return _.map(attribute.split(','), (id) => {
			return new E2ELink(id);
		});
	}

	async link(port: E2EPort): Promise<E2ELink> {
		let currentLinks = _.map(await this.getLinks(), 'id');

		let bounds = await (await this.getElement()).boundingBox();

		// click on this port
		page.mouse.move(bounds.x, bounds.y);
		page.mouse.down();
		//
		let bounds2 = await (await port.getElement()).boundingBox();

		// drag to other port
		page.mouse.move(bounds2.x, bounds2.y);
		page.mouse.up();

		let newLinks = _.map(await this.getLinks(), 'id');

		// get the parent to get the link
		return new E2ELink(_.difference(newLinks, currentLinks)[0]);
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
		return `div[data-name="${this.id}"]`;
	}
}

export class E2ELink extends E2EElement {

	async select(): Promise<any> {
		const point = await page.evaluate(id => {
			const path = document.querySelector(`path[data-linkid="${id}"]`) as SVGPathElement;
			const point = path.getPointAtLength(path.getTotalLength() / 2);
			return {
				x: point.x,
				y: point.y
			};
		}, this.id);
		await page.keyboard.down('Shift');
		await page.mouse.move(point.x, point.y);
		await page.mouse.down();
		await page.keyboard.up('Shift');
	}

	protected selector(): string {
		return `path[data-linkid="${this.id}"]`;
	}
}
