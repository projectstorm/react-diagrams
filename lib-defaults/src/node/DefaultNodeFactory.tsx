import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-diagrams-core';
import { DefaultNodeModel } from './DefaultNodeModel';
import { DefaultNodeWidget } from './DefaultNodeWidget';
/**
 * @author Dylan Vorster
 */
export class DefaultNodeFactory extends AbstractReactFactory<DefaultNodeModel> {
	constructor() {
		super('default');
	}

	generateReactWidget(event): JSX.Element {
		return <DefaultNodeWidget node={event.model} />;
	}

	generateModel(event): DefaultNodeModel {
		return new DefaultNodeModel();
	}
}
