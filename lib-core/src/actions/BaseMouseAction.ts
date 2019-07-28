import { DiagramModel } from '../models/DiagramModel';
import { MouseEvent } from 'react';

export abstract class BaseMouseAction {
	mouseX: number;
	mouseY: number;
	ms: number;
	model: DiagramModel;

	constructor(mouseX: number, mouseY: number, model: DiagramModel) {
		this.mouseX = mouseX;
		this.mouseY = mouseY;
		this.model = model;
		this.ms = new Date().getTime();
	}

	abstract fireMouseDown(event: MouseEvent);

	abstract fireMouseMove(event: MouseEvent);

	abstract fireMouseUp(event: MouseEvent);
}
