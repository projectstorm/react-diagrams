import closest = require("closest");
/**
 * @author Dylan Vorster
 */
export class Toolkit {

	static TESTING_MODE = false;
	static TESTING_MODE_ID = 1;

	/**
   * Generats a unique ID (thanks Stack overflow :3)
   * @returns {String}
   */
	public static UID(): string {
		if(Toolkit.TESTING_MODE){
			Toolkit.TESTING_MODE_ID ++;
			return "test-uid-"+Toolkit.TESTING_MODE_ID;
		}
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
			var r = (Math.random() * 16) | 0,
				v = c == "x" ? r : (r & 0x3) | 0x8;
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
}
