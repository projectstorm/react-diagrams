import { CanvasModel } from './entities/canvas/CanvasModel';
import { FactoryBank } from './core/FactoryBank';
import { AbstractReactFactory } from './core/AbstractReactFactory';
import { LayerModel } from './entities/layer/LayerModel';
import { BaseListener, BaseObserver } from './core/BaseObserver';
import { MouseEvent } from 'react';
import { BaseModel } from './core-models/BaseModel';
import { Point } from '@projectstorm/geometry';
import { ActionEventBus } from './core-actions/ActionEventBus';
import { ZoomCanvasAction } from './actions/ZoomCanvasAction';
import { DeleteItemsAction } from './actions/DeleteItemsAction';
import { StateMachine } from './core-state/StateMachine';

export interface CanvasEngineListener extends BaseListener {
	canvasReady?(): void;

	repaintCanvas?(): void;

	rendered?(): void;
}

export interface CanvasEngineOptions {
	registerDefaultDeleteItemsAction?: boolean;
	registerDefaultZoomCanvasAction?: boolean;
}

export class CanvasEngine<
	L extends CanvasEngineListener = CanvasEngineListener,
	M extends CanvasModel = CanvasModel
> extends BaseObserver<L> {
	protected model: M;
	protected layerFactories: FactoryBank<AbstractReactFactory<LayerModel>>;
	protected canvas: HTMLDivElement;
	protected eventBus: ActionEventBus;
	protected stateMachine: StateMachine;
	protected options: CanvasEngineOptions;

	constructor(options: CanvasEngineOptions = {}) {
		super();
		this.model = null;
		this.eventBus = new ActionEventBus(this);
		this.stateMachine = new StateMachine(this);
		this.layerFactories = new FactoryBank();
		this.registerFactoryBank(this.layerFactories);
		this.options = {
			registerDefaultDeleteItemsAction: true,
			registerDefaultZoomCanvasAction: true,
			...options
		};
		if (this.options.registerDefaultZoomCanvasAction === true) {
			this.eventBus.registerAction(new ZoomCanvasAction());
		}
		if (this.options.registerDefaultDeleteItemsAction === true) {
			this.eventBus.registerAction(new DeleteItemsAction());
		}
	}

	getStateMachine() {
		return this.stateMachine;
	}

	getRelativeMousePoint(event: { clientX: number; clientY: number }): Point {
		const point = this.getRelativePoint(event.clientX, event.clientY);
		return new Point(
			(point.x - this.model.getOffsetX()) / (this.model.getZoomLevel() / 100.0),
			(point.y - this.model.getOffsetY()) / (this.model.getZoomLevel() / 100.0)
		);
	}

	getRelativePoint(x, y): Point {
		const canvasRect = this.canvas.getBoundingClientRect();
		return new Point(x - canvasRect.left, y - canvasRect.top);
	}

	registerFactoryBank(factory: FactoryBank) {
		factory.registerListener({
			factoryAdded: event => {
				event.factory.setDiagramEngine(this);
			},
			factoryRemoved: event => {
				event.factory.setDiagramEngine(null);
			}
		});
	}

	getActionEventBus() {
		return this.eventBus;
	}

	getLayerFactories() {
		return this.layerFactories;
	}

	getFactoryForLayer<F extends AbstractReactFactory<LayerModel>>(layer: LayerModel | string) {
		if (typeof layer === 'string') {
			return this.layerFactories.getFactory(layer);
		}
		return this.layerFactories.getFactory(layer.getType());
	}

	setModel(model: M) {
		this.model = model;
		if (this.canvas) {
			requestAnimationFrame(() => {
				this.repaintCanvas();
			});
		}
	}

	getModel(): M {
		return this.model;
	}

	repaintCanvas(promise: true): Promise<any>;
	repaintCanvas(): void;
	repaintCanvas(promise?): Promise<any> | void {
		const repaint = () => {
			this.iterateListeners(listener => {
				if (listener.repaintCanvas) {
					listener.repaintCanvas();
				}
			});
		};

		if (promise) {
			return new Promise(resolve => {
				const l = this.registerListener({
					rendered: () => {
						resolve();
						l.deregister();
					}
				} as L);
				repaint();
			});
		}
		repaint();
	}

	setCanvas(canvas?: HTMLDivElement) {
		if (this.canvas !== canvas) {
			this.canvas = canvas;
			if (canvas) {
				this.fireEvent({}, 'canvasReady');
			}
		}
	}

	getCanvas() {
		return this.canvas;
	}

	getMouseElement(event: MouseEvent): BaseModel {
		return null;
	}

	zoomToFit() {
		const xFactor = this.canvas.clientWidth / this.canvas.scrollWidth;
		const yFactor = this.canvas.clientHeight / this.canvas.scrollHeight;
		const zoomFactor = xFactor < yFactor ? xFactor : yFactor;

		this.model.setZoomLevel(this.model.getZoomLevel() * zoomFactor);
		this.model.setOffset(0, 0);
		this.repaintCanvas();
	}
}
