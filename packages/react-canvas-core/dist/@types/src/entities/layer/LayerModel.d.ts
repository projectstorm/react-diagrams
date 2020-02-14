import { BaseModel, BaseModelGenerics, BaseModelOptions } from '../../core-models/BaseModel';
import { CanvasModel } from '../canvas/CanvasModel';
import { CanvasEngine } from '../../CanvasEngine';
import { FactoryBank } from '../../core/FactoryBank';
import { AbstractModelFactory } from '../../core/AbstractModelFactory';
import { DeserializeEvent } from '../../core-models/BaseEntity';
export interface LayerModelOptions extends BaseModelOptions {
    isSvg?: boolean;
    transformed?: boolean;
}
export interface LayerModelGenerics extends BaseModelGenerics {
    OPTIONS: LayerModelOptions;
    PARENT: CanvasModel;
    CHILDREN: BaseModel;
    ENGINE: CanvasEngine;
}
export declare abstract class LayerModel<G extends LayerModelGenerics = LayerModelGenerics> extends BaseModel<G> {
    protected models: {
        [id: string]: G['CHILDREN'];
    };
    protected repaintEnabled: boolean;
    constructor(options?: G['OPTIONS']);
    /**
     * This is used for deserialization
     */
    abstract getChildModelFactoryBank(engine: G['ENGINE']): FactoryBank<AbstractModelFactory<BaseModel>>;
    deserialize(event: DeserializeEvent<this>): void;
    serialize(): {
        isSvg: boolean;
        transformed: boolean;
        models: {
            [x: string]: {
                type: string;
                selected: boolean;
                extras: any;
                id: string;
                locked: boolean;
            };
        };
        type: string;
        selected: boolean;
        extras: any;
        id: string;
        locked: boolean;
    };
    isRepaintEnabled(): boolean;
    allowRepaint(allow?: boolean): void;
    remove(): void;
    addModel(model: G['CHILDREN']): void;
    getSelectionEntities(): Array<BaseModel>;
    getModels(): {
        [id: string]: G["CHILDREN"];
    };
    getModel(id: string): G["CHILDREN"];
    removeModel(id: string | G['CHILDREN']): boolean;
}
