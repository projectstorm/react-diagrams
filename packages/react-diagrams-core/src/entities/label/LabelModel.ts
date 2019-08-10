import { DiagramEngine } from '../../DiagramEngine';
import { LinkModel } from '../link/LinkModel';
import { BaseModel, BaseModelGenerics, BaseModelOptions, DeserializeEvent } from '@projectstorm/react-canvas-core';

export interface LabelModelOptions extends BaseModelOptions {
	offsetX?: number;
	offsetY?: number;
}

export interface LabelModelGenerics extends BaseModelGenerics {
	PARENT: LinkModel;
	OPTIONS: LabelModelOptions;
}

export class LabelModel<G extends LabelModelGenerics = LabelModelGenerics> extends BaseModel<G> {
	constructor(options: G['OPTIONS']) {
		super({
			...options,
			offsetX: options.offsetX || 0,
			offsetY: options.offsetY || 0
		});
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.options.offsetX = event.data.offsetX;
		this.options.offsetY = event.data.offsetY;
	}

	serialize() {
		return {
			...super.serialize(),
			offsetX: this.options.offsetX,
			offsetY: this.options.offsetY
		};
	}
}
