import { NodeModel, NodeModelGenerics } from '@projectstorm/react-diagrams-core';
import { DefaultPortModel } from '../port/DefaultPortModel';
import { BasePositionModelOptions, DeserializeEvent } from '@projectstorm/react-canvas-core';
export interface DefaultNodeModelOptions extends BasePositionModelOptions {
    name?: string;
    color?: string;
}
export interface DefaultNodeModelGenerics extends NodeModelGenerics {
    OPTIONS: DefaultNodeModelOptions;
}
export declare class DefaultNodeModel extends NodeModel<DefaultNodeModelGenerics> {
    protected portsIn: DefaultPortModel[];
    protected portsOut: DefaultPortModel[];
    constructor(name: string, color: string);
    constructor(options?: DefaultNodeModelOptions);
    doClone(lookupTable: {}, clone: any): void;
    removePort(port: DefaultPortModel): void;
    addPort<T extends DefaultPortModel>(port: T): T;
    addInPort(label: string, after?: boolean): DefaultPortModel;
    addOutPort(label: string, after?: boolean): DefaultPortModel;
    deserialize(event: DeserializeEvent<this>): void;
    serialize(): any;
    getInPorts(): DefaultPortModel[];
    getOutPorts(): DefaultPortModel[];
}
