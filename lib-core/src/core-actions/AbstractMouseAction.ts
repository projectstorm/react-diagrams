import { MouseEvent } from 'react';
import { AbstractAction } from './AbstractAction';
import { DiagramEngine } from '../DiagramEngine';
import { ActionFactoryActivationEvent } from './AbstractActionFactory';

export abstract class AbstractMouseAction extends AbstractAction {
	protected mouseX: number;
	protected mouseY: number;

	constructor(mouseX: number, mouseY: number, engine: DiagramEngine) {
		super(engine);
		this.mouseX = mouseX;
		this.mouseY = mouseY;
	}

	abstract fireMouseDown(event: ActionFactoryActivationEvent);

	abstract fireMouseMove(event: MouseEvent);

	abstract fireMouseUp(event: MouseEvent);
}
