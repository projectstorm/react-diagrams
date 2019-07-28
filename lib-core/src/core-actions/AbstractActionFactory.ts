import { AbstractAction } from './AbstractAction';
import { AbstractFactory } from '../core/AbstractFactory';
import { MouseEvent } from 'react';
import { BaseModel } from '../core-models/BaseModel';

export interface ActionFactoryActivationEvent {
	selectedModel: BaseModel;
	selectedEntity: HTMLElement;
	mouseEvent: MouseEvent;
}

export abstract class AbstractActionFactory<T extends AbstractAction = AbstractAction> extends AbstractFactory {
	abstract activate(event: ActionFactoryActivationEvent): boolean;

	abstract generateAction(event: MouseEvent): T;
}
