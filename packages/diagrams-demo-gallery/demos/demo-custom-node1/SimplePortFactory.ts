import { AbstractFactory, PortModel } from '@projectstorm/react-diagrams';

export class SimplePortFactory extends AbstractFactory {
	cb: (initialConfig?: any) => PortModel;

	constructor(type: string, cb: (initialConfig?: any) => PortModel) {
		super(type);
		this.cb = cb;
	}

	generateModel(event): PortModel {
		return this.cb(event.initialConfig);
	}
}
