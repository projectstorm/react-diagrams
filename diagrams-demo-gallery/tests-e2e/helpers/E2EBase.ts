import { ElementHandle, FrameBase } from 'puppeteer';

export abstract class E2EBase {
	name: string;

	constructor(name: string) {
		this.name = name;
	}

	async getSelector(): Promise<FrameBase> {
		return page as FrameBase;
	}

	async getElement(): Promise<ElementHandle> {
		if (!(await this.getSelector())) {
			return null;
		}
		return (await this.getSelector()).$(this.selector());
	}

	async waitForElement(): Promise<ElementHandle | null> {
		return (await this.getSelector()).waitForSelector(this.selector(), {
			timeout: 1000
		});
	}

	protected abstract selector(): string;
}
