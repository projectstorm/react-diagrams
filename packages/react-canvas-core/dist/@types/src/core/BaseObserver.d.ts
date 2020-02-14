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
export declare type BaseListener = {
    /**
     * Generic event that fires before a specific event was fired
     */
    eventWillFire?: (event: BaseEvent & {
        function: string;
    }) => void;
    /**
     * Generic event that fires after a specific event was fired (even if it was consumed)
     */
    eventDidFire?: (event: BaseEvent & {
        function: string;
    }) => void;
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
export declare class BaseObserver<L extends BaseListener = BaseListener> {
    protected listeners: {
        [id: string]: L;
    };
    constructor();
    private fireEventInternal;
    fireEvent<K extends keyof L>(event: Partial<Parameters<L[K]>[0]>, k: keyof L): void;
    iterateListeners(cb: (listener: L) => any): void;
    getListenerHandle(listener: L): ListenerHandle;
    registerListener(listener: L): ListenerHandle;
    deregisterListener(listener: L | ListenerHandle): boolean;
}
