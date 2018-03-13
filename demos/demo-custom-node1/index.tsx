import {
	DiagramEngine,
	DiagramModel,
	DefaultNodeModel,
	LinkModel,
	DefaultPortModel,
	DiagramWidget
} from "storm-react-diagrams";
import * as React from "react";

// import the custom models
import { DiamondNodeModel } from "./DiamondNodeModel";
import { DiamondNodeFactory } from "./DiamondNodeFactory";
import { SimplePortFactory } from "./SimplePortFactory";
import { DiamondPortModel } from "./DiamondPortModel";

/**
 * @Author Dylan Vorster
 */
export default () => {
	//1) setup the diagram engine
	var engine = new DiagramEngine();
	engine.installDefaultFactories();

	// register some other factories as well
	engine.registerPortFactory(new SimplePortFactory("diamond", config => new DiamondPortModel()));
	engine.registerNodeFactory(new DiamondNodeFactory());

	//2) setup the diagram model
	var model = new DiagramModel();

	//3-A) create a default node
	var node1 = new DefaultNodeModel("Node 1", "rgb(0,192,255)");
	var port1 = node1.addOutPort("Out");
	node1.setPosition(100, 150);

	//3-B) create our new custom node
	var node2 = new DiamondNodeModel();
	node2.setPosition(250, 108);

	var node3 = new DefaultNodeModel("Node 3", "red");
	var port3 = node3.addInPort("In");
	node3.setPosition(500, 150);

	//3-C) link the 2 nodes together
	var link1 = port1.link(node2.getPort("left"));
	var link2 = port3.link(node2.getPort("right"));

	//4) add the models to the root graph
	model.addAll(node1, node2, node3, link1, link2);

	//5) load model into engine
	engine.setDiagramModel(model);

	//6) render the diagram!
	return <DiagramWidget className="srd-demo-canvas" diagramEngine={engine} />;
};
