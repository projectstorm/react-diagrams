import { Toolkit } from "./Toolkit";
/**
 * @author Dylan Vorster
 */
export class BaseListener {
}
export class BaseEnity {
    constructor() {
        this.listeners = {};
        this.id = Toolkit.UID();
    }
    getID() {
        return this.id;
    }
    clearListeners() {
        this.listeners = {};
    }
    itterateListeners(cb) {
        for (var i in this.listeners) {
            cb(this.listeners[i]);
        }
    }
    removeListener(listener) {
        if (this.listeners[listener]) {
            delete this.listeners[listener];
            return true;
        }
        return false;
    }
    addListener(listener) {
        var uid = Toolkit.UID();
        this.listeners[uid] = listener;
        return uid;
    }
}
