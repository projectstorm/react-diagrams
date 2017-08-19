import {DiagramModel} from "./DiagramModel";
import {DiagramEngine} from "./DiagramEngine";
import {NodeModel, PointModel} from "./Common";
import {SelectionModel} from "./widgets/DiagramWidget";

export class BaseAction {
	mouseX: number;
	mouseY: number;
	ms: number;

	constructor(mouseX: number, mouseY: number) {
		this.mouseX = mouseX;
		this.mouseY = mouseY;
		this.ms = (new Date()).getTime();
	}
}

export class SelectingAction extends BaseAction {
	mouseX2: number;
	mouseY2: number;

	constructor(mouseX: number, mouseY: number) {
		super(mouseX, mouseY);
		this.mouseX2 = mouseX;
		this.mouseY2 = mouseY;
	}

	getBoxDimensions(){
		return {
			left: this.mouseX2 > this.mouseX ? this.mouseX : this.mouseX2,
			top: this.mouseY2 > this.mouseY ? this.mouseY : this.mouseY2,
			width: Math.abs(this.mouseX2-this.mouseX),
			height: Math.abs(this.mouseY2-this.mouseY),
			right: this.mouseX2 < this.mouseX ? this.mouseX : this.mouseX2,
			bottom: this.mouseY2 < this.mouseY ? this.mouseY : this.mouseY2,
		};
	}

	containsElement(x: number, y: number, diagramModel: DiagramModel): boolean {
		var z = diagramModel.getZoomLevel() / 100.0;
		let dimensions = this.getBoxDimensions();

		x = diagramModel.getGridPosition(x);
		y = diagramModel.getGridPosition(y);

		return (
			(x + diagramModel.getOffsetX()) * z > dimensions.left &&
			(x + diagramModel.getOffsetX()) * z < dimensions.right &&
			(y + diagramModel.getOffsetY()) * z > dimensions.top &&
			(y + diagramModel.getOffsetY()) * z < dimensions.bottom
		)
	}
}

export class MoveCanvasAction extends BaseAction {
	initialOffsetX: number;
	initialOffsetY: number;

	constructor(mouseX: number, mouseY: number, diagramModel: DiagramModel) {
		super(mouseX, mouseY);
		this.initialOffsetX = diagramModel.getOffsetX();
		this.initialOffsetY = diagramModel.getOffsetY();
	}
}

export class MoveItemsAction extends BaseAction {
	selectionModels: SelectionModel[];
	moved: boolean;

	constructor(mouseX: number, mouseY: number, diagramEngine: DiagramEngine) {
		super(mouseX, mouseY);
		this.moved = false;
		diagramEngine.enableRepaintEntities(diagramEngine.getDiagramModel().getSelectedItems());
		var selectedItems = diagramEngine.getDiagramModel().getSelectedItems();

		//dont allow items which are locked to move
		selectedItems = selectedItems.filter((item) => {
			return !diagramEngine.isModelLocked(item);
		})

		this.selectionModels = selectedItems.map((item: PointModel | NodeModel) => {
			return {
				model: item,
				initialX: item.x,
				initialY: item.y,
			}
		});
	}
}