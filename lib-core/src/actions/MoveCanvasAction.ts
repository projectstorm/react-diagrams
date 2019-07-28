import { BaseMouseAction } from './BaseMouseAction';
import { DiagramModel } from '../models/DiagramModel';
import { MouseEvent } from 'react';

export class MoveCanvasAction extends BaseMouseAction {
	initialOffsetX: number;
	initialOffsetY: number;

	constructor(mouseX: number, mouseY: number, diagramModel: DiagramModel) {
		super(mouseX, mouseY, diagramModel);
		this.initialOffsetX = diagramModel.getOffsetX();
		this.initialOffsetY = diagramModel.getOffsetY();
	}

	fireMouseMove(event: MouseEvent) {
		//translate the actual canvas
		this.model.setOffset(
			this.initialOffsetX + (event.clientX - this.mouseX),
			this.initialOffsetY + (event.clientY - this.mouseY)
		);
	}

	fireMouseUp(event: MouseEvent) {}

	fireMouseDown(event: MouseEvent) {
		this.model.clearSelection();
	}
}
