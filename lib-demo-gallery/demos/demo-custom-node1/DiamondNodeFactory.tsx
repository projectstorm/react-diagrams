import { DiamonNodeWidget } from './DiamondNodeWidget';
import { DiamondNodeModel } from './DiamondNodeModel';
import * as React from 'react';
import {AbstractReactFactory} from "@projectstorm/react-diagrams";

export class DiamondNodeFactory extends AbstractReactFactory<DiamondNodeModel> {
	constructor() {
		super('diamond');
	}

	generateReactWidget(event): JSX.Element {
		return <DiamonNodeWidget node={event.model} />;
	}

	generateModel(event) {
		return new DiamondNodeModel();
	}
}
