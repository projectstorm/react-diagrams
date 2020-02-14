import { BaseEntity, BaseEntityEvent, BaseEntityGenerics, BaseEntityListener, BaseEntityOptions, DeserializeEvent } from './BaseEntity';
import { CanvasModel } from '../entities/canvas/CanvasModel';
export interface BaseModelListener extends BaseEntityListener {
    selectionChanged?(event: BaseEntityEvent<BaseModel> & {
        isSelected: boolean;
    }): void;
    entityRemoved?(event: BaseEntityEvent<BaseModel>): void;
}
export interface BaseModelOptions extends BaseEntityOptions {
    type?: string;
    selected?: boolean;
    extras?: any;
}
export interface BaseModelGenerics extends BaseEntityGenerics {
    LISTENER: BaseModelListener;
    PARENT: BaseEntity;
    OPTIONS: BaseModelOptions;
}
export declare class BaseModel<G extends BaseModelGenerics = BaseModelGenerics> extends BaseEntity<G> {
    protected parent: G['PARENT'];
    constructor(options: G['OPTIONS']);
    performanceTune(): boolean;
    getParentCanvasModel(): CanvasModel;
    getParent(): G['PARENT'];
    setParent(parent: G['PARENT']): void;
    getSelectionEntities(): Array<BaseModel>;
    serialize(): {
        type: string;
        selected: boolean;
        extras: any;
        id: string;
        locked: boolean;
    };
    deserialize(event: DeserializeEvent<this>): void;
    getType(): string;
    isSelected(): boolean;
    isLocked(): boolean;
    setSelected(selected?: boolean): void;
    remove(): void;
}
