import {
	DiagramEngine,
	DiagramModel,
	DefaultNodeModel,
	LinkModel,
	DefaultPortModel,
	DiagramWidget
} from "../../src/main";
import * as React from "react";

export default () => {
	// setup the diagram engine
	var engine = new DiagramEngine();
	engine.installDefaultFactories();

	// setup the diagram model
	var model = new DiagramModel();

	// create two nodes
	var node1 = new DefaultNodeModel("Node 1", "rgb(0,192,255)");
	var port1 = node1.addPort(new DefaultPortModel(false, "out-1", "Out"));
	node1.x = 100;
	node1.y = 100;
	var node2 = new DefaultNodeModel("Node 2", "rgb(192,255,0)");
	var port2 = node2.addPort(new DefaultPortModel(true, "in-1", "IN"));
	node2.x = 400;
	node2.y = 100;

	// link node A and B together and set a plain text label
	var link1 = new LinkModel();
	link1.setSourcePort(port1);
	link1.setTargetPort(port2);
	link1.setLabel('Custom label');

	// add all the models
	model.addNode(node1);
	model.addNode(node2);
	model.addLink(link1);

	// load model into engine and render
	engine.setDiagramModel(model);
	return <DiagramWidget diagramEngine={engine} />;
};
