import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-diagrams';
import { JSCustomNodeModel } from './JSCustomNodeModel';
import { JSCustomNodeWidget } from './JSCustomNodeWidget';

export class JSCustomNodeFactory extends AbstractReactFactory {
	constructor() {
		super('js-custom-node');
	}

	generateModel(event) {
		return new JSCustomNodeModel();
	}

	generateReactWidget(event) {
		return <JSCustomNodeWidget node={event.model} />;
	}
}
