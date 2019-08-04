import * as React from 'react';
import { AbstractReactFactory, GenerateModelEvent, GenerateWidgetEvent } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '../../DiagramEngine';
import { NodeLayerModel } from './NodeLayerModel';
import { NodeLayerWidget } from './NodeLayerWidget';

export class NodeLayerFactory extends AbstractReactFactory<NodeLayerModel, DiagramEngine> {
	constructor() {
		super('diagram-nodes');
	}

	generateModel(event: GenerateModelEvent): NodeLayerModel {
		return new NodeLayerModel();
	}

	generateReactWidget(event: GenerateWidgetEvent<NodeLayerModel>): JSX.Element {
		return <NodeLayerWidget layer={event.model} engine={this.engine} />;
	}
}
