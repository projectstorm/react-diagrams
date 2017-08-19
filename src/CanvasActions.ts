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

	containsElement(x: number, y: number, diagramModel: DiagramModel): boolean {
		var z = diagramModel.getZoomLevel() / 100.0;
		return (
			(x + diagramModel.getOffsetX()) * z > this.mouseX &&
			(x + diagramModel.getOffsetX()) * z < this.mouseX2 &&
			(y + diagramModel.getOffsetY()) * z > this.mouseY &&
			(y + diagramModel.getOffsetY()) * z < this.mouseY2
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