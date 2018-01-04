import {
	DiagramEngine,
	DefaultNodeFactory,
	DefaultLinkFactory,
	DiagramModel,
	DefaultNodeModel,
	LinkModel,
	DefaultPortModel,
	DiagramWidget
} from "../../src/main";
import * as React from "react";
import { DiamondNodeModel } from "./DiamondNodeModel";
import { DiamondWidgetFactory } from "./DiamondWidgetFactory";

/**
 * @Author Dylan Vorster
 */
export default () => {
	//1) setup the diagram engine
	var engine = new DiagramEngine();
	engine.registerNodeFactory(new DefaultNodeFactory());
	engine.registerLinkFactory(new DefaultLinkFactory());
	engine.registerNodeFactory(new DiamondWidgetFactory());

	//2) setup the diagram model
	var model = new DiagramModel();

	//3-A) create a default node
	var node1 = new DefaultNodeModel("Node 1", "rgb(0,192,255)");
	var port1 = node1.addPort(new DefaultPortModel(false, "out-1", "Out"));
	node1.x = 100;
	node1.y = 150;

	//3-B) create our new custom node
	var node2 = new DiamondNodeModel();
	node2.x = 400;
	node2.y = 100;

	var node3 = new DefaultNodeModel("Node 3", "red");
	var port3 = node3.addPort(new DefaultPortModel(true, "in-1", "In"));
	node3.x = 800;
	node3.y = 150;

	//3-C) link the 2 nodes together
	var link1 = new LinkModel();
	link1.setSourcePort(port1);
	link1.setTargetPort(node2.ports["left"]);

	var link2 = new LinkModel();
	link2.setSourcePort(node2.ports["right"]);
	link2.setTargetPort(port3);

	//4) add the models to the root graph
	model.addNode(node1);
	model.addNode(node2);
	model.addNode(node3);
	model.addLink(link1);
	model.addLink(link2);

	//5) load model into engine
	engine.setDiagramModel(model);

	//6) render the diagram!

	return <DiagramWidget diagramEngine={engine} />;

	// //!------------- SERIALIZING / DESERIALIZING ------------
	//
	// //we need this to help the system know what models to create form the JSON
	// engine.registerInstanceFactory(new SRD.DefaultNodeInstanceFactory());
	// engine.registerInstanceFactory(new SRD.DefaultPortInstanceFactory());
	// engine.registerInstanceFactory(new SRD.LinkInstanceFactory());
	// engine.registerInstanceFactory(new DiamondNodeFactory());
	// engine.registerInstanceFactory(new DiamondPortFactory());
	//
	// //serialize the model
	// var str = JSON.stringify(model.serializeDiagram());
	// console.log(str);
	//
	// //deserialize the model
	// var model2 = new SRD.DiagramModel();
	// model2.deSerializeDiagram(JSON.parse(str),engine);
	// engine.setDiagramModel(model2);
	// console.log(model2);
	//
	// //re-render the model
	// ReactDOM.render(React.createElement(SRD.DiagramWidget,{diagramEngine: engine}), document.body);
};
