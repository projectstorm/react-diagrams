import * as SRD from "../../src/main";
import * as React from "react";
import * as ReactDOM from "react-dom";

declare var require;

require("./test.scss");


/**
 * 
 * Simple test showing the Object oriented way of using this library.
 * It creates 2 nodes and links them together with a single link
 * 
 * @Author Dylan Vorster
 */
window.onload = () => {
	
	//1) setup the diagram engine
	var engine = new SRD.DiagramEngine();
	engine.registerNodeFactory(new SRD.DefaultNodeFactory());
	engine.registerLinkFactory(new SRD.DefaultLinkFactory());
	
	//2) setup the diagram model
	var model = new SRD.DiagramModel();
	
	var node1 = new SRD.NodeModel();
	node1.extras= {
		name:"Node 1",
		color: 'rgb(0,192,255)',
		outPorts: ['out-1']
	};
	node1.x = 100;
	node1.y = 100;
	
	var node2 = new SRD.NodeModel();
	node2.extras= {
		name:"Node 2",
		color: 'rgb(192,255,0)',
		inPorts: ['in-1']
	};
	node2.x = 400;
	node2.y = 100;
	
	var link1 = new SRD.LinkModel();
	link1.source = node1.getID();
	link1.target = node2.getID();
	link1.sourcePort = 'out-1';
	link1.targetPort = 'in-1';
	
	model.addNode(node1);
	model.addNode(node2);
	model.addLink(link1);
	
	//3) load model into engine
	engine.setDiagramModel(model);
	
	//4) render the diagram
	ReactDOM.render(React.createElement(SRD.DiagramWidget,{diagramEngine: engine}), document.body);
	
}