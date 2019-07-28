import { BaseMouseAction } from './BaseMouseAction';
import { SelectionModel } from '../models/SelectionModel';
import { PointModel } from '../models/PointModel';
import { NodeModel } from '../models/NodeModel';
import { DiagramEngine } from '../DiagramEngine';
import { BasePositionModel } from '../core-models/BasePositionModel';
import * as _ from 'lodash';
import { PortModel } from '../models/PortModel';
import { LinkModel } from '../models/LinkModel';
import { MouseEvent } from 'react';

export class MoveItemsAction extends BaseMouseAction {
	selectionModels: SelectionModel[];
	moved: boolean;
	diagramEngine: DiagramEngine;
	allowLooseLinks: boolean;

	constructor(mouseX: number, mouseY: number, diagramEngine: DiagramEngine, allowLooseLinks: boolean) {
		super(mouseX, mouseY, diagramEngine.getDiagramModel());
		this.allowLooseLinks = allowLooseLinks;
		this.diagramEngine = diagramEngine;
		this.moved = false;
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
		this.moved = true;
	}

	fireMouseUp(event: MouseEvent) {
		const element = this.diagramEngine.getMouseElement(event);
		_.forEach(this.selectionModels, model => {
			//only care about points connecting to things
			if (!(model.model instanceof PointModel)) {
				return;
			}
			if (element && element.model instanceof PortModel && !this.diagramEngine.isModelLocked(element.model)) {
				let link = model.model.getLink();
				if (link.getTargetPort()) {
					//if this was a valid link already and we are adding a node in the middle, create 2 links from the original
					if (link.getTargetPort() !== element.model && link.getSourcePort() !== element.model) {
						const targetPort = link.getTargetPort();
						let newLink = link.clone({});
						newLink.setSourcePort(element.model);
						newLink.setTargetPort(targetPort);
						link.setTargetPort(element.model);
						targetPort.removeLink(link);
						newLink.removePointsBefore(newLink.getPoints()[link.getPointIndex(model.model)]);
						link.removePointsAfter(model.model);
						this.diagramEngine.getDiagramModel().addLink(newLink);
						//if we are connecting to the same target or source, remove tweener points
					} else if (link.getTargetPort() === element.model) {
						link.removePointsAfter(model.model);
					} else if (link.getSourcePort() === element.model) {
						link.removePointsBefore(model.model);
					}
				} else {
					link.setTargetPort(element.model);
				}
				delete this.diagramEngine.linksThatHaveInitiallyRendered[link.getID()];
			}
		});

		//check for / remove any loose links in any models which have been moved
		if (!this.allowLooseLinks && this.moved) {
			_.forEach(this.selectionModels, model => {
				//only care about points connecting to things
				if (!(model.model instanceof PointModel)) {
					return;
				}

				let selectedPoint: PointModel = model.model;
				let link: LinkModel = selectedPoint.getLink();
				if (link.getSourcePort() === null || link.getTargetPort() === null) {
					link.remove();
				}
			});
		}

		//remove any invalid links
		_.forEach(this.selectionModels, model => {
			//only care about points connecting to things
			if (!(model.model instanceof PointModel)) {
				return;
			}

			let link: LinkModel = model.model.getLink();
			let sourcePort: PortModel = link.getSourcePort();
			let targetPort: PortModel = link.getTargetPort();
			if (sourcePort !== null && targetPort !== null) {
				if (!sourcePort.canLinkToPort(targetPort)) {
					//link not allowed
					link.remove();
				} else if (
					_.some(
						_.values(targetPort.getLinks()),
						(l: LinkModel) => l !== link && (l.getSourcePort() === sourcePort || l.getTargetPort() === sourcePort)
					)
				) {
					//link is a duplicate
					link.remove();
				}
			}
		});

		this.diagramEngine.clearRepaintEntities();
	}

	fireMouseDown(event: React.MouseEvent) {
		const selectedElement = this.diagramEngine.getMouseElement(event);
		if (selectedElement.model instanceof PortModel) {
			//its a port element, we want to drag a link
			if (!this.diagramEngine.isModelLocked(selectedElement.model)) {
				const portCenter = this.diagramEngine.getPortCenter(selectedElement.model);
				const sourcePort = selectedElement.model;
				const link = sourcePort.createLinkModel();
				link.setSourcePort(sourcePort);

				if (link) {
					link.removeMiddlePoints();
					if (link.getSourcePort() !== sourcePort) {
						link.setSourcePort(sourcePort);
					}
					link.setTargetPort(null);

					link.getFirstPoint().setPosition(portCenter);
					link.getLastPoint().setPosition(portCenter);

					this.model.clearSelection();
					link.getLastPoint().setSelected(true);
					this.model.addLink(link);
				}
			}
		} else {
			selectedElement.model.setSelected(true);
		}
		const selectedItems = this.model.getSelectedItems().filter(item => {
			if (!(item instanceof BasePositionModel)) {
				return false;
			}
			return !this.diagramEngine.isModelLocked(item);
		});

		this.selectionModels = selectedItems.map((item: PointModel | NodeModel) => {
			return {
				model: item,
				initialX: item.getX(),
				initialY: item.getY()
			};
		});
		this.diagramEngine.enableRepaintEntities(this.model.getSelectedItems());
	}
}
