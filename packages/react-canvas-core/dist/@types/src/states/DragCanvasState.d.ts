import { AbstractDisplacementState, AbstractDisplacementStateEvent } from '../core-state/AbstractDisplacementState';
import { State } from '../core-state/State';
export declare class DragCanvasState extends AbstractDisplacementState {
    initialCanvasX: number;
    initialCanvasY: number;
    constructor();
    activated(prev: any): Promise<void>;
    deactivated(next: State): void;
    fireMouseMoved(event: AbstractDisplacementStateEvent): void;
}
