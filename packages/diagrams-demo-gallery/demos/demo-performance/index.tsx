import createEngine, { DiagramModel, DefaultNodeModel } from '@projectstorm/react-diagrams';
import * as React from 'react';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';

/**
 *
 * Simple stress test of the system, shows that it can handle many nodes, and
 * retain good performance
 *
 * @Author Dylan Vorster
 */
export default () => {
	//1) setup the diagram engine
	var engine = createEngine();

	//2) setup the diagram model
	var model = new DiagramModel();

	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			generateNodes(model, i * 200, j * 100);
		}
	}

	//5) load model into engine
	engine.setModel(model);

	//6) render the diagram!
	return (
		<DemoCanvasWidget>
			<CanvasWidget engine={engine} />
		</DemoCanvasWidget>
	);
};

function generateNodes(model: DiagramModel, offsetX: number, offsetY: number) {
	//3-A) create a default node
	var node1 = new DefaultNodeModel('Node 1', 'rgb(0,192,255)');
	var port1 = node1.addOutPort('Out');
	node1.setPosition(100 + offsetX, 100 + offsetY);

	//3-B) create another default node
	var node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
	var port2 = node2.addInPort('In');
	node2.setPosition(200 + offsetX, 100 + offsetY);

	//3-C) link the 2 nodes together
	var link1 = port1.link(port2);

	//4) add the models to the root graph
	model.addAll(node1, node2, link1);
}
