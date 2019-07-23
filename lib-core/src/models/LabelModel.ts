import { BaseModel } from "./BaseModel";
import { LinkModel } from "./LinkModel";
import * as _ from "lodash";
import { DiagramEngine } from "../DiagramEngine";

export class LabelModel extends BaseModel<LinkModel> {
	offsetX: number;
	offsetY: number;

	constructor(type?: string, id?: string) {
		super(type, id);
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
