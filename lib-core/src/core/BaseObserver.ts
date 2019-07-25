import { Toolkit } from '../Toolkit';

export interface BaseEvent {
	firing: boolean;
	stopPropagation: () => any;
}

/**
 * Listeners are always in the form of an object that contains methods that take events
 */
export type BaseListener = { [key: string]: (event: BaseEvent) => any };

/**
 * Base observer pattern class for working with listeners
 */
export class BaseObserver<L extends BaseListener = BaseListener> {
	protected listeners: { [id: string]: L };

	constructor() {
		this.listeners = {};
	}

	fireEvent(event: Partial<BaseEvent> & object, k: keyof L) {
		event = {
			firing: true,
			stopPropagation: () => {
				event.firing = false;
			},
			...event
		};

		this.iterateListeners(listener => {
			// returning false here will instruct itteration to stop
			if (!event.firing) {
				return false;
			}
			if (listener[k]) {
				listener[k](event as BaseEvent);
			}
		});
	}

	iterateListeners(cb: (listener: L) => any) {
		for (let id in this.listeners) {
			const res = cb(this.listeners[id]);
			// cancel itteration on false
			if (res === false) {
				return;
			}
		}
	}

	/**
	 * @deprecated use registerListener instead
	 */
	addListener(listener: L) {
		this.registerListener(listener);
	}

	registerListener(listener: L) {
		const id = Toolkit.UID();
		this.listeners[id] = listener;
		return () => {
			delete this.listeners[id];
		};
	}

	deregisterListener(listener: L) {
		for (let id in this.listeners) {
			if (this.listeners[id] === listener) {
				delete this.listeners[id];
				return true;
			}
		}
		return false;
	}
}
