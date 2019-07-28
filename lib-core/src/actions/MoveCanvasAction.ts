import { BaseAction } from './BaseAction';
import { DiagramModel } from '../models/DiagramModel';

export class MoveCanvasAction extends BaseAction {
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
}
