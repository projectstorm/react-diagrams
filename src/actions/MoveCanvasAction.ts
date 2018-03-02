import { BaseAction } from "./BaseAction";
import { DiagramModel } from "../models/DiagramModel";

export class MoveCanvasAction extends BaseAction {
	initialOffsetX: number;
	initialOffsetY: number;

	constructor(mouseX: number, mouseY: number, diagramModel: DiagramModel) {
		super(mouseX, mouseY);
		this.initialOffsetX = diagramModel.getOffsetX();
		this.initialOffsetY = diagramModel.getOffsetY();
	}
}
