import * as _ from 'lodash';
import {
	AbstractFactory,
	DiagramEngine,
	LinkModel,
	PortModel,
	PortModelGenerics,
	PortModelOptions
} from '@projectstorm/react-diagrams-core';
import { DefaultLinkModel } from '../link/DefaultLinkModel';
import { DefaultNodeModel } from '../node/DefaultNodeModel';

export interface DefaultPortModelOptions extends Omit<PortModelOptions, 'type'> {
	label?: string;
	in?: boolean;
}

export interface DefaultPortModelGenerics {
	OPTIONS: DefaultPortModelOptions;
	PARENT: DefaultNodeModel;
}

export class DefaultPortModel extends PortModel<PortModelGenerics & DefaultPortModelGenerics> {
	constructor(options: DefaultPortModelOptions) {
		super({
			label: options.label || options.name,
			...options,
			type: 'default'
		});
	}

	deSerialize(object, engine: DiagramEngine) {
		super.deSerialize(object, engine);
		this.options.in = object.in;
		this.options.label = object.label;
	}

	serialize() {
		return _.merge(super.serialize(), {
			in: this.options.in,
			label: this.options.label
		});
	}

	link(port: PortModel, factory?: AbstractFactory<LinkModel>): LinkModel {
		let link = this.createLinkModel(factory);
		link.setSourcePort(this);
		link.setTargetPort(port);
		return link;
	}

	canLinkToPort(port: PortModel): boolean {
		if (port instanceof DefaultPortModel) {
			return this.options.in !== port.getOptions().in;
		}
		return true;
	}

	createLinkModel(factory?: AbstractFactory<LinkModel>): LinkModel {
		let link = super.createLinkModel();
		if (!link && factory) {
			return factory.generateModel({});
		}
		return link || new DefaultLinkModel();
	}
}
