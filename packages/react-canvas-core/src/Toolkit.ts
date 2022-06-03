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
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
			const r = (Math.random() * 16) | 0;
			const v = c === 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	public static closest(element: Element, selector: string) {
		if (!Element.prototype.closest) {
			Element.prototype.closest = function (s) {
				var el = this;

				do {
					if (Element.prototype.matches.call(el, s)) return el;
					el = el.parentElement || el.parentNode;
				} while (el !== null && el.nodeType === 1);
				return null;
			};
		}
		return element.closest(selector);
	}
}
