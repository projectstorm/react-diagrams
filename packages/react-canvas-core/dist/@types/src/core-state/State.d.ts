import { CanvasEngine } from '../CanvasEngine';
import { Action, ActionEvent } from '../core-actions/Action';
import { SyntheticEvent } from 'react';
export interface StateOptions {
    name: string;
}
export declare abstract class State<E extends CanvasEngine = CanvasEngine> {
    protected engine: E;
    protected actions: Action[];
    protected keys: string[];
    protected options: StateOptions;
    protected childStates: State[];
    private handler1;
    private handler2;
    constructor(options: StateOptions);
    setEngine(engine: E): void;
    getOptions(): StateOptions;
    eject(): void;
    transitionWithEvent(state: State, event: ActionEvent<SyntheticEvent>): void;
    registerAction(action: Action): void;
    tryActivateParentState(keys: string[]): boolean;
    tryActivateChildState(keys: string[]): boolean;
    findStateToActivate(keys: string[]): State<CanvasEngine<import("../CanvasEngine").CanvasEngineListener, import("../..").CanvasModel<import("../..").CanvasModelGenerics>>>;
    isKeysFullfilled(keys: string[]): boolean;
    activated(previous: State): void;
    deactivated(next: State): void;
}
