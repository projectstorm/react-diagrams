import { AbstractDisplacementState, AbstractDisplacementStateEvent } from '../core-state/AbstractDisplacementState';
import { State } from '../core-state/State';
import { Point } from '@projectstorm/geometry';
import { BaseModel } from '../core-models/BaseModel';
import { CanvasEngine } from '../CanvasEngine';
export declare class MoveItemsState<E extends CanvasEngine = CanvasEngine> extends AbstractDisplacementState<E> {
    initialPositions: {
        [id: string]: {
            point: Point;
            item: BaseModel;
        };
    };
    constructor();
    activated(previous: State): void;
    fireMouseMoved(event: AbstractDisplacementStateEvent): void;
}
