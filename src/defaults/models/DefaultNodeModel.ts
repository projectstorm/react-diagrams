import * as _ from "lodash";
import { DefaultPortModel } from "./DefaultPortModel";
import { NodeModel } from "../../models/NodeModel";
import { Toolkit } from "../../Toolkit";
import { DeserializeEvent } from "@projectstorm/react-canvas";

export class DefaultNodeModel extends NodeModel<DefaultPortModel> {
	protected name: string;
	protected color: string;

	constructor(name: string = "Untitled", color: string = "rgb(0,192,255)") {
		super("default");
		this.name = name;
		this.color = color;
	}

	addInPort(label: string): DefaultPortModel {
		return this.addPort(new DefaultPortModel(true, Toolkit.UID(), label));
	}

	addOutPort(label: string): DefaultPortModel {
		return this.addPort(new DefaultPortModel(false, Toolkit.UID(), label));
	}

	deSerialize(event: DeserializeEvent) {
		super.deSerialize(event);
		this.name = event.data.name;
		this.color = event.data.color;
	}

	serialize() {
		return _.merge(super.serialize(), {
			name: this.name,
			color: this.color
		});
	}

	getInPorts(): DefaultPortModel[] {
		return _.filter(this.getPorts(), portModel => {
			return portModel.in;
		});
	}

	getOutPorts(): DefaultPortModel[] {
		return _.filter(this.getPorts(), portModel => {
			return !portModel.in;
		});
	}
}
