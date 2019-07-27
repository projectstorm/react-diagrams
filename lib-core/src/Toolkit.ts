import closest = require('closest');
import { PointModel } from './models/PointModel';

export class Toolkit {
	static TESTING: boolean = false;
	static TESTING_UID = 0;

	/**
	 * Generats a unique ID (thanks Stack overflow :3)
	 * @returns {String}
	 */
	public static UID(): string {
		if (Toolkit.TESTING) {
			Toolkit.TESTING_UID++;
			return `${Toolkit.TESTING_UID}`;
		}
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
			const r = (Math.random() * 16) | 0;
			const v = c === 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	/**
	 * Finds the closest element as a polyfill
	 *
	 * @param  {Element} element  [description]
	 * @param  {string}  selector [description]
	 */
	public static closest(element: Element, selector: string) {
		if (document.body.closest) {
			return element.closest(selector);
		}
		return closest(element, selector);
	}

	public static generateLinePath(firstPoint: PointModel, lastPoint: PointModel): string {
		return `M${firstPoint.getX()},${firstPoint.getY()} L ${lastPoint.getX()},${lastPoint.getY()}`;
	}
}
