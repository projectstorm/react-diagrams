import * as React from 'react';
import {AbstractReactFactory} from '@projectstorm/react-diagrams';
import { TSCustomNodeModel } from './TSCustomNodeModel';
import { TSCustomNodeWidget } from './TSCustomNodeWidget';

export class TSCustomNodeFactory extends AbstractReactFactory<TSCustomNodeModel> {
	constructor() {
		super('ts-custom-node');
	}

	generateModel(initialConfig) {
		return new TSCustomNodeModel();
	}

	generateReactWidget(event): JSX.Element {
		return <TSCustomNodeWidget node={event.model} />;
	}
}
