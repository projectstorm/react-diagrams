import { LinkModel } from "./LinkModel";
import * as _ from "lodash";
import { DiagramEngine } from "../DiagramEngine";
import {BaseModel} from "@projectstorm/react-canvas";

export class LabelModel extends BaseModel<LinkModel> {
	offsetX: number;
	offsetY: number;

	constructor(type?: string) {
		super(type);
		this.offsetX = 0;
		this.offsetY = 0;
	}

	deSerialize(ob, engine: DiagramEngine, cache: { [id: string]: BaseModel; }) {
		super.deSerialize(ob, engine, cache);
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
