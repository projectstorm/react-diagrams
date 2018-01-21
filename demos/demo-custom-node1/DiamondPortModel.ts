import * as SRD from "../../src/main";
import * as _ from "lodash";
import {LinkModel} from "../../src/models/LinkModel";

export class DiamondPortModel extends SRD.PortModel {
	position: string | "top" | "bottom" | "left" | "right";

	constructor(pos: string = "top") {
		super(pos);
		this.position = pos;
	}

	serialize() {
		return _.merge(super.serialize(), {
			position: this.position
		});
	}

	deSerialize(data: any) {
		super.deSerialize(data);
		this.position = data.position;
	}

	createLinkModel(): LinkModel{
		return new SRD.DefaultLinkModel();
	}
}
