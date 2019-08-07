import { BaseModel, BaseModelGenerics, BaseModelOptions } from '../../core-models/BaseModel';
import { CanvasModel } from '../canvas/CanvasModel';
import * as _ from 'lodash';

export interface LayerModelOptions extends BaseModelOptions {
	isSvg?: boolean;
	transformed?: boolean;
}

export interface LayerModelGenerics extends BaseModelGenerics {
	OPTIONS: LayerModelOptions;
	PARENT: CanvasModel;
	CHILDREN: BaseModel;
}

export class LayerModel<G extends LayerModelGenerics = LayerModelGenerics> extends BaseModel<G> {
	protected models: { [id: string]: G['CHILDREN'] };
	protected repaintEnabled: boolean;

	constructor(options: G['OPTIONS'] = {}) {
		super(options);
		this.models = {};
		this.repaintEnabled = true;
	}

	isRepaintEnabled() {
		return this.repaintEnabled;
	}

	allowRepaint(allow: boolean = true) {
		this.repaintEnabled = allow;
	}

	remove() {
		if (this.parent) {
			this.parent.removeLayer(this);
		}
		super.remove();
	}

	addModel(model: G['CHILDREN']) {
		model.setParent(this);
		this.models[model.getID()] = model;
	}

	getModels() {
		return this.models;
	}

	getModel(id: string) {
		return this.models[id];
	}

	removeModel(id: string | G['CHILDREN']): boolean {
		const _id = typeof id === 'string' ? id : id.getID();
		if (this.models[_id]) {
			delete this.models[_id];
			return true;
		}
		return false;
	}

	getSelectedEntities(): Array<BaseModel> {
		return super.getSelectedEntities().concat(
			_.flatMap(this.models, entity => {
				return entity.getSelectedEntities();
			})
		);
	}
}
