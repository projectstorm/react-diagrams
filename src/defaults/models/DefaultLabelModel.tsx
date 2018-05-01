import { LabelModel } from "../../models/LabelModel";
import * as _ from "lodash";
import { DeserializeEvent } from "@projectstorm/react-canvas";

export class DefaultLabelModel extends LabelModel {
	protected label: string;

	constructor() {
		super("default");
		this.offsetY = -23;
	}

	setLabel(label: string) {
		this.label = label;
	}

	deSerialize(event: DeserializeEvent) {
		super.deSerialize(event);
		this.label = event.data.label;
	}

	serialize() {
		return _.merge(super.serialize(), {
			label: this.label
		});
	}
}
