import { DiagramEngine, LabelModel, LabelModelGenerics } from '@projectstorm/react-diagrams-core';
import { LabelModelOptions } from '@projectstorm/react-diagrams-core/src/models/LabelModel';

export interface DefaultLabelModelOptions extends LabelModelOptions {
	label?: string;
}

export interface DefaultLabelModelGenerics extends LabelModelGenerics {
	OPTIONS: DefaultLabelModelOptions;
}

export class DefaultLabelModel extends LabelModel<DefaultLabelModelGenerics> {
	constructor(options: DefaultLabelModelOptions = {}) {
		super({
			...options,
			offsetY: options.offsetY == null ? -23 : options.offsetY,
			type: 'default'
		});
	}

	setLabel(label: string) {
		this.options.label = label;
	}

	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
		this.options.label = ob.label;
	}

	serialize() {
		return {
			...super.serialize(),
			label: this.options.label
		};
	}
}
