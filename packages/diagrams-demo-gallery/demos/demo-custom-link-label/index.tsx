import * as React from 'react';
import createEngine, { DefaultNodeModel, DiagramModel } from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';

import { EditableLabelFactory } from './EditableLabelFactory';
import { EditableLabelModel } from './EditableLabelModel';

/**
 * @Author Shumaf Lovpache (aka Soarex16)
 */

export default () => {
	// engine setup
	const engine = createEngine();

	// register our label factory
	engine.getLabelFactories().registerFactory(new EditableLabelFactory());

	// setup diagram model
	const model = new DiagramModel();

	// create some nodes
	const node1 = new DefaultNodeModel('Node1', 'red');
	const port1 = node1.addOutPort('out');
	node1.setPosition(250, 100);

	const node2 = new DefaultNodeModel('Node2', 'green');
	const port2 = node2.addInPort('in');
	node2.setPosition(800, 300);

	// link nodes together
	const link1 = port1.link(port2);

	// !!!
	// add our custom label to link
	link1.addLabel(new EditableLabelModel({
		value: 'Hello, I am label!'
	}));

	// add models to the root graph
	model.addAll(node1, port1, node2, port2, link1);

	// load model into engine
	engine.setModel(model);

	// render diagram
	return (
		<DemoCanvasWidget>
			<CanvasWidget engine={engine} />
		</DemoCanvasWidget>
	)
}