import { AbstractMouseAction } from '../../core-actions/AbstractMouseAction';
import { MouseEvent } from 'react';
import { DiagramEngine } from '../../DiagramEngine';

export class MoveCanvasAction extends AbstractMouseAction {
	initialOffsetX: number;
	initialOffsetY: number;

	constructor(mouseX: number, mouseY: number, engine: DiagramEngine) {
		super(mouseX, mouseY, engine);
		this.initialOffsetX = this.model.getOffsetX();
		this.initialOffsetY = this.model.getOffsetY();
	}

	fireMouseMove(event: MouseEvent) {
		//translate the actual canvas
		this.model.setOffset(
			this.initialOffsetX + (event.clientX - this.mouseX),
			this.initialOffsetY + (event.clientY - this.mouseY)
		);
	}

	fireMouseUp(event) {}

	fireMouseDown(event) {
		this.model.clearSelection();
	}
}
