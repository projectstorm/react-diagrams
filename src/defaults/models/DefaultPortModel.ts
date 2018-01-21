import * as _ from "lodash";
import { PortModel } from "../../models/PortModel";
import {LinkModel} from "../../models/LinkModel";
import {DefaultLinkModel} from "./DefaultLinkModel";

/**
 * @author Dylan Vorster
 */
export class DefaultPortModel extends PortModel {
	in: boolean;
	label: string;

	constructor(isInput: boolean, name: string, label: string = null, id?: string) {
		super(name, "default", id);
		this.in = isInput;
		this.label = label || name;
	}

	deSerialize(object) {
		super.deSerialize(object);
		this.in = object.in;
		this.label = object.label;
	}

	serialize() {
		return _.merge(super.serialize(), {
			in: this.in,
			label: this.label
		});
	}

	link(port: PortModel): LinkModel{
		let link = this.createLinkModel();
		link.setSourcePort(this);
		link.setTargetPort(port);
		return link;
	}
}
