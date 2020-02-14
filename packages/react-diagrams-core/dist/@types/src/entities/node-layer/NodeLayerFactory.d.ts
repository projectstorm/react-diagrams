/// <reference types="react" />
import { AbstractReactFactory, GenerateModelEvent, GenerateWidgetEvent } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '../../DiagramEngine';
import { NodeLayerModel } from './NodeLayerModel';
export declare class NodeLayerFactory extends AbstractReactFactory<NodeLayerModel, DiagramEngine> {
    constructor();
    generateModel(event: GenerateModelEvent): NodeLayerModel;
    generateReactWidget(event: GenerateWidgetEvent<NodeLayerModel>): JSX.Element;
}
