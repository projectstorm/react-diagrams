"use strict";
var Toolkit_1 = require("./Toolkit");
/**
 * @author Dylan Vorster
 */
var BaseListener = (function () {
    function BaseListener() {
    }
    return BaseListener;
}());
exports.BaseListener = BaseListener;
var BaseEnity = (function () {
    function BaseEnity() {
        this.listeners = {};
        this.id = Toolkit_1.Toolkit.UID();
    }
    BaseEnity.prototype.getID = function () {
        return this.id;
    };
    BaseEnity.prototype.clearListeners = function () {
        this.listeners = {};
    };
    BaseEnity.prototype.itterateListeners = function (cb) {
        for (var i in this.listeners) {
            cb(this.listeners[i]);
        }
    };
    BaseEnity.prototype.removeListener = function (listener) {
        if (this.listeners[listener]) {
            delete this.listeners[listener];
            return true;
        }
        return false;
    };
    BaseEnity.prototype.addListener = function (listener) {
        var uid = Toolkit_1.Toolkit.UID();
        this.listeners[uid] = listener;
        return uid;
    };
    return BaseEnity;
}());
exports.BaseEnity = BaseEnity;
