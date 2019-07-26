import { Toolkit } from "../Toolkit";

export interface BaseEvent {
	firing: boolean;
	stopPropagation: () => any;
}

export interface BaseEventProxy extends BaseEvent {
	function: string;
}

/**
 * Listeners are always in the form of an object that contains methods that take events
 */
export type BaseListener = {
	/**
	 * Generic event that fires before a specific event was fired
	 */
	eventWillFire?: (event: BaseEvent & { function: string }) => void;

	/**
	 * Generic event that fires after a specific event was fired (even if it was consumed)
	 */
	eventDidFire?: (event: BaseEvent & { function: string }) => void;
	/**
	 * Type for other events that will fire
	 */
	[key: string]: (event: BaseEvent) => any
};

/**
 * Base observer pattern class for working with listeners
 */
export class BaseObserver<L extends BaseListener = BaseListener> {
	protected listeners: { [id: string]: L };

	constructor() {
		this.listeners = {};
	}

	private fireEventInternal(fire: boolean, k: keyof L, event: BaseEvent, ) {
		this.iterateListeners(listener => {
			// returning false here will instruct itteration to stop
			if (!fire && !event.firing) {
				return false;
			}
			// fire selected listener
			if (listener[k]) {
				listener[k](event as BaseEvent);
			}
		});
	}

	fireEvent(event: Partial<BaseEvent> & object, k: keyof L) {
		event = {
			firing: true,
			stopPropagation: () => {
				event.firing = false;
			},
			...event
		};

		// fire pre
		this.fireEventInternal( true, "eventWillFire", {
			...event,
			function: k
		} as BaseEventProxy);

		// fire main event
		this.fireEventInternal( false, k, event as BaseEvent);

		// fire post
		this.fireEventInternal( true, "eventDidFire", {
			...event,
			function: k
		} as BaseEventProxy);
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
