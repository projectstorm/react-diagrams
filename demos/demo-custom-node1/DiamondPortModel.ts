import * as _ from "lodash";
import {LinkModel} from "../../src/models/LinkModel";
import {DiagramEngine} from "../../src/DiagramEngine";
import {PortModel} from "../../src/models/PortModel";
import {DefaultLinkModel} from "../../src/defaults/models/DefaultLinkModel";

export class DiamondPortModel extends PortModel {
	position: string | "top" | "bottom" | "left" | "right";

	constructor(pos: string = "top") {
		super(pos, "diamond");
		this.position = pos;
	}

	serialize() {
		return _.merge(super.serialize(), {
			position: this.position
		});
	}

	deSerialize(data: any, engine: DiagramEngine) {
		super.deSerialize(data, engine);
		this.position = data.position;
	}

	createLinkModel(): LinkModel{
		return new DefaultLinkModel();
	}
}
