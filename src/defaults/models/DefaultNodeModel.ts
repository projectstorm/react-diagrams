import { DefaultPortModel } from "./DefaultPortModel";
import * as _ from "lodash";

import { NodeModel, NodeModelListener } from "../../models/NodeModel";
import { Toolkit } from "../../Toolkit";
import { DiagramEngine } from "../../DiagramEngine";

/**
 * @author Dylan Vorster
 */
export class DefaultNodeModel extends NodeModel<NodeModelListener> {
	name: string;
	color: string;
	ports: { [s: string]: DefaultPortModel };

	constructor(name: string = "Untitled", color: string = "rgb(0,192,255)") {
		super("default");
		this.name = name;
		this.color = color;
	}

	addInPort(label: string, id: string = ""): DefaultPortModel {
		return this.addPort(new DefaultPortModel(true, id || Toolkit.UID(), label));
	}

	addOutPort(label: string, id: string = ""): DefaultPortModel {
		return this.addPort(new DefaultPortModel(false, id || Toolkit.UID(), label));
	}

	deSerialize(object, engine: DiagramEngine) {
		super.deSerialize(object, engine);
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
