import { E2EBase } from './E2EBase';

export class E2ELink extends E2EBase {
	isID: boolean;

	async select(): Promise<any> {
		const point = await page.evaluate(id => {
			const path = document.querySelector(id) as SVGPathElement;
			const point = path.getPointAtLength(path.getTotalLength() / 2);
			return {
				x: point.x,
				y: point.y
			};
		}, this.selector());
		await page.keyboard.down('Shift');
		await page.mouse.move(point.x, point.y);
		await page.mouse.down();
		await page.keyboard.up('Shift');
	}

	protected selector(): string {
		if (this.isID) {
			return `[data-linkid="${this.name}"] path`;
		}
		return `[data-default-link-test="${this.name}"] path`;
	}
}
