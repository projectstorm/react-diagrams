import createEngine, { DiagramModel, DefaultNodeModel, DefaultLinkModel } from '@projectstorm/react-diagrams';
import * as React from 'react';
import { DemoButton, DemoWorkspaceWidget } from '../helpers/DemoWorkspaceWidget';
import { action } from '@storybook/addon-actions';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';

export default () => {
	// setup the diagram engine
	const engine = createEngine();

	// setup the diagram model
	const model = new DiagramModel();

	// create four nodes
	const node1 = new DefaultNodeModel('Node A', 'rgb(0,192,255)');
	const port1 = node1.addOutPort('Out');
	node1.setPosition(100, 100);

	const node2 = new DefaultNodeModel('Node B', 'rgb(255,255,0)');
	const port2 = node2.addInPort('In');
	node2.setPosition(400, 50);

	const node3 = new DefaultNodeModel('Node C (no label)', 'rgb(192,255,255)');
	const port3 = node3.addInPort('In');
	node3.setPosition(450, 180);

	const node4 = new DefaultNodeModel('Node D', 'rgb(192,0,255)');
	const port4 = node4.addInPort('In');
	node4.setPosition(300, 250);

	// link node A and B together and give it a label
	const link1 = port1.link(port2);
	(link1 as DefaultLinkModel).addLabel('Custom label 1');
	(link1 as DefaultLinkModel).addLabel('Custom label 2');

	// no label for A and C, just a link
	const link2 = port1.link(port3);

	// also a label for A and D
	const link3 = port1.link(port4);
	(link3 as DefaultLinkModel).addLabel('Emoji label: 🎉');

	// add all to the main model
	model.addAll(node1, node2, node3, node4, link1, link2, link3);

	// load model into engine and render
	engine.setModel(model);

	return (
		<DemoWorkspaceWidget
			buttons={
				<DemoButton
					onClick={() => {
						action('Serialized Graph')(JSON.stringify(model.serializeDiagram(), null, 2));
					}}>
					Serialize Graph
				</DemoButton>
			}>
			<DemoCanvasWidget>
				<CanvasWidget engine={engine} />
			</DemoCanvasWidget>
		</DemoWorkspaceWidget>
	);
};
