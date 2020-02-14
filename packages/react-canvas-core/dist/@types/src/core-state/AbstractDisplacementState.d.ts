/// <reference types="react" />
import { State, StateOptions } from './State';
import { CanvasEngine } from '../CanvasEngine';
export interface AbstractDisplacementStateEvent {
    displacementX: number;
    displacementY: number;
    virtualDisplacementX: number;
    virtualDisplacementY: number;
    event: React.MouseEvent;
}
export declare abstract class AbstractDisplacementState<E extends CanvasEngine = CanvasEngine> extends State<E> {
    initialX: number;
    initialY: number;
    initialXRelative: number;
    initialYRelative: number;
    constructor(options: StateOptions);
    abstract fireMouseMoved(event: AbstractDisplacementStateEvent): any;
}
