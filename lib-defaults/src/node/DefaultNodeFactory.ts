import * as React from 'react';
import { AbstractNodeFactory, DiagramEngine } from '@projectstorm/react-diagrams-core';
import { DefaultNodeModel } from './DefaultNodeModel';
import { DefaultNodeWidget } from './DefaultNodeWidget';
/**
 * @author Dylan Vorster
 */
export class DefaultNodeFactory extends AbstractNodeFactory<DefaultNodeModel> {
	constructor() {
		super('default');
	}

	generateReactWidget(diagramEngine: DiagramEngine, node: DefaultNodeModel): JSX.Element {
		return React.createElement(DefaultNodeWidget, {
			node: node,
			diagramEngine: diagramEngine
		});
	}

	getNewInstance(initialConfig?: any): DefaultNodeModel {
		return new DefaultNodeModel();
	}
}
