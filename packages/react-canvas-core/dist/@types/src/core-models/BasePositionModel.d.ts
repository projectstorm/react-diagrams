import { BaseModel, BaseModelGenerics, BaseModelListener, BaseModelOptions } from './BaseModel';
import { BaseEntityEvent, DeserializeEvent } from './BaseEntity';
import { Point, Rectangle } from '@projectstorm/geometry';
import { ModelGeometryInterface } from '../core/ModelGeometryInterface';
export interface BasePositionModelListener extends BaseModelListener {
    positionChanged?(event: BaseEntityEvent<BasePositionModel>): void;
}
export interface BasePositionModelOptions extends BaseModelOptions {
    position?: Point;
}
export interface BasePositionModelGenerics extends BaseModelGenerics {
    LISTENER: BasePositionModelListener;
    OPTIONS: BasePositionModelOptions;
}
export declare class BasePositionModel<G extends BasePositionModelGenerics = BasePositionModelGenerics> extends BaseModel<G> implements ModelGeometryInterface {
    protected position: Point;
    constructor(options: G['OPTIONS']);
    setPosition(point: Point): any;
    setPosition(x: number, y: number): any;
    getBoundingBox(): Rectangle;
    deserialize(event: DeserializeEvent<this>): void;
    serialize(): {
        x: number;
        y: number;
        type: string;
        selected: boolean;
        extras: any;
        id: string;
        locked: boolean;
    };
    getPosition(): Point;
    getX(): number;
    getY(): number;
}
