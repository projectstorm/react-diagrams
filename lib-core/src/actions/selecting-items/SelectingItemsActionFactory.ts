import { AbstractActionFactory, ActionFactoryActivationEvent } from '../../core-actions/AbstractActionFactory';
import { MouseEvent } from 'react';
import { SelectingAction } from './SelectingAction';

export class SelectingItemsActionFactory extends AbstractActionFactory<SelectingAction> {
	constructor() {
		super('select-items');
	}

	generateAction(event: MouseEvent): SelectingAction {
		return new SelectingAction(event.clientX, event.clientY, this.engine);
	}

	activate(event: ActionFactoryActivationEvent): boolean {
		return !event.selectedEntity && event.mouseEvent.shiftKey;
	}
}
