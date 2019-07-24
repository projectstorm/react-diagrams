import { AbstractPortFactory } from '@projectstorm/react-diagrams-core';
import { DefaultPortModel } from './DefaultPortModel';

export class DefaultPortFactory extends AbstractPortFactory<DefaultPortModel> {
	constructor() {
		super('default');
	}

	getNewInstance(initialConfig?: any): DefaultPortModel {
		return new DefaultPortModel(true, 'unknown');
	}
}
