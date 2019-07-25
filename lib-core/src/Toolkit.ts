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
			return '' + Toolkit.TESTING_UID;
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

	public static generateCurvePath(firstPoint: PointModel, lastPoint: PointModel, curvy: number = 0): string {
		var isHorizontal = Math.abs(firstPoint.getX() - lastPoint.getX()) > Math.abs(firstPoint.getY() - lastPoint.getY());

		var xOrY = isHorizontal ? 'x' : 'y';

		// make sure that smoothening works
		// without disrupting the line direction
		let curvyness = curvy;
		if (firstPoint[xOrY] > firstPoint[xOrY]) {
			curvyness = -curvy;
		}

		var curvyX = isHorizontal ? curvyness : 0;
		var curvyY = isHorizontal ? 0 : curvyness;

		return `M${firstPoint.getX()},${firstPoint.getY()} C ${firstPoint.getX() + curvyX},${firstPoint.getY() + curvyY}
    ${lastPoint.getX() - curvyX},${lastPoint.getY() - curvyY} ${lastPoint.getX()},${lastPoint.getY()}`;
	}
}
