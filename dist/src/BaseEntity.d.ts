/**
 * @author Dylan Vorster
 */
export declare class BaseListener {
}
export declare class BaseEntity<T extends BaseListener> {
    listeners: {
        [s: string]: T;
    };
    id: string;
    constructor();
    getID(): string;
    clearListeners(): void;
    deSerialize(data: any): void;
    serialize(): {
        id: string;
    };
    itterateListeners(cb: (t: T) => any): void;
    removeListener(listener: string): boolean;
    addListener(listener: T): string;
}
