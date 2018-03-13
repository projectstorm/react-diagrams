import * as React from "react";
import { action } from "@storybook/addon-actions";
import {
	DiagramEngine,
	DiagramModel,
	DiagramProps,
	DefaultNodeModel,
	LinkModel,
	DiagramWidget
} from "storm-react-diagrams";

/**
 * Shows some of the events triggered when elements are selected
 */
export default () => {
	// setup the diagram engine
	var engine = new DiagramEngine();
	engine.installDefaultFactories();

	var model = new DiagramModel();

	// sample for link with simple line
	var node1 = new DefaultNodeModel("Node 1", "rgb(255,99,66)");
	var port1 = node1.addOutPort("Out");
	node1.setPosition(100, 100);

	var node2 = new DefaultNodeModel("Node 2", "rgb(192,255,0)");
	var port2 = node2.addInPort("In");
	node2.setPosition(400, 40);

	var node3 = new DefaultNodeModel("Node 3", "rgb(128,99,255)");
	var port3 = node3.addInPort("In");
	node3.setPosition(300, 160);

	//link the nodes
	let link1 = port1.link(port2);
	let link2 = port1.link(port3);

	// add all the models
	let models = model.addAll(node1, node2, node3, link1, link2);

	// add a selection listener to each
	models.forEach(item => {
		item.addListener({
			selectionChanged: action("selectionChanged")
		});
	});

	engine.setDiagramModel(model);

	var props = {
		diagramEngine: engine,
		maxNumberPointsPerLink: 0 // no extra points so link selection is fired straight away
	} as DiagramProps;

	return (
		<div>
			<p>Click the diagram elements to inspect some of the possible events.</p>
			<DiagramWidget className="srd-demo-canvas" {...props} />
		</div>
	);
};
