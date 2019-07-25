import { AbstractFactory } from '@projectstorm/react-diagrams-core';
import { DefaultPortModel } from './DefaultPortModel';

export class DefaultPortFactory extends AbstractFactory<DefaultPortModel> {
	constructor() {
		super('default');
	}

	generateModel(): DefaultPortModel {
		return new DefaultPortModel(true, 'unknown');
	}
}
