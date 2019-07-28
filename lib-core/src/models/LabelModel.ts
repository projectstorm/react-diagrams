import { BaseModel, BaseModelGenerics, BaseModelOptions } from '../core-models/BaseModel';
import { DiagramEngine } from '../DiagramEngine';
import { LinkModel } from './LinkModel';

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

	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
		this.options.offsetX = ob.offsetX;
		this.options.offsetY = ob.offsetY;
	}

	serialize() {
		return {
			...super.serialize(),
			offsetX: this.options.offsetX,
			offsetY: this.options.offsetY
		};
	}
}
