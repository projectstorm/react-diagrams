import { DefaultPortModel } from "./DefaultPortModel";
import * as _ from "lodash";

import { AbstractInstanceFactory } from "../AbstractInstanceFactory";
import { NodeModel } from "../models/NodeModel";

export class DefaultNodeInstanceFactory extends AbstractInstanceFactory<DefaultNodeModel> {
	constructor() {
		super("DefaultNodeModel");
	}

	getInstance() {
		return new DefaultNodeModel();
	}
}

/**
 * @author Dylan Vorster
 */
export class DefaultNodeModel extends NodeModel {
	name: string;
	color: string;
	ports: { [s: string]: DefaultPortModel };

	constructor(name: string = "Untitled", color: string = "rgb(0,192,255)") {
		super("default");
		this.name = name;
		this.color = color;
	}

	deSerialize(object) {
		super.deSerialize(object);
		this.name = object.name;
		this.color = object.color;
	}

	serialize() {
		return _.merge(super.serialize(), {
			name: this.name,
			color: this.color
		});
	}

	getInPorts(): DefaultPortModel[] {
		return _.filter(this.ports, portModel => {
			return portModel.in;
		});
	}

	getOutPorts(): DefaultPortModel[] {
		return _.filter(this.ports, portModel => {
			return !portModel.in;
		});
	}
}
