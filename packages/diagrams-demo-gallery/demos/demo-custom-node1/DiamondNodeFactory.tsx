import { DiamonNodeWidget } from './DiamondNodeWidget';
import { DiamondNodeModel } from './DiamondNodeModel';
import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class DiamondNodeFactory extends AbstractReactFactory<DiamondNodeModel, DiagramEngine> {
	constructor() {
		super('diamond');
	}

	generateReactWidget(event): JSX.Element {
		return <DiamonNodeWidget engine={this.engine} size={50} node={event.model} />;
	}

	generateModel(event) {
		return new DiamondNodeModel();
	}
}
