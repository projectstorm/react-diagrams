import * as _ from "lodash";
import { PortModel } from "../../models/PortModel";
import { DefaultLinkModel } from "./DefaultLinkModel";
import { LinkModel } from "../../models/LinkModel";
import { DeserializeEvent } from "@projectstorm/react-canvas";

export class DefaultPortModel extends PortModel {
	in: boolean;
	label: string;
	links: { [id: string]: DefaultLinkModel };

	constructor(isInput: boolean, name: string, label: string = null) {
		super(name, "default");
		this.in = isInput;
		this.label = label || name;
	}

	deSerialize(event: DeserializeEvent) {
		super.deSerialize(event);
		this.in = event.data.in;
		this.label = event.data.label;
	}

	serialize() {
		return _.merge(super.serialize(), {
			in: this.in,
			label: this.label
		});
	}

	link(port: PortModel): LinkModel {
		let link = this.createLinkModel();
		link.setSourcePort(this);
		link.setTargetPort(port);
		return link;
	}

	canLinkToPort(port: PortModel): boolean {
		if (port instanceof DefaultPortModel) {
			return this.in !== port.in;
		}
		return true;
	}

	createLinkModel(): LinkModel {
		let link = super.createLinkModel();
		return link || new DefaultLinkModel();
	}
}
