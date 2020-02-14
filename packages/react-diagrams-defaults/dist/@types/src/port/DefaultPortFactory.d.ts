import { DefaultPortModel } from './DefaultPortModel';
import { AbstractModelFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
export declare class DefaultPortFactory extends AbstractModelFactory<DefaultPortModel, DiagramEngine> {
    constructor();
    generateModel(): DefaultPortModel;
}
