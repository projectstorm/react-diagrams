import { DiagramEngine, NodeModel, DefaultPortModel, BaseModelOptions } from "@projectstorm/react-diagrams";

export interface TSCustomNodeModelOptions extends Omit<BaseModelOptions, 'type'>{
	color?: string;
}

export class TSCustomNodeModel extends NodeModel {
	color: string;

	constructor(options: TSCustomNodeModelOptions = {}) {
		super({
			...options,
			type: 'ts-custom-node'
		});
		this.color = options.color || 'red';

		// setup an in and out port
		this.addPort(new DefaultPortModel({
			in: true,
			name: 'in',
		}));
		this.addPort(new DefaultPortModel({
			in: false,
			name: 'out',
		}));
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
