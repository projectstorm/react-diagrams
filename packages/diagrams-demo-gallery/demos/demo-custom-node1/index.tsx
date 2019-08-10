import createEngine, { DefaultNodeModel, DiagramModel, PortModelAlignment } from '@projectstorm/react-diagrams';
import * as React from 'react';
// import the custom models
import { DiamondNodeModel } from './DiamondNodeModel';
import { DiamondNodeFactory } from './DiamondNodeFactory';
import { SimplePortFactory } from './SimplePortFactory';
import { DiamondPortModel } from './DiamondPortModel';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';

/**
 * @Author Dylan Vorster
 */
export default () => {
	//1) setup the diagram engine
	var engine = createEngine();

	// register some other factories as well
	engine
		.getPortFactories()
		.registerFactory(new SimplePortFactory('diamond', config => new DiamondPortModel(PortModelAlignment.LEFT)));
	engine.getNodeFactories().registerFactory(new DiamondNodeFactory());

	//2) setup the diagram model
	var model = new DiagramModel();

	//3-A) create a default node
	var node1 = new DefaultNodeModel('Node 1', 'rgb(0,192,255)');
	var port1 = node1.addOutPort('Out');
	node1.setPosition(100, 200);

	//3-B) create our new custom node
	var node2 = new DiamondNodeModel();
	node2.setPosition(250, 108);

	var node3 = new DefaultNodeModel('Node 3', 'red');
	var port3 = node3.addInPort('In');
	node3.setPosition(500, 100);

	//3-C) link the 2 nodes together
	var link1 = port1.link(node2.getPort(PortModelAlignment.LEFT));
	var link2 = port3.link(node2.getPort(PortModelAlignment.RIGHT));

	var node4 = new DefaultNodeModel('Node 4', 'rgb(0,192,255)');
	var port4 = node4.addOutPort('Out');
	node4.setPosition(200, 10);

	var link3 = port4.link(node2.getPort(PortModelAlignment.TOP));

	var node5 = new DefaultNodeModel('Node 5', 'mediumpurple');
	var port5 = node5.addInPort('In');
	node5.setPosition(400, 300);

	var link4 = port5.link(node2.getPort(PortModelAlignment.BOTTOM));

	//4) add the models to the root graph
	model.addAll(node1, node2, node3, link1, link2, node4, link3, link4, node5);

	//5) load model into engine
	engine.setModel(model);

	//6) render the diagram!
	return (
		<DemoCanvasWidget>
			<CanvasWidget engine={engine} />
		</DemoCanvasWidget>
	);
};
