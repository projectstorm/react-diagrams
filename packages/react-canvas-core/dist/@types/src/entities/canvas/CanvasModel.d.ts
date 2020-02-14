import { BaseEntity, BaseEntityEvent, BaseEntityGenerics, BaseEntityListener, BaseEntityOptions, DeserializeEvent } from '../../core-models/BaseEntity';
import { LayerModel } from '../layer/LayerModel';
import { BaseModel } from '../../core-models/BaseModel';
import { CanvasEngine } from '../../CanvasEngine';
export interface DiagramListener extends BaseEntityListener {
    offsetUpdated?(event: BaseEntityEvent<CanvasModel> & {
        offsetX: number;
        offsetY: number;
    }): void;
    zoomUpdated?(event: BaseEntityEvent<CanvasModel> & {
        zoom: number;
    }): void;
    gridUpdated?(event: BaseEntityEvent<CanvasModel> & {
        size: number;
    }): void;
}
export interface DiagramModelOptions extends BaseEntityOptions {
    offsetX?: number;
    offsetY?: number;
    zoom?: number;
    gridSize?: number;
}
export interface CanvasModelGenerics extends BaseEntityGenerics {
    LISTENER: DiagramListener;
    OPTIONS: DiagramModelOptions;
    LAYER: LayerModel;
}
export declare class CanvasModel<G extends CanvasModelGenerics = CanvasModelGenerics> extends BaseEntity<G> {
    protected layers: G['LAYER'][];
    constructor(options?: G['OPTIONS']);
    getSelectionEntities(): BaseModel[];
    getSelectedEntities(): BaseModel[];
    clearSelection(): void;
    getModels(): BaseModel[];
    addLayer(layer: LayerModel): void;
    removeLayer(layer: LayerModel): boolean;
    getLayers(): G["LAYER"][];
    setGridSize(size?: number): void;
    getGridPosition(pos: number): number;
    deserializeModel(data: ReturnType<this['serialize']>, engine: CanvasEngine): void;
    deserialize(event: DeserializeEvent<this>): void;
    serialize(): {
        offsetX: number;
        offsetY: number;
        zoom: number;
        gridSize: number;
        layers: {
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
        }[];
        id: string;
        locked: boolean;
    };
    setZoomLevel(zoom: number): void;
    setOffset(offsetX: number, offsetY: number): void;
    setOffsetX(offsetX: number): void;
    setOffsetY(offsetY: number): void;
    getOffsetY(): number;
    getOffsetX(): number;
    getZoomLevel(): number;
}
