import { LayerModel } from '../layer/LayerModel';
import { FactoryBank } from '../../core/FactoryBank';
import { AbstractModelFactory } from '../../core/AbstractModelFactory';
import { BaseModel } from '../../core-models/BaseModel';
export declare class SelectionLayerModel extends LayerModel {
    box: ClientRect;
    constructor();
    setBox(rect: ClientRect): void;
    getChildModelFactoryBank(): FactoryBank<AbstractModelFactory<BaseModel>>;
}
