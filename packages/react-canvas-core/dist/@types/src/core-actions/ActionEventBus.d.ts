import { Action, ActionEvent, InputType } from './Action';
import { MouseEvent } from 'react';
import { CanvasEngine } from '../CanvasEngine';
import { BaseModel } from '../core-models/BaseModel';
export declare class ActionEventBus {
    protected actions: {
        [id: string]: Action;
    };
    protected engine: CanvasEngine;
    protected keys: {
        [key: string]: boolean;
    };
    constructor(engine: CanvasEngine);
    getKeys(): string[];
    registerAction(action: Action): () => void;
    deregisterAction(action: Action): void;
    getActionsForType(type: InputType): Action[];
    getModelForEvent(actionEvent: ActionEvent<MouseEvent>): BaseModel;
    getActionsForEvent(actionEvent: ActionEvent): Action[];
    fireAction(actionEvent: ActionEvent): void;
}
