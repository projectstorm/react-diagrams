import { LinkModel } from "./LinkModel";
import * as _ from "lodash";
import { BaseModel, DeserializeEvent } from "@projectstorm/react-canvas";

export class LabelModel extends BaseModel<LinkModel> {
	offsetX: number;
	offsetY: number;

	constructor(type?: string) {
		super(type);
		this.offsetX = 0;
		this.offsetY = 0;
	}

	deSerialize(event: DeserializeEvent) {
		super.deSerialize(event);
		this.offsetX = event.data.offsetX;
		this.offsetY = event.data.offsetY;
	}

	serialize() {
		return _.merge(super.serialize(), {
			offsetX: this.offsetX,
			offsetY: this.offsetY
		});
	}
}
