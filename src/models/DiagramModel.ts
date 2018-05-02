import * as _ from "lodash";
import { LinkModel } from "./LinkModel";
import { NodeModel } from "./NodeModel";
import { BaseModel, BaseEvent, CanvasModel, CanvasModelListener, CanvasLayerModel } from "@projectstorm/react-canvas";

export interface DiagramListener extends CanvasModelListener {
	nodesUpdated?(event: BaseEvent & { node: NodeModel; isCreated: boolean }): void;

	linksUpdated?(event: BaseEvent & { link: LinkModel; isCreated: boolean }): void;

	gridUpdated?(event: BaseEvent<DiagramModel> & { size: number }): void;
}

export class DiagramModel extends CanvasModel<DiagramListener> {
	linksLayer: CanvasLayerModel<LinkModel>;
	nodesLayer: CanvasLayerModel<NodeModel>;

	constructor() {
		super();

		this.linksLayer = new CanvasLayerModel();
		this.nodesLayer = new CanvasLayerModel();

		this.linksLayer.setSVG(true);
		this.linksLayer.setTransformable(true);

		this.nodesLayer.setSVG(false);
		this.nodesLayer.setTransformable(true);

		this.addLayer(this.linksLayer);
		this.addLayer(this.nodesLayer);
	}

	getNode(node: string | NodeModel): NodeModel | null {
		if (node instanceof NodeModel) {
			return node;
		}
		return this.nodesLayer.getEntity[node] || null;
	}

	getLink(link: string | LinkModel): LinkModel | null {
		if (link instanceof LinkModel) {
			return link;
		}
		return this.linksLayer.getEntity(link) || null;
	}

	addAll(...models: BaseModel[]): BaseModel[] {
		_.forEach(models, model => {
			if (model instanceof LinkModel) {
				this.addLink(model);
			} else if (model instanceof NodeModel) {
				this.addNode(model);
			}
		});
		return models;
	}

	addLink(link: LinkModel): LinkModel {
		this.linksLayer.addEntity(link);
		this.iterateListeners("link added", (listener, event) => {
			if (listener.linksUpdated) {
				listener.linksUpdated({ ...event, link: link, isCreated: true });
			}
		});
		return link;
	}

	addNode(node: NodeModel): NodeModel {
		this.nodesLayer.addEntity(node);
		this.iterateListeners("node added", (listener, event) => {
			if (listener.nodesUpdated) {
				listener.nodesUpdated({ ...event, node: node, isCreated: true });
			}
		});
		return node;
	}

	removeLink(link: LinkModel | string) {
		this.linksLayer.removeEntity(link);
		this.iterateListeners("link removed", (listener, event) => {
			if (listener.linksUpdated) {
				listener.linksUpdated({ ...event, link: link as LinkModel, isCreated: false });
			}
		});
	}

	removeNode(node: NodeModel | string) {
		this.nodesLayer.removeEntity(node);
		this.iterateListeners("node removed", (listener, event) => {
			if (listener.nodesUpdated) {
				listener.nodesUpdated({ ...event, node: node as NodeModel, isCreated: false });
			}
		});
	}

	getLinks(): { [s: string]: LinkModel } {
		return this.linksLayer.getEntities();
	}

	getNodes(): { [s: string]: NodeModel } {
		return this.nodesLayer.getEntities();
	}
}
