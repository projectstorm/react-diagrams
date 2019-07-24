import * as _ from 'lodash';
import { AbstractLinkFactory, DiagramEngine, LinkModel, PortModel } from '@projectstorm/react-diagrams-core';
import { DefaultLinkModel } from '../link/DefaultLinkModel';

export class DefaultPortModel extends PortModel {
	in: boolean;
	label: string;
	links: { [id: string]: DefaultLinkModel };

	constructor(isInput: boolean, name: string, label: string = null, id?: string) {
		super(name, 'default', id);
		this.in = isInput;
		this.label = label || name;
	}

	deSerialize(object, engine: DiagramEngine) {
		super.deSerialize(object, engine);
		this.in = object.in;
		this.label = object.label;
	}

	serialize() {
		return _.merge(super.serialize(), {
			in: this.in,
			label: this.label
		});
	}

	link(port: PortModel, factory?: AbstractLinkFactory): LinkModel {
		let link = this.createLinkModel(factory);
		link.setSourcePort(this);
		link.setTargetPort(port);
		return link;
	}

	canLinkToPort(port: PortModel): boolean {
		if (port instanceof DefaultPortModel) {
			return this.in !== port.in;
		}
		return true;
	}

	createLinkModel(factory?: AbstractLinkFactory): LinkModel {
		let link = super.createLinkModel();
		if (!link && factory) {
			return factory.getNewInstance();
		}
		return link || new DefaultLinkModel();
	}
}
