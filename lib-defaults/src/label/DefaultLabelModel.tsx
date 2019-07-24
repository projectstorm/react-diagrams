import { DiagramEngine, LabelModel } from '@projectstorm/react-diagrams-core';

export class DefaultLabelModel extends LabelModel {
	label: string;

	constructor() {
		super('default');
		this.offsetY = -23;
	}

	setLabel(label: string) {
		this.label = label;
	}

	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
		this.label = ob.label;
	}

	serialize() {
		return {
			...super.serialize(),
			label: this.label
		};
	}
}
