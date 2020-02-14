import { CanvasEngine } from '../CanvasEngine';
import { BaseEvent, BaseListener, BaseObserver } from '../core/BaseObserver';
import { BaseModel } from './BaseModel';
export interface BaseEntityEvent<T extends BaseEntity = BaseEntity> extends BaseEvent {
    entity: T;
}
export interface BaseEntityListener<T extends BaseEntity = BaseEntity> extends BaseListener {
    lockChanged?(event: BaseEntityEvent<T> & {
        locked: boolean;
    }): void;
}
export declare type BaseEntityType = 'node' | 'link' | 'port' | 'point';
export interface BaseEntityOptions {
    id?: string;
    locked?: boolean;
}
export declare type BaseEntityGenerics = {
    LISTENER: BaseEntityListener;
    OPTIONS: BaseEntityOptions;
};
export interface DeserializeEvent<T extends BaseEntity = BaseEntity> {
    engine: CanvasEngine;
    data: ReturnType<T['serialize']>;
    registerModel(model: BaseModel): any;
    getModel<T extends BaseModel>(id: string): Promise<T>;
}
export declare class BaseEntity<T extends BaseEntityGenerics = BaseEntityGenerics> extends BaseObserver<T['LISTENER']> {
    protected options: T['OPTIONS'];
    constructor(options?: T['OPTIONS']);
    getOptions(): T["OPTIONS"];
    getID(): string;
    doClone(lookupTable: {
        [s: string]: any;
    }, clone: any): void;
    clone(lookupTable?: {
        [s: string]: any;
    }): any;
    clearListeners(): void;
    deserialize(event: DeserializeEvent<this>): void;
    serialize(): {
        id: string;
        locked: boolean;
    };
    fireEvent<L extends Partial<BaseEntityEvent> & object>(event: L, k: keyof T['LISTENER']): void;
    isLocked(): boolean;
    setLocked(locked?: boolean): void;
}
