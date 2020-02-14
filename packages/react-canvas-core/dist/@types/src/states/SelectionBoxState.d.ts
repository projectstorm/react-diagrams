import { AbstractDisplacementState, AbstractDisplacementStateEvent } from '../core-state/AbstractDisplacementState';
import { State } from '../core-state/State';
import { SelectionLayerModel } from '../entities/selection/SelectionLayerModel';
export declare class SelectionBoxState extends AbstractDisplacementState {
    layer: SelectionLayerModel;
    constructor();
    activated(previous: State): void;
    deactivated(next: State): void;
    getBoxDimensions(event: AbstractDisplacementStateEvent): ClientRect;
    fireMouseMoved(event: AbstractDisplacementStateEvent): void;
}
