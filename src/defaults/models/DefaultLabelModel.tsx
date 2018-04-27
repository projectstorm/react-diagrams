import { LabelModel } from "../../models/LabelModel";
import * as _ from "lodash";
import { DiagramEngine } from "../../DiagramEngine";

export class DefaultLabelModel extends LabelModel {
	protected label: string;

	constructor() {
		super("default");
		this.offsetY = -23;
	}

	setLabel(label: string) {
		this.label = label;
	}

	deSerialize(ob, engine: DiagramEngine, cache) {
		super.deSerialize(ob, engine, cache);
		this.label = ob.label;
	}

	serialize() {
		return _.merge(super.serialize(), {
			label: this.label
		});
	}
}
