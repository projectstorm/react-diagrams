import * as SRD from "../../src/main";
import * as React from "react";
import * as ReactDOM from "react-dom";

declare var require;

require("../test.scss");


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
	
	
	function generateNodes(model: SRD.DiagramModel, offsetX: number,offsetY: number){
		//3-A) create a default node
		var node1 = new SRD.NodeModel();
		node1.extras= {
			name:"Node 1",
			color: 'rgb(0,192,255)',
			outPorts: ['out-1']
		};
		node1.x = 100 + offsetX;
		node1.y = 100 + offsetY;
		var port1 = node1.addPort(new SRD.PortModel("out-1"));

		//3-B) create another default node
		var node2 = new SRD.NodeModel();
		node2.extras= {
			name:"Node 2",
			color: 'rgb(192,255,0)',
			inPorts: ['in-1']
		};
		node2.x = 400 + offsetX;
		node2.y = 100 + offsetY;
		var port2 = node2.addPort(new SRD.PortModel("in-1"));

		//3-C) link the 2 nodes together
		var link1 = new SRD.LinkModel();
		link1.setSourcePort(port1);
		link1.setTargetPort(port2);

		//4) add the models to the root graph
		model.addNode(node1);
		model.addNode(node2);
		model.addLink(link1);
	}
	
	//2) setup the diagram model
	var model = new SRD.DiagramModel();
	
	generateNodes(model,0,0);
	generateNodes(model,0,100);
	generateNodes(model,0,200);
	generateNodes(model,0,300);
	generateNodes(model,0,400);
	
	generateNodes(model,400,0);
	generateNodes(model,400,100);
	generateNodes(model,400,200);
	generateNodes(model,400,300);
	generateNodes(model,400,400);
	
	generateNodes(model,800,0);
	generateNodes(model,800,100);
	generateNodes(model,800,200);
	generateNodes(model,800,300);
	generateNodes(model,800,400);
	
	
	//5) load model into engine
	engine.setDiagramModel(model);
	
	//6) render the diagram!
	ReactDOM.render(React.createElement(SRD.DiagramWidget,{diagramEngine: engine}), document.body);
	
}