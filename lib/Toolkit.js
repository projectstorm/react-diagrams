"use strict";
/**
 * @author Dylan Vorster
 */
var Toolkit = (function () {
    function Toolkit() {
    }
    /**
   * Generats a unique ID (thanks Stack overflow :3)
   * @returns {String}
   */
    Toolkit.UID = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    return Toolkit;
}());
exports.Toolkit = Toolkit;
