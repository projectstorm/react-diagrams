import {
	BaseEntity,
	BaseEntityEvent,
	BaseEntityGenerics,
	BaseEntityListener,
	BaseEntityOptions,
	BaseEntityType
} from '../core-models/BaseEntity';
import * as _ from 'lodash';
import { DiagramEngine } from '../DiagramEngine';
import { LinkModel } from './LinkModel';
import { NodeModel } from './NodeModel';
import { PortModel } from './PortModel';
import { BaseModel } from '../core-models/BaseModel';
import { PointModel } from './PointModel';

export interface DiagramListener extends BaseEntityListener {
	nodesUpdated?(event: BaseEntityEvent & { node: NodeModel; isCreated: boolean }): void;

	linksUpdated?(event: BaseEntityEvent & { link: LinkModel; isCreated: boolean }): void;

	offsetUpdated?(event: BaseEntityEvent<DiagramModel> & { offsetX: number; offsetY: number }): void;

	zoomUpdated?(event: BaseEntityEvent<DiagramModel> & { zoom: number }): void;

	gridUpdated?(event: BaseEntityEvent<DiagramModel> & { size: number }): void;
}

export interface DiagramModelOptions extends BaseEntityOptions {
	offsetX?: number;
	offsetY?: number;
	zoom?: number;
	gridSize?: number;
}

export interface DiagramModelGenerics extends BaseEntityGenerics {
	LISTENER: DiagramListener;
	OPTIONS: DiagramModelOptions;
}

export class DiagramModel<G extends DiagramModelGenerics = DiagramModelGenerics> extends BaseEntity<G> {
	//models
	protected links: { [s: string]: LinkModel };
	protected nodes: { [s: string]: NodeModel };

	rendered: boolean;

	constructor(options: G['OPTIONS'] = {}) {
		super({
			zoom: 100,
			gridSize: 0,
			offsetX: 0,
			offsetY: 0,
			...options
		});

		this.links = {};
		this.nodes = {};
		this.rendered = false;
	}

	setGridSize(size: number = 0) {
		this.options.gridSize = size;
		this.fireEvent({ size: size }, 'gridUpdated');
	}

	getGridPosition(pos) {
		if (this.options.gridSize === 0) {
			return pos;
		}
		return this.options.gridSize * Math.floor((pos + this.options.gridSize / 2) / this.options.gridSize);
	}

	deSerializeDiagram(object: any, diagramEngine: DiagramEngine) {
		this.deSerialize(object, diagramEngine);

		this.options.offsetX = object.offsetX;
		this.options.offsetY = object.offsetY;
		this.options.zoom = object.zoom;
		this.options.gridSize = object.gridSize;

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
		return {
			...this.serialize(),
			offsetX: this.options.offsetX,
			offsetY: this.options.offsetY,
			zoom: this.options.zoom,
			gridSize: this.options.gridSize,
			links: _.map(this.links, link => {
				return link.serialize();
			}),
			nodes: _.map(this.nodes, node => {
				return node.serialize();
			})
		};
	}

	clearSelection(ignore: BaseModel | null = null) {
		_.forEach(this.getSelectedItems(), element => {
			if (ignore && ignore.getID() === element.getID()) {
				return;
			}
			element.setSelected(false); //TODO dont fire the listener
		});
	}

	getSelectedItems(...filters: BaseEntityType[]): BaseModel[] {
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
				return _.flatMap(link.getPoints(), point => {
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
		this.options.zoom = zoom;
		this.fireEvent({ zoom }, 'zoomUpdated');
	}

	setOffset(offsetX: number, offsetY: number) {
		this.options.offsetX = offsetX;
		this.options.offsetY = offsetY;
		this.fireEvent({ offsetX, offsetY }, 'offsetUpdated');
	}

	setOffsetX(offsetX: number) {
		this.setOffset(offsetX, this.options.offsetY);
	}

	setOffsetY(offsetY: number) {
		this.setOffset(this.options.offsetX, offsetY);
	}

	getOffsetY() {
		return this.options.offsetY;
	}

	getOffsetX() {
		return this.options.offsetX;
	}

	getZoomLevel() {
		return this.options.zoom;
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
