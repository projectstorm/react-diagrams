/// <reference types="react" />
import { AbstractReactFactory, GenerateModelEvent, GenerateWidgetEvent } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '../../DiagramEngine';
import { LinkLayerModel } from './LinkLayerModel';
export declare class LinkLayerFactory extends AbstractReactFactory<LinkLayerModel, DiagramEngine> {
    constructor();
    generateModel(event: GenerateModelEvent): LinkLayerModel;
    generateReactWidget(event: GenerateWidgetEvent<LinkLayerModel>): JSX.Element;
}
