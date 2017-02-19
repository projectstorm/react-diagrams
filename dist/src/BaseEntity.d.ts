/**
 * @author Dylan Vorster
 */
export declare class BaseListener {
}
export declare class BaseEnity<T extends BaseListener> {
    listeners: {
        [s: string]: T;
    };
    id: string;
    constructor();
    getID(): string;
    clearListeners(): void;
    itterateListeners(cb: (t: T) => any): void;
    removeListener(listener: string): boolean;
    addListener(listener: T): string;
}
