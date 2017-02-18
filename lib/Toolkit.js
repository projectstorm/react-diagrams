/**
 * @author Dylan Vorster
 */
/**
 * @author Dylan Vorster
 */ export class Toolkit {
    /**
   * Generats a unique ID (thanks Stack overflow :3)
   * @returns {String}
   */
    static UID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
