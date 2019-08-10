import { DefaultPortModel } from './DefaultPortModel';
import { AbstractModelFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class DefaultPortFactory extends AbstractModelFactory<DefaultPortModel, DiagramEngine> {
	constructor() {
		super('default');
	}

	generateModel(): DefaultPortModel {
		return new DefaultPortModel({
			name: 'unknown'
		});
	}
}
