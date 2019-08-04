import { CanvasEngine } from '../../CanvasEngine';
import * as _ from 'lodash';
import {
	BaseEntity,
	BaseEntityEvent,
	BaseEntityGenerics,
	BaseEntityListener,
	BaseEntityOptions
} from '../../core-models/BaseEntity';
import { LayerModel } from '../layer/LayerModel';
import { BaseModel } from '../../core-models/BaseModel';

export interface DiagramListener extends BaseEntityListener {
	offsetUpdated?(event: BaseEntityEvent<CanvasModel> & { offsetX: number; offsetY: number }): void;

	zoomUpdated?(event: BaseEntityEvent<CanvasModel> & { zoom: number }): void;

	gridUpdated?(event: BaseEntityEvent<CanvasModel> & { size: number }): void;
}

export interface DiagramModelOptions extends BaseEntityOptions {
	offsetX?: number;
	offsetY?: number;
	zoom?: number;
	gridSize?: number;
}

export interface CanvasModelGenerics extends BaseEntityGenerics {
	LISTENER: DiagramListener;
	OPTIONS: DiagramModelOptions;
	LAYER: LayerModel;
}

export class CanvasModel<G extends CanvasModelGenerics = CanvasModelGenerics> extends BaseEntity<G> {
	protected layers: G['LAYER'][];

	constructor(options: G['OPTIONS'] = {}) {
		super({
			zoom: 100,
			gridSize: 0,
			offsetX: 0,
			offsetY: 0,
			...options
		});
		this.layers = [];
	}

	getSelectedItems(): BaseModel[] {
		return _.flatMap(this.layers, layer => {
			return layer.getSelectedEntities();
		});
	}

	clearSelection() {
		_.forEach(this.getSelectedItems(), element => {
			element.setSelected(false);
		});
	}

	getModels(): BaseModel[] {
		return _.flatMap(this.layers, layer => {
			return _.values(layer.getModels());
		});
	}

	addLayer(layer: LayerModel) {
		layer.setParent(this);
		layer.registerListener({
			entityRemoved: (event: BaseEntityEvent<BaseModel>): void => {}
		});
		this.layers.push(layer);
	}

	removeLayer(layer: LayerModel) {
		const index = this.layers.indexOf(layer);
		if (index !== -1) {
			this.layers.splice(index, 1);
			return true;
		}
		return false;
	}

	getLayers() {
		return this.layers;
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

	deSerializeDiagram(object: any, diagramEngine: CanvasEngine) {
		this.deSerialize(object, diagramEngine);

		this.options.offsetX = object.offsetX;
		this.options.offsetY = object.offsetY;
		this.options.zoom = object.zoom;
		this.options.gridSize = object.gridSize;
	}

	serializeDiagram() {
		return {
			...this.serialize(),
			offsetX: this.options.offsetX,
			offsetY: this.options.offsetY,
			zoom: this.options.zoom,
			gridSize: this.options.gridSize
		};
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
}
