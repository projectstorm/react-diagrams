import { BaseAction } from './BaseAction';
import { SelectionModel } from '../models/SelectionModel';
import { PointModel } from '../models/PointModel';
import { NodeModel } from '../models/NodeModel';
import { DiagramEngine } from '../DiagramEngine';
import { BasePositionModel } from '../core-models/BasePositionModel';
import * as _ from 'lodash';

export class MoveItemsAction extends BaseAction {
	selectionModels: SelectionModel[];
	moved: boolean;
	diagramEngine: DiagramEngine;

	constructor(mouseX: number, mouseY: number, diagramEngine: DiagramEngine) {
		super(mouseX, mouseY, diagramEngine.getDiagramModel());
		this.diagramEngine = diagramEngine;
		this.moved = false;
		diagramEngine.enableRepaintEntities(diagramEngine.getDiagramModel().getSelectedItems());
		var selectedItems = diagramEngine.getDiagramModel().getSelectedItems();

		//dont allow items which are locked to move
		selectedItems = selectedItems.filter(item => {
			if (!(item instanceof BasePositionModel)) {
				return false;
			}
			return !diagramEngine.isModelLocked(item);
		});

		this.selectionModels = selectedItems.map((item: PointModel | NodeModel) => {
			return {
				model: item,
				initialX: item.getX(),
				initialY: item.getY()
			};
		});
	}

	fireMouseMove(event: MouseEvent) {
		let amountX = event.clientX - this.mouseX;
		let amountY = event.clientY - this.mouseY;
		let amountZoom = this.model.getZoomLevel() / 100;

		_.forEach(this.selectionModels, model => {
			// in this case we need to also work out the relative grid position
			if (model.model instanceof NodeModel || (model.model instanceof PointModel && !model.model.isConnectedToPort())) {
				model.model.setPosition(
					this.model.getGridPosition(model.initialX + amountX / amountZoom),
					this.model.getGridPosition(model.initialY + amountY / amountZoom)
				);

				if (model.model instanceof NodeModel) {
					// update port coordinates as well
					_.forEach(model.model.getPorts(), port => {
						const portCoords = this.diagramEngine.getPortCoords(port);
						port.updateCoords(portCoords);
					});
				}
			} else if (model.model instanceof PointModel) {
				// we want points that are connected to ports, to not necessarily snap to grid
				// this stuff needs to be pixel perfect, dont touch it
				model.model.setPosition(
					model.initialX + this.model.getGridPosition(amountX / amountZoom),
					model.initialY + this.model.getGridPosition(amountY / amountZoom)
				);
			}
		});
	}
}
