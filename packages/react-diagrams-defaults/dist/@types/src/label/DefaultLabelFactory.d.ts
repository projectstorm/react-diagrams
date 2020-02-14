/// <reference types="react" />
import { DefaultLabelModel } from './DefaultLabelModel';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
/**
 * @author Dylan Vorster
 */
export declare class DefaultLabelFactory extends AbstractReactFactory<DefaultLabelModel, DiagramEngine> {
    constructor();
    generateReactWidget(event: any): JSX.Element;
    generateModel(event: any): DefaultLabelModel;
}
