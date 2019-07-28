import { DiagramModel } from '../models/DiagramModel';

export abstract class BaseAction {
	mouseX: number;
	mouseY: number;
	ms: number;
	model: DiagramModel;

	constructor(mouseX: number, mouseY: number, model: DiagramModel) {
		this.mouseX = mouseX;
		this.mouseY = mouseY;
		this.ms = new Date().getTime();
		this.model = model;
	}

	abstract fireMouseMove(event: MouseEvent);
}
