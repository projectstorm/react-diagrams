import * as React from 'react';
import { AbstractNodeFactory } from '@projectstorm/react-diagrams';
import { JSCustomNodeModel } from './JSCustomNodeModel';
import { JSCustomNodeWidget } from './JSCustomNodeWidget';

export class JSCustomNodeFactory extends AbstractNodeFactory {
	constructor() {
		super('js-custom-node');
	}

	getNewInstance(initialConfig) {
		return new JSCustomNodeModel();
	}

	generateReactWidget(diagramEngine, node) {
		return <JSCustomNodeWidget node={node} />;
	}
}
