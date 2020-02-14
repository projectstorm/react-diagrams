import { LabelModel, LabelModelGenerics, LabelModelOptions } from '@projectstorm/react-diagrams-core';
import { DeserializeEvent } from '@projectstorm/react-canvas-core';
export interface DefaultLabelModelOptions extends LabelModelOptions {
    label?: string;
}
export interface DefaultLabelModelGenerics extends LabelModelGenerics {
    OPTIONS: DefaultLabelModelOptions;
}
export declare class DefaultLabelModel extends LabelModel<DefaultLabelModelGenerics> {
    constructor(options?: DefaultLabelModelOptions);
    setLabel(label: string): void;
    deserialize(event: DeserializeEvent<this>): void;
    serialize(): {
        label: string;
        offsetX: number;
        offsetY: number;
        type: string;
        selected: boolean;
        extras: any;
        id: string;
        locked: boolean;
    };
}
