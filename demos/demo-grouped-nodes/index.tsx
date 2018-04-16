import {
	DiagramEngine,
	DiagramModel,
	DefaultNodeModel,
	LinkModel,
	DiagramWidget,
	DefaultGroupNodeModel
} from "storm-react-diagrams";
import * as React from "react";

/**
 * Tests the grid size
 */
export default () => {
	var engine = new DiagramEngine();
	engine.installDefaultFactories();

	var model = new DiagramModel();

	var node1 = new DefaultNodeModel("Node 1", "rgb(0,192,255)");
	let port = node1.addOutPort("Out");
	node1.setPosition(100, 100);

	var node2 = new DefaultNodeModel("Node 2", "rgb(192,255,0)");
	let port2 = node2.addInPort("In");
	node2.setPosition(400, 100);

	var node3 = new DefaultGroupNodeModel("Group");
	node3.setPosition(50, 50);

	let link1 = port.link(port2);

	model.addAll(node1, node2, link1, node3);

	engine.setDiagramModel(model);

	//6) render the diagram!
	return <DiagramWidget className="srd-demo-canvas" diagramEngine={engine} />;
};
