/// <reference types="react" />
import { DefaultNodeModel } from './DefaultNodeModel';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
export declare class DefaultNodeFactory extends AbstractReactFactory<DefaultNodeModel, DiagramEngine> {
    constructor();
    generateReactWidget(event: any): JSX.Element;
    generateModel(event: any): DefaultNodeModel;
}
