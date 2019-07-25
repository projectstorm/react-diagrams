import { BaseEntity, BaseEntityEvent, BaseEntityListener, BaseEntityType } from '../BaseEntity';
import * as _ from 'lodash';
import { DiagramEngine } from '../DiagramEngine';
import { LinkModel } from './LinkModel';
import { NodeModel } from './NodeModel';
import { PortModel } from './PortModel';
import { BaseModel, BaseModelListener } from './BaseModel';
import { PointModel } from './PointModel';

export interface DiagramListener extends BaseEntityListener {
	nodesUpdated?(event: BaseEntityEvent & { node: NodeModel; isCreated: boolean }): void;

	linksUpdated?(event: BaseEntityEvent & { link: LinkModel; isCreated: boolean }): void;

	offsetUpdated?(event: BaseEntityEvent<DiagramModel> & { offsetX: number; offsetY: number }): void;

	zoomUpdated?(event: BaseEntityEvent<DiagramModel> & { zoom: number }): void;

	gridUpdated?(event: BaseEntityEvent<DiagramModel> & { size: number }): void;
}

export class DiagramModel extends BaseEntity<DiagramListener> {
	//models
	protected links: { [s: string]: LinkModel };
	protected nodes: { [s: string]: NodeModel };

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
		this.fireEvent({ size: size }, 'gridUpdated');
	}

	getGridPosition(pos) {
		if (this.gridSize === 0) {
			return pos;
		}
		return this.gridSize * Math.floor((pos + this.gridSize / 2) / this.gridSize);
	}

	deSerializeDiagram(object: any, diagramEngine: DiagramEngine) {
		this.deSerialize(object, diagramEngine);

		this.offsetX = object.offsetX;
		this.offsetY = object.offsetY;
		this.zoom = object.zoom;
		this.gridSize = object.gridSize;

		// deserialize nodes
		_.forEach(object.nodes, (node: any) => {
			let nodeOb = diagramEngine.getFactoryForNode(node.type).generateModel({ initialConfig: node });
			nodeOb.setParent(this);
			nodeOb.deSerialize(node, diagramEngine);
			this.addNode(nodeOb);
		});

		// deserialze links
		_.forEach(object.links, (link: any) => {
			let linkOb = diagramEngine.getFactoryForLink(link.type).generateModel({ initialConfig: link });
			linkOb.setParent(this);
			linkOb.deSerialize(link, diagramEngine);
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
			nodes: _.map(this.nodes, node => {
				return node.serialize();
			})
		});
	}

	clearSelection(ignore: BaseModel<BaseEntity, BaseModelListener> | null = null) {
		_.forEach(this.getSelectedItems(), element => {
			if (ignore && ignore.getID() === element.getID()) {
				return;
			}
			element.setSelected(false); //TODO dont fire the listener
		});
	}

	getSelectedItems(...filters: BaseEntityType[]): BaseModel<BaseEntity, BaseModelListener>[] {
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
				if (_.includes(filters, 'node') && item instanceof NodeModel) {
					return true;
				}
				if (_.includes(filters, 'link') && item instanceof LinkModel) {
					return true;
				}
				if (_.includes(filters, 'port') && item instanceof PortModel) {
					return true;
				}
				if (_.includes(filters, 'point') && item instanceof PointModel) {
					return true;
				}
				return false;
			});
		}

		return items;
	}

	setZoomLevel(zoom: number) {
		this.zoom = zoom;
		this.fireEvent({ zoom }, 'zoomUpdated');
	}

	setOffset(offsetX: number, offsetY: number) {
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		this.fireEvent({ offsetX, offsetY }, 'offsetUpdated');
	}

	setOffsetX(offsetX: number) {
		this.setOffset(offsetX, this.offsetY);
	}

	setOffsetY(offsetY: number) {
		this.setOffset(this.offsetX, offsetY);
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
		link.registerListener({
			entityRemoved: () => {
				this.removeLink(link);
			}
		});
		this.links[link.getID()] = link;
		this.fireEvent(
			{
				link,
				isCreated: true
			},
			'linksUpdated'
		);
		return link;
	}

	addNode(node: NodeModel): NodeModel {
		node.registerListener({
			entityRemoved: () => {
				this.removeNode(node);
			}
		});
		this.nodes[node.getID()] = node;
		this.fireEvent({ node, isCreated: true }, 'nodesUpdated');
		return node;
	}

	removeLink(link: LinkModel | string) {
		link = this.getLink(link);
		delete this.links[link.getID()];
		this.fireEvent({ link, isCreated: false }, 'linksUpdated');
	}

	removeNode(node: NodeModel | string) {
		node = this.getNode(node);
		delete this.nodes[node.getID()];
		this.fireEvent({ node, isCreated: false }, 'nodesUpdated');
	}

	getLinks(): { [s: string]: LinkModel } {
		return this.links;
	}

	getNodes(): { [s: string]: NodeModel } {
		return this.nodes;
	}
}
