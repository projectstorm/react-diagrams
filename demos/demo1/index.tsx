import {
	DiagramEngine,
	DefaultNodeFactory,
	DefaultLinkFactory,
	DiagramModel,
	DefaultNodeModel,
	LinkModel,
	DefaultPortModel,
	DiagramWidget,
	DefaultNodeInstanceFactory,
	DefaultPortInstanceFactory,
	LinkInstanceFactory
} from "../../src/main";
import * as React from "react";
import * as ReactDOM from "react-dom";

var data = require("../test.scss");


/**
 *
 * Simple test showing the Object oriented way of using this library.
 * It creates 2 nodes and links them together with a single link
 *
 * @Author Dylan Vorster
 */
window.onload = () => {

	//1) setup the diagram engine
	var engine = new DiagramEngine();
	engine.registerNodeFactory(new DefaultNodeFactory());
	engine.registerLinkFactory(new DefaultLinkFactory());


	//2) setup the diagram model
	var model = new DiagramModel();

	//3-A) create a default node
	var node1 = new DefaultNodeModel("Node 1","rgb(0,192,255)");
	var port1 = node1.addPort(new DefaultPortModel(false,"out-1","Out"));
	node1.x = 100;
	node1.y = 100;

	//3-B) create another default node
	var node2 = new DefaultNodeModel("Node 2","rgb(192,255,0)");
	var port2 = node2.addPort(new DefaultPortModel(true,"in-1","IN"));
	node2.x = 400;
	node2.y = 100;

	//3-C) link the 2 nodes together
	var link1 = new LinkModel();
	link1.setSourcePort(port1);
	link1.setTargetPort(port2);

	//4) add the models to the root graph
	model.addNode(node1);
	model.addNode(node2);
	model.addLink(link1);

	//5) load model into engine
	engine.setDiagramModel(model);

	//6) render the diagram!
	ReactDOM.render(<DiagramWidget diagramEngine={engine} />, document.body);


	//!------------- SERIALIZING / DESERIALIZING ------------

	//we need this to help the system know what models to create form the JSON
	engine.registerInstanceFactory(new DefaultNodeInstanceFactory());
	engine.registerInstanceFactory(new DefaultPortInstanceFactory());
	engine.registerInstanceFactory(new LinkInstanceFactory());

	//serialize the model
	var str = JSON.stringify(model.serializeDiagram());
	console.log(str);

	//deserialize the model
	var model2 = new DiagramModel();
	model2.deSerializeDiagram(JSON.parse(str),engine);
	engine.setDiagramModel(model2);
	console.log(model2);

	//re-render the model
	ReactDOM.render(<DiagramWidget diagramEngine={engine} />, document.body);
}