import { State } from './State';
import { CanvasEngine } from '../CanvasEngine';
import { BaseEvent, BaseListener, BaseObserver } from '../core/BaseObserver';
export interface StateMachineListener extends BaseListener {
    stateChanged?: (event: BaseEvent & {
        newState: State;
    }) => any;
}
export declare class StateMachine extends BaseObserver<StateMachineListener> {
    protected currentState: State;
    protected stateStack: State[];
    protected engine: CanvasEngine;
    constructor(engine: CanvasEngine);
    getCurrentState(): State<CanvasEngine<import("../CanvasEngine").CanvasEngineListener, import("../..").CanvasModel<import("../..").CanvasModelGenerics>>>;
    pushState(state: State): void;
    popState(): void;
    setState(state: State): void;
}
