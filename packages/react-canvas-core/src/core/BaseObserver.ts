import { Toolkit } from '../Toolkit';

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
	[key: string]: (event: BaseEvent) => any;
};

export interface ListenerHandle {
	/**
	 * Used to degister the listener
	 */
	deregister: () => any;
	/**
	 * Original ID of the listener
	 */
	id: string;

	/**
	 * Original Listener
	 */
	listner: BaseListener;
}

/**
 * Base observer pattern class for working with listeners
 */
export class BaseObserver<L extends BaseListener = BaseListener> {
	protected listeners: { [id: string]: L };

	constructor() {
		this.listeners = {};
	}

	private fireEventInternal(fire: boolean, k: keyof L, event: BaseEvent) {
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

	fireEvent<K extends keyof L>(event: Partial<Parameters<L[K]>[0]>, k: keyof L) {
		event = {
			firing: true,
			stopPropagation: () => {
				event.firing = false;
			},
			...event
		};

		// fire pre
		this.fireEventInternal(true, 'eventWillFire', {
			...event,
			function: k
		} as BaseEventProxy);

		// fire main event
		this.fireEventInternal(false, k, event as BaseEvent);

		// fire post
		this.fireEventInternal(true, 'eventDidFire', {
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

	getListenerHandle(listener: L): ListenerHandle {
		for (let id in this.listeners) {
			if (this.listeners[id] === listener) {
				return {
					id: id,
					listner: listener,
					deregister: () => {
						delete this.listeners[id];
					}
				};
			}
		}
	}

	registerListener(listener: L): ListenerHandle {
		const id = Toolkit.UID();
		this.listeners[id] = listener;
		return {
			id: id,
			listner: listener,
			deregister: () => {
				delete this.listeners[id];
			}
		};
	}

	deregisterListener(listener: L | ListenerHandle) {
		if (typeof listener === 'object') {
			(listener as ListenerHandle).deregister();
			return true;
		}
		const handle = this.getListenerHandle(listener);
		if (handle) {
			handle.deregister();
			return true;
		}
		return false;
	}
}
