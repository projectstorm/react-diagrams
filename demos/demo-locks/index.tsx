import * as SRD from "../../src/main";
import * as React from "react";
import { DiagramEngine, DiagramModel, DefaultNodeModel, LinkModel, PointModel, DiagramWidget } from "../../src/main";

/**
 *
 * Shows how you can lock down the system so that the entire scene cant be interacted with.
 *
 * @Author Dylan Vorster
 */
export default () => {
	//1) setup the diagram engine
	var engine = new DiagramEngine();
	engine.installDefaultFactories();

	var model = new DiagramModel();

	// sample for link with simple line (no additional points)
	var node1 = new DefaultNodeModel("Node 1", "rgb(0,192,255)");
	var port1 = node1.addOutPort("Out");
	node1.setPosition(100, 100);

	var node2 = new DefaultNodeModel("Node 2", "rgb(192,255,0)");
	var port2 = node2.addInPort("In");
	node2.setPosition(400, 100);

	let link1 = port1.link(port2);

	model.addAll(node1, node2, link1);

	// sample for link with complex line (additional points)
	var node3 = new DefaultNodeModel("Node 3", "rgb(0,192,255)");
	var port3 = node3.addOutPort("Out");
	node3.setPosition(100, 250);

	var node4 = new DefaultNodeModel("Node 4", "rgb(192,255,0)");
	var port4 = node4.addInPort("In");
	node4.setPosition(400, 250);

	var link2 = port3.link(port4);

	link2.point(350, 225);
	link2.point(200, 225);

	model.addAll(node3, node4, link2);

	engine.setDiagramModel(model);

	//!========================================= <<<<<<<

	model.setLocked(true);
	var props = {
		diagramEngine: engine,
		allowLooseLinks: false,
		allowCanvasTranslation: false,
		allowCanvasZoom: false
	} as SRD.DiagramProps;

	//!=========================================  <<<<<<<

	return <DiagramWidget className="srd-demo-canvas" {...props} />;
};
