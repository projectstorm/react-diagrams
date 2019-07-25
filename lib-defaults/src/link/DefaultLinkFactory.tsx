import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-diagrams-core';
import { DefaultLinkModel } from './DefaultLinkModel';
import { DefaultLinkWidget } from './DefaultLinkWidget';

export class DefaultLinkFactory extends AbstractReactFactory<DefaultLinkModel> {
	constructor() {
		super('default');
	}

	generateReactWidget(event): JSX.Element {
		return <DefaultLinkWidget link={event.model} diagramEngine={this.engine} />;
	}

	generateModel(event): DefaultLinkModel {
		return new DefaultLinkModel();
	}

	generateLinkSegment(model: DefaultLinkModel, widget: DefaultLinkWidget, selected: boolean, path: string) {
		return (
			<path
				className={selected ? widget.bem('--path-selected') : ''}
				strokeWidth={model.getOptions().width}
				stroke={model.getOptions().color}
				d={path}
			/>
		);
	}
}
