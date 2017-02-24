import * as SRD from "../../src/main";
import * as React from "react";
import * as ReactDOM from "react-dom";

declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

require("../test.scss");

/**
 * 
 * Simple stress test of the system, shows that it can handle many nodes, and 
 * retain good performance
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
		var node1 = new SRD.DefaultNodeModel("Node 1","rgb(0,192,255)");
		var port1 = node1.addPort(new SRD.DefaultPortModel(false,"out-1","Out"));
		node1.x = 100 + offsetX;
		node1.y = 100 + offsetY;

		//3-B) create another default node
		var node2 = new SRD.DefaultNodeModel("Node 2","rgb(192,255,0)");
		var port2 = node2.addPort(new SRD.DefaultPortModel(true,"in-1","IN"));
		node2.x = 200 + offsetX;
		node2.y = 100 + offsetY;

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
	
	for(var i =0;i < 8;i++){
		for(var j = 0;j < 8;j++){
			generateNodes(model,i*200,j*100);
		}
	}
	
	
	
	//5) load model into engine
	engine.setDiagramModel(model);
	
	//6) render the diagram!
	ReactDOM.render(React.createElement(SRD.DiagramWidget,{diagramEngine: engine}), document.body);
	
}