import { PortModel, AbstractPortFactory } from "@projectstorm/react-diagrams";

export class SimplePortFactory extends AbstractPortFactory {
	cb: (initialConfig?: any) => PortModel;

	constructor(type: string, cb: (initialConfig?: any) => PortModel) {
		super(type);
		this.cb = cb;
	}

	getNewInstance(initialConfig?: any): PortModel {
		return this.cb(initialConfig);
	}
}
