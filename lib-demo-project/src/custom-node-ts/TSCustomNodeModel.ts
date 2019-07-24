import { DiagramEngine, NodeModel, DefaultPortModel } from '@projectstorm/react-diagrams';

export interface TSCustomNodeModelOptions {
	color?: string;
}

export class TSCustomNodeModel extends NodeModel {
	color: string;

	constructor(options: TSCustomNodeModelOptions = {}) {
		super('ts-custom-node');
		this.color = options.color || 'red';

		// setup an in and out port
		this.addPort(new DefaultPortModel(true, 'in'));
		this.addPort(new DefaultPortModel(false, 'out'));
	}

	serialize() {
		return {
			...super.serialize(),
			color: this.color
		};
	}

	deSerialize(ob: any, engine: DiagramEngine): void {
		super.deSerialize(ob, engine);
		this.color = ob.color;
	}
}
