import {
	BaseModelGenerics,
	BaseModelOptions,
	DiagramEngine,
	LabelModel,
	LabelModelGenerics
} from '@projectstorm/react-diagrams-core';

export interface DefaultLabelModelOptions extends BaseModelOptions {
	label?: string;
}

export interface DefaultLabelModelGenerics extends LabelModelGenerics {
	OPTIONS: DefaultLabelModelOptions;
}

export class DefaultLabelModel extends LabelModel<DefaultLabelModelGenerics> {
	constructor(options: DefaultLabelModelOptions = {}) {
		super({
			...options,
			type: 'default'
		});
		this.offsetY = -23;
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
