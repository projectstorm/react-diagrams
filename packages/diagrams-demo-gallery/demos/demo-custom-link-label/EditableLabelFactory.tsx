import * as React from 'react';
import { AbstractReactFactory, GenerateWidgetEvent } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams';

import { EditableLabelModel } from './EditableLabelModel';
import { EditableLabelWidget } from './EditableLabelWidget';

export class EditableLabelFactory extends AbstractReactFactory<EditableLabelModel, DiagramEngine> {
	constructor() {
		super('editable-label');
	}

	generateModel(): EditableLabelModel {
		return new EditableLabelModel();
	}

	generateReactWidget(event: GenerateWidgetEvent<EditableLabelModel>): JSX.Element {
		return <EditableLabelWidget model={event.model} />;
	}
}
