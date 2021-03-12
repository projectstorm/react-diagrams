import createEngine, {
	DiagramModel,
	DefaultNodeModel,
	DefaultPortModel,
	PathFindingLinkFactory,
	DefaultLabelModel
} from '@projectstorm/react-diagrams';
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

	// create four nodes in a way that straight links wouldn't work
	const node1 = new DefaultNodeModel('Node A', 'rgb(0,192,255)');
	const port1 = node1.addPort(new DefaultPortModel(false, 'out-1', 'Out'));
	node1.setPosition(340, 350);

	const node2 = new DefaultNodeModel('Node B', 'rgb(255,255,0)');
	const port2 = node2.addPort(new DefaultPortModel(false, 'out-1', 'Out'));
	node2.setPosition(240, 80);
	const node3 = new DefaultNodeModel('Node C', 'rgb(192,255,255)');
	const port3 = node3.addPort(new DefaultPortModel(true, 'in-1', 'In'));
	node3.setPosition(540, 180);
	const node4 = new DefaultNodeModel('Node D', 'rgb(192,0,255)');
	const port4 = node4.addPort(new DefaultPortModel(true, 'in-1', 'In'));
	node4.setPosition(95, 185);
	const node5 = new DefaultNodeModel('Node E', 'rgb(192,255,0)');
	node5.setPosition(250, 180);

	const pathfinding = engine.getLinkFactories().getFactory<PathFindingLinkFactory>(PathFindingLinkFactory.NAME);

	// linking things together (specifically using the pathfinding link)
	const link1 = port1.link(port4, pathfinding);
	const link2 = port2.link(port3, pathfinding);

	link1.addLabel(
		new DefaultLabelModel({
			label: 'I am a label!',
			offsetY: 20
		})
	);

	// add all to the main model
	model.addAll(node1, node2, node3, node4, node5, link1, link2);

	// load model into engine and render
	engine.setModel(model);

	return (
		<DemoWorkspaceWidget
			buttons={
				<DemoButton
					onClick={() => {
						action('Serialized Graph')(JSON.stringify(model.serialize(), null, 2));
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
