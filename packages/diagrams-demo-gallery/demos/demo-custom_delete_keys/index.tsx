import * as React from 'react';
import createEngine, { DiagramModel, DefaultNodeModel, DefaultLinkModel } from '@projectstorm/react-diagrams';
import { CanvasWidget, DeleteItemsAction } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';

export default () => {
	// create an engine without registering DeleteItemsAction
	const engine = createEngine({ registerDefaultDeleteItemsAction: false });
	const model = new DiagramModel();

	const node1 = new DefaultNodeModel({ name: 'Node 1', color: 'rgb(0,192,255)' });
	node1.setPosition(100, 100);
	const port1 = node1.addOutPort('Out');

	const node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
	const port2 = node2.addInPort('In');
	node2.setPosition(400, 100);

	const link1 = port1.link<DefaultLinkModel>(port2);
	link1.getOptions().testName = 'Test';
	link1.addLabel('Hello World!');

	model.addAll(node1, node2, link1);

	engine.setModel(model);

	// register an DeleteItemsAction with custom keyCodes (in this case, only Delete key)
	engine.getActionEventBus().registerAction(new DeleteItemsAction({ keyCodes: [46] }));

	return (
		<DemoCanvasWidget>
			<CanvasWidget engine={engine} />
		</DemoCanvasWidget>
	);
};
