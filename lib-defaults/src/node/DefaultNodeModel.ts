import * as _ from 'lodash';
import { DiagramEngine, NodeModel, NodeModelListener, Toolkit } from '@projectstorm/react-diagrams-core';
import { DefaultPortModel } from '../port/DefaultPortModel';

export class DefaultNodeModel extends NodeModel<NodeModelListener> {
	name: string;
	color: string;
	ports: { [s: string]: DefaultPortModel };

	constructor(name: string = 'Untitled', color: string = 'rgb(0,192,255)') {
		super('default');
		this.name = name;
		this.color = color;
	}

	addInPort(label: string): DefaultPortModel {
		return this.addPort(new DefaultPortModel(true, Toolkit.UID(), label));
	}

	addOutPort(label: string): DefaultPortModel {
		return this.addPort(new DefaultPortModel(false, Toolkit.UID(), label));
	}

	deSerialize(object, engine: DiagramEngine) {
		super.deSerialize(object, engine);
		this.name = object.name;
		this.color = object.color;
	}

	serialize() {
		return _.merge(super.serialize(), {
			name: this.name,
			color: this.color
		});
	}

	getInPorts(): DefaultPortModel[] {
		return _.filter(this.ports, portModel => {
			return portModel.in;
		});
	}

	getOutPorts(): DefaultPortModel[] {
		return _.filter(this.ports, portModel => {
			return !portModel.in;
		});
	}
}
