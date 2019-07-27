import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-diagrams-core';
import { DefaultNodeModel } from './DefaultNodeModel';
import { DefaultNodeWidget } from './DefaultNodeWidget';

export class DefaultNodeFactory extends AbstractReactFactory<DefaultNodeModel> {
	constructor() {
		super('default');
	}

	generateReactWidget(event): JSX.Element {
		return <DefaultNodeWidget engine={this.engine} node={event.model} />;
	}

	generateModel(event): DefaultNodeModel {
		return new DefaultNodeModel();
	}
}
