/// <reference types="react" />
import { AbstractReactFactory, GenerateWidgetEvent } from '../../core/AbstractReactFactory';
import { SelectionLayerModel } from './SelectionLayerModel';
import { GenerateModelEvent } from '../../core/AbstractModelFactory';
export declare class SelectionBoxLayerFactory extends AbstractReactFactory<SelectionLayerModel> {
    constructor();
    generateModel(event: GenerateModelEvent): SelectionLayerModel;
    generateReactWidget(event: GenerateWidgetEvent<SelectionLayerModel>): JSX.Element;
}
