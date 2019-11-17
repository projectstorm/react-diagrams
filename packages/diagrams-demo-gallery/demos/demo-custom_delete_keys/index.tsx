import * as React from 'react';
import createEngine, { DiagramModel, DefaultNodeModel } from '@projectstorm/react-diagrams';
import { CanvasWidget, DeleteItemsAction } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';

export default () => {
	const engine = createEngine();
	const model = new DiagramModel();

	const node1 = new DefaultNodeModel('Node 1', 'rgb(0,192,255)');
	node1.addOutPort('Out');
	node1.setPosition(100, 100);

	const node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
	node2.addInPort('In');
	node2.setPosition(400, 100);

	model.addAll(node1, node2);

	engine.setModel(model);

	//deregister the default DeleteItemsAction
	engine.deregisterDefaultDeleteItemsAction();
	//add another DeleteItemsAction with custom keyCodes (in this case, only Delete key)
	this.eventBus.registerAction(new DeleteItemsAction({ keyCodes: [46] }));

	return (
		<DemoCanvasWidget>
			<CanvasWidget engine={engine} />
		</DemoCanvasWidget>
	);
};
