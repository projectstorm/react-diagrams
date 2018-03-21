import { DiagramModel } from "../models/DiagramModel";
import { MouseAction } from "./MouseAction";

export class MoveCanvasAction extends MouseAction {
	initialOffsetX: number;
	initialOffsetY: number;

	constructor(mouseX: number, mouseY: number, diagramModel: DiagramModel) {
		super(mouseX, mouseY);
		this.initialOffsetX = diagramModel.getOffsetX();
		this.initialOffsetY = diagramModel.getOffsetY();
	}
}
