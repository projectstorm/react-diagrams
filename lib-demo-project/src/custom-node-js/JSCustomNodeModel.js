import {DefaultPortModel, NodeModel} from "@projectstorm/react-diagrams";

/**
 * Example of a custom model using pure javascript
 */
export class JSCustomNodeModel extends NodeModel {

	constructor(options = {}) {
		super('js-custom-node');
		this.color = options.color || {options: 'red'};

		// setup an in and out port
		this.addPort(new DefaultPortModel(true,"in"));
		this.addPort(new DefaultPortModel(false,"out"));
	}


	serialize() {
		return {
			...super.serialize(),
			color: this.options.color
		}
	}

	deSerialize(ob, engine) {
		super.deSerialize(ob, engine);
		this.color = ob.color;
	}
}
