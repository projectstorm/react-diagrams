import * as React from 'react';
import { AbstractNodeFactory, DiagramEngine } from '@projectstorm/react-diagrams';
import { TSCustomNodeModel } from './TSCustomNodeModel';
import { TSCustomNodeWidget } from './TSCustomNodeWidget';

export class TSCustomNodeFactory extends AbstractNodeFactory<TSCustomNodeModel> {
	constructor() {
		super('ts-custom-node');
	}

	getNewInstance(initialConfig) {
		return new TSCustomNodeModel();
	}

	generateReactWidget(diagramEngine: DiagramEngine, node: TSCustomNodeModel): JSX.Element {
		return <TSCustomNodeWidget node={node} />;
	}
}
