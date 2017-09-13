import {
	LinkModel,
	NodeModel,
	BaseModel,
	BaseModelListener,
	PortModel
} from "./Common";
import { BaseListener, BaseEntity } from "./BaseEntity";
import * as _ from "lodash";
import { DiagramEngine } from "./DiagramEngine";
/**
 * @author Dylan Vorster
 *
 */
export interface DiagramListener extends BaseListener {
	nodesUpdated?(node: any, isCreated: boolean): void;

	linksUpdated?(link: any, isCreated: boolean): void;

	/**
	 * @deprecated
	 */
	controlsUpdated?(): void;

	offsetUpdated?(model: DiagramModel, offsetX: number, offsetY: number): void;

	zoomUpdated?(model: DiagramModel, zoom: number): void;

	gridUpdated?(model: DiagramModel, size: number): void;
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
		this.iterateListeners(listener => {
			listener.gridUpdated && listener.gridUpdated(this, size);
		});
	}

	getGridPosition(pos) {
		if (this.gridSize === 0) {
			return pos;
		}
		return this.gridSize * Math.floor((pos +(this.gridSize/2)) / this.gridSize);
	}

	deSerializeDiagram(object: any, diagramEngine: DiagramEngine) {
		this.deSerialize(object);

		this.offsetX = object.offsetX;
		this.offsetY = object.offsetY;
		this.zoom = object.zoom;

		//deserialize nodes
		_.forEach(object.nodes, (node: any) => {
			let nodeOb = diagramEngine
				.getInstanceFactory(node._class)
				.getInstance(node) as NodeModel;
			nodeOb.deSerialize(node);
			//deserialize ports
			_.forEach(node.ports, (port: any) => {
				let portOb = diagramEngine
					.getInstanceFactory(port._class)
					.getInstance() as PortModel;
				portOb.deSerialize(port);
				nodeOb.addPort(portOb);
			});

			this.addNode(nodeOb);
		});

		_.forEach(object.links, (link: any) => {
			let linkOb = diagramEngine
				.getInstanceFactory(link._class)
				.getInstance() as LinkModel;
			linkOb.deSerialize(link);

			if (link.target) {
				linkOb.setTargetPort(
					this.getNode(link.target).getPortFromID(link.targetPort)
				);
			}

			if (link.source) {
				linkOb.setSourcePort(
					this.getNode(link.source).getPortFromID(link.sourcePort)
				);
			}

			this.addLink(linkOb);
		});
	}

	serializeDiagram() {
		return _.merge(this.serialize(), {
			offsetX: this.offsetX,
			offsetY: this.offsetY,
			zoom: this.zoom,
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

	getSelectedItems(): BaseModel<BaseModelListener>[] {
		var items = [];

		// run through nodes
		items = items.concat(
			_.flatMap(this.nodes,(node) => {
				return node.getSelectedEntities();
			})
		);

		// find all the links
		items = items.concat(
			_.flatMap(this.links,(link) => {
				return link.getSelectedEntities();
			})
		);

		//find all points
		items = items.concat(
			_.flatMap(this.links, link => {
				return _.flatMap(link.points,(point) => {
					return point.getSelectedEntities();
				});
			})
		);

		return _.uniq(items);
	}

	setZoomLevel(zoom: number) {
		this.zoom = zoom;
		this.iterateListeners(listener => {
			if (listener.controlsUpdated) listener.controlsUpdated();
		});
		this.iterateListeners(listener => {
			listener.zoomUpdated && listener.zoomUpdated(this, this.zoom);
		});
	}

	setOffset(offsetX: number, offsetY: number) {
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		this.iterateListeners(listener => {
			if (listener.controlsUpdated) listener.controlsUpdated();
		});
		this.iterateListeners(listener => {
			listener.offsetUpdated &&
				listener.offsetUpdated(this, this.offsetX, this.offsetY);
		});
	}

	setOffsetX(offsetX: number) {
		this.offsetX = offsetX;
		this.iterateListeners(listener => {
			if (listener.controlsUpdated) listener.controlsUpdated();
		});
		this.iterateListeners(listener => {
			listener.offsetUpdated &&
				listener.offsetUpdated(this, this.offsetX, this.offsetY);
		});
	}
	setOffsetY(offsetY: number) {
		this.offsetX = offsetY;
		this.iterateListeners(listener => {
			if (listener.controlsUpdated) listener.controlsUpdated();
		});
		this.iterateListeners(listener => {
			listener.offsetUpdated &&
				listener.offsetUpdated(this, this.offsetX, this.offsetY);
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

	addLink(link: LinkModel): LinkModel {
		link.addListener({
			entityRemoved: () => {
				this.removeLink(link);
			}
		});
		this.links[link.getID()] = link;
		this.iterateListeners(listener => {
			if (listener.linksUpdated) listener.linksUpdated(link, true);
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
		this.iterateListeners(listener => {
			if (listener.nodesUpdated) listener.nodesUpdated(node, true);
		});
		return node;
	}

	removeLink(link: LinkModel | string) {
		if (link instanceof LinkModel) {
			delete this.links[link.getID()];
			this.iterateListeners(listener => {
				if (listener.linksUpdated) listener.linksUpdated(link, false);
			});
			return;
		}
		delete this.links["" + link];
		this.iterateListeners(listener => {
			if (listener.linksUpdated) listener.linksUpdated(link, false);
		});
	}
	removeNode(node: NodeModel | string) {
		if (node instanceof NodeModel) {
			delete this.nodes[node.getID()];
			this.iterateListeners(listener => {
				if (listener.nodesUpdated) listener.nodesUpdated(node, false);
			});
			return;
		}

		delete this.nodes["" + node];
		this.iterateListeners(listener => {
			if (listener.nodesUpdated) listener.nodesUpdated(node, false);
		});
	}

	getLinks(): { [s: string]: LinkModel } {
		return this.links;
	}

	getNodes(): { [s: string]: NodeModel } {
		return this.nodes;
	}
}
