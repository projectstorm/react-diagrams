import {
	BaseModelGenerics,
	BaseModelOptions,
	DiagramEngine,
	LabelModel,
} from "@projectstorm/react-diagrams-core";

export interface DefaultLabelModelOptions extends Omit<BaseModelOptions, 'type'>{
	label?: string;
}

export interface DefaultLabelModelGenerics{
	OPTIONS: DefaultLabelModelOptions;
}

export class DefaultLabelModel extends LabelModel<BaseModelGenerics & DefaultLabelModelGenerics> {

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
