import * as React from 'react';
import { AbstractLinkFactory, DiagramEngine } from '@projectstorm/react-diagrams-core';
import { DefaultLinkModel } from './DefaultLinkModel';
import { DefaultLinkWidget } from './DefaultLinkWidget';

export class DefaultLinkFactory extends AbstractLinkFactory<DefaultLinkModel> {
	constructor() {
		super('default');
	}

	generateReactWidget(diagramEngine: DiagramEngine, link: DefaultLinkModel): JSX.Element {
		return <DefaultLinkWidget link={link} diagramEngine={diagramEngine} />;
	}

	getNewInstance(initialConfig?: any): DefaultLinkModel {
		return new DefaultLinkModel();
	}

	generateLinkSegment(model: DefaultLinkModel, widget: DefaultLinkWidget, selected: boolean, path: string) {
		return (
			<path
				className={selected ? widget.bem('--path-selected') : ''}
				strokeWidth={model.width}
				stroke={model.color}
				d={path}
			/>
		);
	}
}
