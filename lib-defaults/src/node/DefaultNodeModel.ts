import * as _ from 'lodash';
import {
	BaseModelOptions,
	DiagramEngine,
	NodeModel,
	NodeModelGenerics,
	PortModelAlignment
} from '@projectstorm/react-diagrams-core';
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
	protected portsIn: DefaultPortModel[];
	protected portsOut: DefaultPortModel[];

	constructor(name: string, color: string);
	constructor(options?: DefaultNodeModelOptions);
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
		this.portsOut = [];
		this.portsIn = [];
	}

	removePort(port: (DefaultNodeModelGenerics & NodeModelGenerics)['PORT']): void {
		super.removePort(port);
		if (port.getOptions().in) {
			this.portsIn.splice(this.portsIn.indexOf(port));
		} else {
			this.portsOut.splice(this.portsOut.indexOf(port));
		}
	}

	addPort<T extends (DefaultNodeModelGenerics & NodeModelGenerics)['PORT']>(port: T): T {
		super.addPort(port);
		if (port.getOptions().in) {
			if (this.portsIn.indexOf(port) === -1) {
				this.portsIn.push(port);
			}
		} else {
			if (this.portsOut.indexOf(port) === -1) {
				this.portsOut.push(port);
			}
		}
		return port;
	}

	addInPort(label: string, after = true): DefaultPortModel {
		const p = new DefaultPortModel({
			in: true,
			name: label,
			label: label,
			alignment: PortModelAlignment.LEFT
		});
		if (!after) {
			this.portsIn.splice(0, 0, p);
		}
		return this.addPort(p);
	}

	addOutPort(label: string, after = true): DefaultPortModel {
		const p = new DefaultPortModel({
			in: false,
			name: label,
			label: label,
			alignment: PortModelAlignment.RIGHT
		});
		if (!after) {
			this.portsOut.splice(0, 0, p);
		}
		return this.addPort(p);
	}

	deSerialize(object, engine: DiagramEngine) {
		super.deSerialize(object, engine);
		this.options.name = object.name;
		this.options.color = object.color;
		this.portsIn = _.map(object.portsInOrder, id => {
			return this.getPortFromID(id);
		});
		this.portsOut = _.map(object.portsOutOrder, id => {
			return this.getPortFromID(id);
		});
	}

	serialize(): any {
		return {
			...super.serialize(),
			name: this.options.name,
			color: this.options.color,
			portsInOrder: _.map(this.portsIn, port => {
				return port.getID();
			}),
			portsOutOrder: _.map(this.portsOut, port => {
				return port.getID();
			})
		};
	}

	getInPorts(): DefaultPortModel[] {
		return this.portsIn;
	}

	getOutPorts(): DefaultPortModel[] {
		return this.portsOut;
	}
}
