import { DiagramEngine, LabelModel, LabelModelGenerics, LabelModelOptions } from '@projectstorm/react-diagrams-core';
import { DeserializeEvent } from '@projectstorm/react-canvas-core';

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

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.options.label = event.data.label;
	}

	serialize() {
		return {
			...super.serialize(),
			label: this.options.label
		};
	}
}
