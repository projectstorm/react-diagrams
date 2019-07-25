import { BaseModel, BaseModelGenerics } from "../core-models/BaseModel";
import * as _ from 'lodash';
import { DiagramEngine } from '../DiagramEngine';

export class LabelModel<G extends BaseModelGenerics = BaseModelGenerics> extends BaseModel<G> {

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
		return _.merge(super.serialize(), {
			offsetX: this.offsetX,
			offsetY: this.offsetY
		});
	}
}
