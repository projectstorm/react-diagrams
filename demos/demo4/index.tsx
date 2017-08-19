import * as SRD from "../../src/main";
import * as React from "react";
import * as ReactDOM from "react-dom";

require("../../demos/test.scss");

/**
 *
 * Shows how you can lock down the ystem so that the entire scene cant be interacted with.
 *
 * @Author Dylan Vorster
 */
window.onload = () => {

	//1) setup the diagram engine
	var engine = new SRD.DiagramEngine();
	engine.registerNodeFactory(new SRD.DefaultNodeFactory());
	engine.registerLinkFactory(new SRD.DefaultLinkFactory());

	var model = new SRD.DiagramModel();

	var node1 = new SRD.DefaultNodeModel("Node 1","rgb(0,192,255)");
	var port1 = node1.addPort(new SRD.DefaultPortModel(false,"out-1","Out"));
	node1.x = 100;
	node1.y = 100;

	var node2 = new SRD.DefaultNodeModel("Node 2","rgb(192,255,0)");
	var port2 = node2.addPort(new SRD.DefaultPortModel(true,"in-1","IN"));
	node2.x = 400;
	node2.y = 100;

	var link1 = new SRD.LinkModel();
	link1.setSourcePort(port1);
	link1.setTargetPort(port2);

	model.addNode(node1);
	model.addNode(node2);
	model.addLink(link1);

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

	ReactDOM.render(React.createElement(SRD.DiagramWidget,props), document.body);

}