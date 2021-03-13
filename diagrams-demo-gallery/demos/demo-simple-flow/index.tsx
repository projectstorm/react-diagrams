import createEngine, { DiagramModel, DefaultNodeModel, DefaultDiagramState } from '@projectstorm/react-diagrams';
import * as React from 'react';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';

export default () => {
	//1) setup the diagram engine
	var engine = createEngine();

	// ############################################ MAGIC HAPPENS HERE
	const state = engine.getStateMachine().getCurrentState();
	if (state instanceof DefaultDiagramState) {
		state.dragNewLink.config.allowLooseLinks = false;
	}
	// ############################################ MAGIC HAPPENS HERE

	//2) setup the diagram model
	var model = new DiagramModel();

	//3-A) create a default node
	var node1 = new DefaultNodeModel('Node 1', 'rgb(0,192,255)');
	var port1 = node1.addOutPort('Out');
	node1.setPosition(100, 100);

	//3-B) create another default node
	var node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
	var port2 = node2.addInPort('In');
	node2.setPosition(400, 100);

	//3-C) link the 2 nodes together
	var link1 = port1.link(port2);

	//3-D) create an orphaned node
	var node3 = new DefaultNodeModel('Node 3', 'rgb(0,192,255)');
	node3.addOutPort('Out');
	node3.setPosition(100, 200);

	//4) add the models to the root graph
	model.addAll(node1, node2, node3, link1);

	//5) load model into engine
	engine.setModel(model);

	//6) render the diagram!
	return (
		<DemoCanvasWidget>
			<CanvasWidget engine={engine} />
		</DemoCanvasWidget>
	);
};
