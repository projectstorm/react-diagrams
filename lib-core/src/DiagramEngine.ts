import * as _ from 'lodash';
import { BaseEntity } from './core-models/BaseEntity';
import { DiagramModel } from './models/DiagramModel';
import { BaseModel } from './core-models/BaseModel';
import { NodeModel } from './models/NodeModel';
import { PointModel } from './models/PointModel';
import { PortModel } from './models/PortModel';
import { LinkModel } from './models/LinkModel';
import { LabelModel } from './models/LabelModel';
import { FactoryBank } from './core/FactoryBank';
import { AbstractFactory } from './core/AbstractFactory';
import { AbstractReactFactory } from './core/AbstractReactFactory';
import { BaseListener, BaseObserver } from './core/BaseObserver';
import { Point } from '@projectstorm/react-diagrams-geometry';

export interface DiagramEngineListener extends BaseListener {
	repaintCanvas?(): void;

	rendered?(): void;
}

/**
 * Passed as a parameter to the DiagramWidget
 */
export class DiagramEngine extends BaseObserver<DiagramEngineListener> {
	protected nodeFactories: FactoryBank<AbstractReactFactory<NodeModel>>;
	protected linkFactories: FactoryBank<AbstractReactFactory<LinkModel>>;
	protected portFactories: FactoryBank<AbstractFactory<PortModel>>;
	protected labelFactories: FactoryBank<AbstractReactFactory<LabelModel>>;

	diagramModel: DiagramModel;
	canvas: Element;
	paintableWidgets: {};
	linksThatHaveInitiallyRendered: {};
	nodesRendered: boolean;
	maxNumberPointsPerLink: number;

	constructor() {
		super();
		this.diagramModel = new DiagramModel();

		// create banks for the different factory types
		this.nodeFactories = new FactoryBank();
		this.linkFactories = new FactoryBank();
		this.portFactories = new FactoryBank();
		this.labelFactories = new FactoryBank();

		const setup = (factory: FactoryBank) => {
			factory.registerListener({
				factoryAdded: event => {
					event.factory.setDiagramEngine(this);
				},
				factoryRemoved: event => {
					event.factory.setDiagramEngine(null);
				}
			});
		};

		setup(this.nodeFactories);
		setup(this.linkFactories);
		setup(this.portFactories);
		setup(this.labelFactories);

		this.canvas = null;
		this.paintableWidgets = null;
		this.linksThatHaveInitiallyRendered = {};
	}

	repaintCanvas() {
		this.iterateListeners(listener => {
			if (listener.repaintCanvas) {
				listener.repaintCanvas();
			}
		});
	}

	clearRepaintEntities() {
		this.paintableWidgets = null;
	}

	enableRepaintEntities(entities: BaseModel[]) {
		this.paintableWidgets = {};
		entities.forEach(entity => {
			//if a node is requested to repaint, add all of its links
			if (entity instanceof NodeModel) {
				_.forEach(entity.getPorts(), port => {
					_.forEach(port.getLinks(), link => {
						this.paintableWidgets[link.getID()] = true;
					});
				});
			}

			if (entity instanceof PointModel) {
				this.paintableWidgets[entity.getLink().getID()] = true;
			}

			this.paintableWidgets[entity.getID()] = true;
		});
	}

	/**
	 * Checks to see if a model is locked by running through
	 * its parents to see if they are locked first
	 */
	isModelLocked(model: BaseEntity) {
		//always check the diagram model
		if (this.diagramModel.isLocked()) {
			return true;
		}

		return model.isLocked();
	}

	recalculatePortsVisually() {
		this.nodesRendered = false;
		this.linksThatHaveInitiallyRendered = {};
	}

	canEntityRepaint(baseModel: BaseModel) {
		//no rules applied, allow repaint
		if (this.paintableWidgets === null) {
			return true;
		}

		return this.paintableWidgets[baseModel.getID()] !== undefined;
	}

	setCanvas(canvas: Element | null) {
		this.canvas = canvas;
	}

	setDiagramModel(model: DiagramModel) {
		this.diagramModel = model;
		this.recalculatePortsVisually();
	}

	getDiagramModel(): DiagramModel {
		return this.diagramModel;
	}

	//!-------------- FACTORIES ------------

	getNodeFactories(): FactoryBank {
		return this.nodeFactories;
	}

	getLinkFactories(): FactoryBank {
		return this.linkFactories;
	}

	getLabelFactories(): FactoryBank {
		return this.labelFactories;
	}

	getPortFactories(): FactoryBank {
		return this.portFactories;
	}

	getFactoryForNode(node: NodeModel | string) {
		if (typeof node === 'string') {
			return this.nodeFactories.getFactory(node);
		}
		return this.nodeFactories.getFactory(node.getType());
	}

	getFactoryForLink(link: LinkModel | string) {
		if (typeof link === 'string') {
			return this.linkFactories.getFactory(link);
		}
		return this.linkFactories.getFactory(link.getType());
	}

	getFactoryForLabel(label: LabelModel) {
		if (typeof label === 'string') {
			return this.labelFactories.getFactory(label);
		}
		return this.labelFactories.getFactory(label.getType());
	}

	getFactoryForPort(port: PortModel) {
		if (typeof port === 'string') {
			return this.portFactories.getFactory(port);
		}
		return this.portFactories.getFactory(port.getType());
	}

	generateWidgetForLink(link: LinkModel): JSX.Element {
		return this.getFactoryForLink(link).generateReactWidget({ model: link });
	}

	generateWidgetForNode(node: NodeModel): JSX.Element {
		return this.getFactoryForNode(node).generateReactWidget({ model: node });
	}

	getRelativeMousePoint(event): Point {
		var point = this.getRelativePoint(event.clientX, event.clientY);
		return new Point(
			(point.x - this.diagramModel.getOffsetX()) / (this.diagramModel.getZoomLevel() / 100.0),
			(point.y - this.diagramModel.getOffsetY()) / (this.diagramModel.getZoomLevel() / 100.0)
		);
	}

	getRelativePoint(x, y): Point {
		var canvasRect = this.canvas.getBoundingClientRect();
		return new Point(x - canvasRect.left, y - canvasRect.top);
	}

	getNodeElement(node: NodeModel): Element {
		const selector = this.canvas.querySelector(`.node[data-nodeid="${node.getID()}"]`);
		if (selector === null) {
			throw new Error('Cannot find Node element with nodeID: [' + node.getID() + ']');
		}
		return selector;
	}

	getNodePortElement(port: PortModel): any {
		var selector = this.canvas.querySelector(
			`.port[data-name="${port.getName()}"][data-nodeid="${port.getParent().getID()}"]`
		);
		if (selector === null) {
			throw new Error(
				'Cannot find Node Port element with nodeID: [' +
					port.getParent().getID() +
					'] and name: [' +
					port.getName() +
					']'
			);
		}
		return selector;
	}

	getPortCenter(port: PortModel): Point {
		var sourceElement = this.getNodePortElement(port);
		var sourceRect = sourceElement.getBoundingClientRect();

		var rel = this.getRelativePoint(sourceRect.left, sourceRect.top);

		return new Point(
			sourceElement.offsetWidth / 2 +
				(rel.x - this.diagramModel.getOffsetX()) / (this.diagramModel.getZoomLevel() / 100.0),
			sourceElement.offsetHeight / 2 +
				(rel.y - this.diagramModel.getOffsetY()) / (this.diagramModel.getZoomLevel() / 100.0)
		);
	}

	/**
	 * Calculate rectangular coordinates of the port passed in.
	 */
	getPortCoords(
		port: PortModel
	): {
		x: number;
		y: number;
		width: number;
		height: number;
	} {
		const sourceElement = this.getNodePortElement(port);
		const sourceRect = sourceElement.getBoundingClientRect();
		const canvasRect = this.canvas.getBoundingClientRect() as ClientRect;

		return {
			x: (sourceRect.x - this.diagramModel.getOffsetX()) / (this.diagramModel.getZoomLevel() / 100.0) - canvasRect.left,
			y: (sourceRect.y - this.diagramModel.getOffsetY()) / (this.diagramModel.getZoomLevel() / 100.0) - canvasRect.top,
			width: sourceRect.width,
			height: sourceRect.height
		};
	}

	/**
	 * Determine the width and height of the node passed in.
	 * It currently assumes nodes have a rectangular shape, can be overriden for customised shapes.
	 */
	getNodeDimensions(node: NodeModel): { width: number; height: number } {
		if (!this.canvas) {
			return {
				width: 0,
				height: 0
			};
		}

		const nodeElement = this.getNodeElement(node);
		const nodeRect = nodeElement.getBoundingClientRect();

		return {
			width: nodeRect.width,
			height: nodeRect.height
		};
	}

	getMaxNumberPointsPerLink(): number {
		return this.maxNumberPointsPerLink;
	}

	setMaxNumberPointsPerLink(max: number) {
		this.maxNumberPointsPerLink = max;
	}

	zoomToFit() {
		const xFactor = this.canvas.clientWidth / this.canvas.scrollWidth;
		const yFactor = this.canvas.clientHeight / this.canvas.scrollHeight;
		const zoomFactor = xFactor < yFactor ? xFactor : yFactor;

		this.diagramModel.setZoomLevel(this.diagramModel.getZoomLevel() * zoomFactor);
		this.diagramModel.setOffset(0, 0);
		this.repaintCanvas();
	}
}
