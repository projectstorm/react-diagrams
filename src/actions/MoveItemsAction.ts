import { BaseAction } from "./BaseAction";
import { SelectionModel } from "../models/SelectionModel";
import { PointModel } from "../models/PointModel";
import { NodeModel } from "../models/NodeModel";
import { DiagramEngine } from "../DiagramEngine";

export class MoveItemsAction extends BaseAction {
	selectionModels: SelectionModel[];
	moved: boolean;

	constructor(mouseX: number, mouseY: number, diagramEngine: DiagramEngine) {
		super(mouseX, mouseY);
		this.moved = false;
		diagramEngine.enableRepaintEntities(diagramEngine.getDiagramModel().getSelectedItems());
		var selectedItems = diagramEngine.getDiagramModel().getSelectedItems();

		//dont allow items which are locked to move
		selectedItems = selectedItems.filter(item => {
			return !diagramEngine.isModelLocked(item);
		});

		this.selectionModels = selectedItems.map((item: PointModel | NodeModel) => {
			return {
				model: item,
				initialX: item.x,
				initialY: item.y
			};
		});
	}
}
