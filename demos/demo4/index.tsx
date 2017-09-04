import * as SRD from "../../src/main";
import * as React from "react";
import {
	DiagramEngine,
	DiagramModel,
	DefaultNodeModel,
	LinkModel,
	PointModel,
	DiagramWidget
} from "../../src/main";

/**
 *
 * Shows how you can lock down the system so that the entire scene cant be interacted with.
 *
 * @Author Dylan Vorster
 */
export default () => {

	//1) setup the diagram engine
	var engine = new DiagramEngine();
	engine.registerNodeFactory(new SRD.DefaultNodeFactory());
	engine.registerLinkFactory(new SRD.DefaultLinkFactory());

	var model = new DiagramModel();

	// sample for link with simple line (no additional points)
	var node1 = new DefaultNodeModel("Node 1","rgb(0,192,255)");
	var port1 = node1.addPort(new SRD.DefaultPortModel(false,"out-1","Out"));
	node1.x = 100;
	node1.y = 100;

	var node2 = new DefaultNodeModel("Node 2","rgb(192,255,0)");
	var port2 = node2.addPort(new SRD.DefaultPortModel(true,"in-1","IN"));
	node2.x = 400;
	node2.y = 100;

	var link1 = new LinkModel();
	link1.setSourcePort(port1);
	link1.setTargetPort(port2);

	model.addNode(node1);
	model.addNode(node2);
	model.addLink(link1);

	// sample for link with complex line (additional points)
	var node3 = new DefaultNodeModel("Node 3","rgb(0,192,255)");
	var port3 = node3.addPort(new SRD.DefaultPortModel(false,"out-2","Out"));
	node3.x = 100;
	node3.y = 250;

	var node4 = new DefaultNodeModel("Node 4","rgb(192,255,0)");
	var port4 = node4.addPort(new SRD.DefaultPortModel(true,"in-2","IN"));
	node4.x = 400;
	node4.y = 250;

	var link2 = new LinkModel();
	link2.setSourcePort(port3);
	link2.setTargetPort(port4);

	var additionalPoint1 = new PointModel(link2,{x:350,y:225});
	link2.addPoint(additionalPoint1);
	var additionalPoint2 = new PointModel(link2,{x:200,y:225});
	link2.addPoint(additionalPoint2);

	model.addNode(node3);
	model.addNode(node4);
	model.addLink(link2);

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

	return <DiagramWidget {...props} />;
}