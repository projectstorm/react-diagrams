import * as SRD from "../../src/main";
import * as React from "react";
import { DiagramEngine, DiagramModel, DefaultNodeModel, LinkModel, DiagramWidget } from "../../src/main";

/**
 * Shows that a limit of points can be set for links
 */
export default () => {
	// setup the diagram engine
	var engine = new DiagramEngine();
	engine.installDefaultFactories();

	var model = new DiagramModel();

	// sample for link with simple line (no additional points created by default)
	var node1 = new DefaultNodeModel("Node 1", "rgb(255,99,66)");
	var port1 = node1.addPort(new SRD.DefaultPortModel(false, "out-1", "Out"));
	node1.x = 100;
	node1.y = 100;

	var node2 = new DefaultNodeModel("Node 2", "rgb(192,255,0)");
	var port2 = node2.addPort(new SRD.DefaultPortModel(true, "in-1", "IN"));
	node2.x = 400;
	node2.y = 100;

	var link1 = new LinkModel();
	link1.setSourcePort(port1);
	link1.setTargetPort(port2);

	model.addNode(node1);
	model.addNode(node2);
	model.addLink(link1);

	engine.setDiagramModel(model);

	var props = {
		diagramEngine: engine,
		maxNumberPointsPerLink: 5
	} as SRD.DiagramProps;

	return (
		<div>
			<p>A maximum of 5 points can be created per link.</p>
			<DiagramWidget {...props} />
		</div>
	);
};
