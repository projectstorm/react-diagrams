import { AbstractActionFactory, ActionFactoryActivationEvent } from '../../core-actions/AbstractActionFactory';
import { MoveCanvasAction } from './MoveCanvasAction';
import { MouseEvent } from 'react';

export class MoveCanvasActionFactory extends AbstractActionFactory<MoveCanvasAction> {
	constructor() {
		super('move-canvas');
	}

	generateAction(event: MouseEvent): MoveCanvasAction {
		return new MoveCanvasAction(event.clientX, event.clientY, this.engine);
	}

	activate(event: ActionFactoryActivationEvent): boolean {
		return !event.selectedEntity && !event.mouseEvent.shiftKey;
	}
}
