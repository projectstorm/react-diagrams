import * as _ from 'lodash';
import { BaseModelOptions, DiagramEngine, NodeModel, NodeModelGenerics } from '@projectstorm/react-diagrams-core';
import { DefaultPortModel } from '../port/DefaultPortModel';

export interface DefaultNodeModelOptions extends Omit<BaseModelOptions, 'type'> {
	name?: string;
	color?: string;
}

export interface DefaultNodeModelGenerics {
	PORT: DefaultPortModel;
	OPTIONS: DefaultNodeModelOptions;
}

export class DefaultNodeModel extends NodeModel<DefaultNodeModelGenerics & NodeModelGenerics> {
	constructor(name: string, color: string);
	constructor(options: DefaultNodeModelOptions);
	constructor(options: any = {}, color?: string) {
		if (typeof options === 'string') {
			options = {
				name: options,
				color: color
			};
		}
		super({
			type: 'default',
			name: 'Untitled',
			color: 'rgb(0,192,255)',
			...options
		});
	}

	addInPort(label: string): DefaultPortModel {
		return this.addPort(
			new DefaultPortModel({
				in: true,
				name: label,
				label: label
			})
		);
	}

	addOutPort(label: string): DefaultPortModel {
		return this.addPort(
			new DefaultPortModel({
				in: false,
				name: label,
				label: label
			})
		);
	}

	deSerialize(object, engine: DiagramEngine) {
		super.deSerialize(object, engine);
		this.options.name = object.name;
		this.options.color = object.color;
	}

	serialize() {
		return _.merge(super.serialize(), {
			name: this.options.name,
			color: this.options.color
		});
	}

	getInPorts(): DefaultPortModel[] {
		return _.filter(this.ports, portModel => {
			return portModel.getOptions().in;
		});
	}

	getOutPorts(): DefaultPortModel[] {
		return _.filter(this.ports, portModel => {
			return !portModel.getOptions().in;
		});
	}
}
