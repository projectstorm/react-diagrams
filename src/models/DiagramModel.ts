import { BaseListener, BaseEntity, BaseEvent, BaseEntityType } from "../BaseEntity";
import * as _ from "lodash";
import { DiagramEngine } from "../DiagramEngine";
import { LinkModel } from "./LinkModel";
import { NodeModel } from "./NodeModel";
import { PortModel } from "./PortModel";
import { BaseModel, BaseModelListener } from "./BaseModel";
import { PointModel } from "./PointModel";
/**
 * @author Dylan Vorster
 *
 */
export interface DiagramListener extends BaseListener {
	nodesUpdated?(event: BaseEvent & { node: NodeModel; isCreated: boolean }): void;

	linksUpdated?(event: BaseEvent & { link: LinkModel; isCreated: boolean }): void;

	offsetUpdated?(event: BaseEvent<DiagramModel> & { offsetX: number; offsetY: number }): void;

	zoomUpdated?(event: BaseEvent<DiagramModel> & { zoom: number }): void;

	gridUpdated?(event: BaseEvent<DiagramModel> & { size: number }): void;
}

/**
 *
 */
export class DiagramModel extends BaseEntity<DiagramListener> {
	//models
	links: { [s: string]: LinkModel };
	nodes: { [s: string]: NodeModel };

	//control variables
	offsetX: number;
	offsetY: number;
	zoom: number;
	rendered: boolean;
	gridSize: number;

	constructor() {
		super();

		this.links = {};
		this.nodes = {};

		this.offsetX = 0;
		this.offsetY = 0;
		this.zoom = 100;
		this.rendered = false;
		this.gridSize = 0;
	}

	setGridSize(size: number = 0) {
		this.gridSize = size;
		this.iterateListeners((listener, event) => {
			listener.gridUpdated && listener.gridUpdated({ ...event, size: size });
		});
	}

	getGridPosition(pos) {
		if (this.gridSize === 0) {
			return pos;
		}
		return this.gridSize * Math.floor((pos + this.gridSize / 2) / this.gridSize);
	}

	deSerializeDiagram(object: any, diagramEngine: DiagramEngine) {
		this.deSerialize(object);

		this.offsetX = object.offsetX;
		this.offsetY = object.offsetY;
		this.zoom = object.zoom;
		this.gridSize = object.gridSize;

		//deserialize nodes
		_.forEach(object.nodes, (node: any) => {
			let nodeOb = diagramEngine.getNodeFactory(node.type).getNewInstance(node);
			nodeOb.deSerialize(node);
			//deserialize ports
			_.forEach(node.ports, (port: any) => {
				let portOb = diagramEngine.getPortFactory(port.type).getNewInstance();
				portOb.deSerialize(port);
				nodeOb.addPort(portOb);
			});

			this.addNode(nodeOb);
		});

		_.forEach(object.links, (link: any) => {
			let linkOb = diagramEngine.getLinkFactory(link.type).getNewInstance();
			linkOb.deSerialize(link);

			if (link.target) {
				linkOb.setTargetPort(this.getNode(link.target).getPortFromID(link.targetPort));
			}

			if (link.source) {
				linkOb.setSourcePort(this.getNode(link.source).getPortFromID(link.sourcePort));
			}

			this.addLink(linkOb);
		});
	}

	serializeDiagram() {
		return _.merge(this.serialize(), {
			offsetX: this.offsetX,
			offsetY: this.offsetY,
			zoom: this.zoom,
			gridSize: this.gridSize,
			links: _.map(this.links, link => {
				return link.serialize();
			}),
			nodes: _.map(this.nodes, link => {
				return link.serialize();
			})
		});
	}

	clearSelection(ignore: BaseModel<BaseModelListener> | null = null) {
		_.forEach(this.getSelectedItems(), element => {
			if (ignore && ignore.getID() === element.getID()) {
				return;
			}
			element.setSelected(false); //TODO dont fire the listener
		});
	}

	getSelectedItems(...filters: BaseEntityType[]): BaseModel<BaseModelListener>[] {
		if (!Array.isArray(filters)) {
			filters = [filters];
		}
		var items = [];

		// run through nodes
		items = items.concat(
			_.flatMap(this.nodes, node => {
				return node.getSelectedEntities();
			})
		);

		// find all the links
		items = items.concat(
			_.flatMap(this.links, link => {
				return link.getSelectedEntities();
			})
		);

		//find all points
		items = items.concat(
			_.flatMap(this.links, link => {
				return _.flatMap(link.points, point => {
					return point.getSelectedEntities();
				});
			})
		);

		items = _.uniq(items);

		if (filters.length > 0) {
			items = _.filter(_.uniq(items), (item: BaseModel<any>) => {
				if (_.includes(filters, "node") && item instanceof NodeModel) {
					return true;
				}
				if (_.includes(filters, "link") && item instanceof LinkModel) {
					return true;
				}
				if (_.includes(filters, "port") && item instanceof PortModel) {
					return true;
				}
				if (_.includes(filters, "point") && item instanceof PointModel) {
					return true;
				}
				return false;
			});
		}

		return items;
	}

	setZoomLevel(zoom: number) {
		this.zoom = zoom;

		this.iterateListeners((listener, event) => {
			listener.zoomUpdated && listener.zoomUpdated({ ...event, zoom: zoom });
		});
	}

	setOffset(offsetX: number, offsetY: number) {
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		this.iterateListeners((listener, event) => {
			listener.offsetUpdated && listener.offsetUpdated({ ...event, offsetX: offsetX, offsetY: offsetY });
		});
	}

	setOffsetX(offsetX: number) {
		this.offsetX = offsetX;
		this.iterateListeners((listener, event) => {
			listener.offsetUpdated && listener.offsetUpdated({ ...event, offsetX: offsetX, offsetY: this.offsetY });
		});
	}
	setOffsetY(offsetY: number) {
		this.offsetY = offsetY;

		this.iterateListeners((listener, event) => {
			listener.offsetUpdated &&
				listener.offsetUpdated({ ...event, offsetX: this.offsetX, offsetY: this.offsetY });
		});
	}

	getOffsetY() {
		return this.offsetY;
	}

	getOffsetX() {
		return this.offsetX;
	}

	getZoomLevel() {
		return this.zoom;
	}

	getNode(node: string | NodeModel): NodeModel | null {
		if (node instanceof NodeModel) {
			return node;
		}
		if (!this.nodes[node]) {
			return null;
		}
		return this.nodes[node];
	}

	getLink(link: string | LinkModel): LinkModel | null {
		if (link instanceof LinkModel) {
			return link;
		}
		if (!this.links[link]) {
			return null;
		}
		return this.links[link];
	}

	addAll(...models: BaseModel[]): BaseModel[]{
		_.forEach(models, (model) =>{
			if(model instanceof LinkModel){
				this.addLink(model);
			}else if(model instanceof NodeModel){
				this.addNode(model);
			}
		});
		return models;
	}

	addLink(link: LinkModel): LinkModel {
		link.addListener({
			entityRemoved: () => {
				this.removeLink(link);
			}
		});
		this.links[link.getID()] = link;
		this.iterateListeners((listener, event) => {
			listener.linksUpdated && listener.linksUpdated({ ...event, link: link, isCreated: true });
		});
		return link;
	}

	addNode(node: NodeModel): NodeModel {
		node.addListener({
			entityRemoved: () => {
				this.removeNode(node);
			}
		});
		this.nodes[node.getID()] = node;
		this.iterateListeners((listener, event) => {
			listener.nodesUpdated && listener.nodesUpdated({ ...event, node: node, isCreated: true });
		});
		return node;
	}

	removeLink(link: LinkModel | string) {
		link = this.getLink(link);
		delete this.links[link.getID()];
		this.iterateListeners((listener, event) => {
			listener.linksUpdated && listener.linksUpdated({ ...event, link: link as LinkModel, isCreated: false });
		});
	}

	removeNode(node: NodeModel | string) {
		node = this.getNode(node);
		delete this.nodes[node.getID()];
		this.iterateListeners((listener, event) => {
			listener.nodesUpdated && listener.nodesUpdated({ ...event, node: node as NodeModel, isCreated: false });
		});
	}

	getLinks(): { [s: string]: LinkModel } {
		return this.links;
	}

	getNodes(): { [s: string]: NodeModel } {
		return this.nodes;
	}
}
