import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-diagrams-core';
import { DefaultLabelModel } from './DefaultLabelModel';
import { DefaultLabelWidget } from './DefaultLabelWidget';

/**
 * @author Dylan Vorster
 */
export class DefaultLabelFactory extends AbstractReactFactory<DefaultLabelModel> {
	constructor() {
		super('default');
	}

	generateReactWidget(event): JSX.Element {
		return <DefaultLabelWidget model={event.model} />;
	}

	generateModel(event): DefaultLabelModel {
		return new DefaultLabelModel();
	}
}
