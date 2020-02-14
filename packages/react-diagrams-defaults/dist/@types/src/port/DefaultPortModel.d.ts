import { LinkModel, PortModel, PortModelAlignment, PortModelGenerics, PortModelOptions } from '@projectstorm/react-diagrams-core';
import { AbstractModelFactory, DeserializeEvent } from '@projectstorm/react-canvas-core';
export interface DefaultPortModelOptions extends PortModelOptions {
    label?: string;
    in?: boolean;
}
export interface DefaultPortModelGenerics extends PortModelGenerics {
    OPTIONS: DefaultPortModelOptions;
}
export declare class DefaultPortModel extends PortModel<DefaultPortModelGenerics> {
    constructor(isIn: boolean, name?: string, label?: string);
    constructor(options: DefaultPortModelOptions);
    deserialize(event: DeserializeEvent<this>): void;
    serialize(): {
        in: boolean;
        label: string;
        name: string;
        alignment: PortModelAlignment;
        parentNode: string;
        links: string[];
        x: number;
        y: number;
        type: string;
        selected: boolean;
        extras: any;
        id: string;
        locked: boolean;
    };
    link<T extends LinkModel>(port: PortModel, factory?: AbstractModelFactory<T>): T;
    canLinkToPort(port: PortModel): boolean;
    createLinkModel(factory?: AbstractModelFactory<LinkModel>): LinkModel;
}
