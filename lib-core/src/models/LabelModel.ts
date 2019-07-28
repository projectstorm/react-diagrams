import { BaseModel, BaseModelGenerics } from '../core-models/BaseModel';
import { DiagramEngine } from '../DiagramEngine';
import { LinkModel } from './LinkModel';

export interface LabelModelGenerics extends BaseModelGenerics {
	PARENT: LinkModel;
}

export class LabelModel<G extends LabelModelGenerics = LabelModelGenerics> extends BaseModel<G> {
	offsetX: number;
	offsetY: number;

	constructor(options: G['OPTIONS']) {
		super(options);
		this.offsetX = 0;
		this.offsetY = 0;
	}

	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
		this.offsetX = ob.offsetX;
		this.offsetY = ob.offsetY;
	}

	serialize() {
		return {
			...super.serialize(),
			offsetX: this.offsetX,
			offsetY: this.offsetY
		};
	}
}
