/**
 * @author Dylan Vorster
 */
export declare class BaseListener {
    lockChanged?(entity: BaseEntity<BaseListener>, locked: boolean): void;
}
export declare class BaseEntity<T extends BaseListener> {
    listeners: {
        [s: string]: T;
    };
    id: string;
    locked: boolean;
    constructor();
    getID(): string;
    clearListeners(): void;
    deSerialize(data: any): void;
    serialize(): {
        id: string;
    };
    iterateListeners(cb: (t: T) => any): void;
    removeListener(listener: string): boolean;
    addListener(listener: T): string;
    isLocked(): boolean;
    setLocked(locked?: boolean): void;
}
