import * as React from 'react';
import { RightAngleLinkWidget } from './RightAngleLinkWidget';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { DefaultLinkFactory, DefaultLinkModel } from '@projectstorm/react-diagrams-defaults';
import { RightAngleLinkModel } from './RightAngleLinkModel';

/**
 * @author Daniel Lazar
 */
export class RightAngleLinkFactory extends DefaultLinkFactory<RightAngleLinkModel> {
	static NAME = 'rightAngle';

	constructor() {
		super(RightAngleLinkFactory.NAME);
	}

	generateModel(event): RightAngleLinkModel {
		return new RightAngleLinkModel();
	}

	generateReactWidget(event): JSX.Element {
		return <RightAngleLinkWidget diagramEngine={this.engine} link={event.model} factory={this} />;
	}
}
