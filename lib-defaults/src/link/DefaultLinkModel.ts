import {
	BaseEntityEvent,
	BaseModelOptions,
	DiagramEngine,
	LabelModel,
	LinkModel,
	LinkModelGenerics,
	LinkModelListener
} from '@projectstorm/react-diagrams-core';
import { DefaultLabelModel } from '../label/DefaultLabelModel';

export interface DefaultLinkModelListener extends LinkModelListener {
	colorChanged?(event: BaseEntityEvent<DefaultLinkModel> & { color: null | string }): void;

	widthChanged?(event: BaseEntityEvent<DefaultLinkModel> & { width: 0 | number }): void;
}

export interface DefaultLinkModelOptions extends Omit<BaseModelOptions, 'type'> {
	width?: number;
	color?: string;
	curvyness?: number;
}

export interface DefaultLinkModelGenerics {
	LISTENER: DefaultLinkModelListener;
	OPTIONS: DefaultLinkModelOptions;
}

export class DefaultLinkModel extends LinkModel<LinkModelGenerics & DefaultLinkModelGenerics> {
	constructor(options: DefaultLinkModelOptions = {}) {
		super({
			width: options.width || 3,
			color: options.color || 'gray',
			...options,
			type: 'default'
		});
	}

	serialize() {
		return {
			...super.serialize(),
			width: this.options.width,
			color: this.options.color,
			curvyness: this.options.curvyness
		};
	}

	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
		this.options.color = ob.color;
		this.options.width = ob.width;
		this.options.curvyness = ob.curvyness;
	}

	addLabel(label: LabelModel | string) {
		if (label instanceof LabelModel) {
			return super.addLabel(label);
		}
		let labelOb = new DefaultLabelModel();
		labelOb.setLabel(label);
		return super.addLabel(labelOb);
	}

	setWidth(width: number) {
		this.options.width = width;
		this.fireEvent({ width }, 'widthChanged');
	}

	setColor(color: string) {
		this.options.color = color;
		this.fireEvent({ color }, 'colorChanged');
	}
}
