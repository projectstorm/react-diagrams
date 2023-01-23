import * as React from 'react';
import { RightAngleLinkWidget } from './RightAngleLinkWidget';
import { DefaultLinkFactory } from '@projectstorm/react-diagrams-defaults';
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
