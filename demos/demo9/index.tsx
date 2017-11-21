import * as SRD from "../../src/main";
import * as React from "react";
import { action } from "@storybook/addon-actions";
import { DiagramEngine, DiagramModel, DefaultNodeModel, LinkModel, DiagramWidget } from "../../src/main";

/**
 * Shows some of the events triggered when elements are selected
 */
export default () => {
	// setup the diagram engine
	var engine = new DiagramEngine();
	engine.registerNodeFactory(new SRD.DefaultNodeFactory());
	engine.registerLinkFactory(new SRD.DefaultLinkFactory());

	var model = new DiagramModel();

	// sample for link with simple line
	var node1 = new DefaultNodeModel("Node 1", "rgb(255,99,66)");
	var port1 = node1.addPort(new SRD.DefaultPortModel(false, "out-1", "Out"));
	node1.x = 100;
	node1.y = 100;

	var node2 = new DefaultNodeModel("Node 2", "rgb(192,255,0)");
	var port2 = node2.addPort(new SRD.DefaultPortModel(true, "in-1", "IN"));
	node2.x = 400;
	node2.y = 40;

	var node3 = new DefaultNodeModel("Node 3", "rgb(128,99,255)");
	var port3 = node3.addPort(new SRD.DefaultPortModel(true, "in-2", "IN"));
	node3.x = 300;
	node3.y = 160;

	var link1 = new LinkModel();
	link1.setSourcePort(port1);
	link1.setTargetPort(port2);
	var link2 = new LinkModel();
	link2.setSourcePort(port1);
	link2.setTargetPort(port3);

	model.addNode(node1);
	model.addNode(node2);
	model.addNode(node3);
	model.addLink(link1);
	model.addLink(link2);

	[node1, node2, link1, link2].forEach((item) => {
		item.addListener({
			selectionChanged: (node, isSelected) => {
				action('node')(node);
				action('isSelected')(isSelected);
			}
		});
	});

	engine.setDiagramModel(model);

	var props = {
		diagramEngine: engine,
		maxNumberPointsPerLink: 0, // no extra points so link selection is fired straight away
	} as SRD.DiagramProps;

	return (
		<div>
			<p>Click the diagram elements to inspect some of the possible events.</p>
			<DiagramWidget {...props} />
		</div>
	);
};
