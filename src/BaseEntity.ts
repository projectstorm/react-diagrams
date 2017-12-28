import { Toolkit } from "./Toolkit";
import * as _ from "lodash";
/**
 * @author Dylan Vorster
 */
export interface BaseEvent<T extends BaseEntity = any> {
	entity: BaseEntity<BaseListener>;
	stopPropagation: () => any;
	firing: boolean;
	id: string;
}

export interface BaseListener<T extends BaseEntity = any> {
	lockChanged?(event: BaseEvent<T> & { locked: boolean }): void;
}

export class BaseEntity<T extends BaseListener = {}> {
	public listeners: { [s: string]: T };
	public id: string;
	public locked: boolean;

	constructor(id?: string) {
		this.listeners = {};
		this.id = id || Toolkit.UID();
		this.locked = false;
	}

	getID() {
		return this.id;
	}

	clone(lookupTable = {}) {
		let clone = _.clone(this);
		clone.clearListeners();
		clone.id = Toolkit.UID();
		return clone;
	}

	clearListeners() {
		this.listeners = {};
	}

	public deSerialize(data) {
		this.id = data.id;
	}

	public serialize() {
		return {
			id: this.id
		};
	}

	public iterateListeners(cb: (t: T, event: BaseEvent) => any) {
		let event: BaseEvent = {
			id: Toolkit.UID(),
			firing: true,
			entity: this,
			stopPropagation: () => {
				event.firing = false;
			}
		};
		for (var i in this.listeners) {
			// propagation stopped
			if (!event.firing) {
				return;
			}
			cb(this.listeners[i], event);
		}
	}

	public removeListener(listener: string) {
		if (this.listeners[listener]) {
			delete this.listeners[listener];
			return true;
		}
		return false;
	}

	public addListener(listener: T): string {
		var uid = Toolkit.UID();
		this.listeners[uid] = listener;
		return uid;
	}

	public isLocked(): boolean {
		return this.locked;
	}

	public setLocked(locked: boolean = true) {
		this.locked = locked;
		this.iterateListeners((listener, event) => {
			if (listener.lockChanged) {
				listener.lockChanged({ ...event, locked: locked });
			}
		});
	}
}
