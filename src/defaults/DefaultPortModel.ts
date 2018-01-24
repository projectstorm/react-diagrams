import * as _ from "lodash";
import { PortModel } from "../models/PortModel";

/**
 * @author Dylan Vorster
 */
export class DefaultPortModel extends PortModel {
	in: boolean;
	label: string;

	constructor(isInput: boolean, name: string, label: string = null, id?: string) {
		super(name, "default", id, isInput ? null : 1);
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

	canLinkToPort(port: PortModel): boolean {
		return port instanceof DefaultPortModel && this.in !== port.in;
	}
}
