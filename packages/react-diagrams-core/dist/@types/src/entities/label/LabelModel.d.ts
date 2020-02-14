import { LinkModel } from '../link/LinkModel';
import { BaseModel, BaseModelGenerics, BaseModelOptions, DeserializeEvent } from '@projectstorm/react-canvas-core';
export interface LabelModelOptions extends BaseModelOptions {
    offsetX?: number;
    offsetY?: number;
}
export interface LabelModelGenerics extends BaseModelGenerics {
    PARENT: LinkModel;
    OPTIONS: LabelModelOptions;
}
export declare class LabelModel<G extends LabelModelGenerics = LabelModelGenerics> extends BaseModel<G> {
    constructor(options: G['OPTIONS']);
    deserialize(event: DeserializeEvent<this>): void;
    serialize(): {
        offsetX: number;
        offsetY: number;
        type: string;
        selected: boolean;
        extras: any;
        id: string;
        locked: boolean;
    };
}
