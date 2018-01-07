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
import {DemoWorkspaceWidget} from "../.helpers/DemoWorkspaceWidget";

/**
 *
 * Simple stress test of the system plus zoom to fit function
 *
 * @Author Dylan Vorster
 */
export default () => {
	//1) setup the diagram engine
	var engine = new DiagramEngine();
	engine.registerNodeFactory(new DefaultNodeFactory());
	engine.registerLinkFactory(new DefaultLinkFactory());

	function generateNodes(model: DiagramModel, offsetX: number, offsetY: number) {
		//3-A) create a default node
		var node1 = new DefaultNodeModel("Node 1", "rgb(0,192,255)");
		var port1 = node1.addPort(new DefaultPortModel(false, "out-1", "Out"));
		node1.x = 100 + offsetX;
		node1.y = 100 + offsetY;

		//3-B) create another default node
		var node2 = new DefaultNodeModel("Node 2", "rgb(192,255,0)");
		var port2 = node2.addPort(new DefaultPortModel(true, "in-1", "IN"));
		node2.x = 200 + offsetX;
		node2.y = 100 + offsetY;

		//3-C) link the 2 nodes together
		var link1 = new LinkModel();
		link1.setSourcePort(port1);
		link1.setTargetPort(port2);

		//4) add the models to the root graph
		model.addNode(node1);
		model.addNode(node2);
		model.addLink(link1);
	}

	//2) setup the diagram model
	var model = new DiagramModel();

	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			generateNodes(model, i * 200, j * 100);
		}
	}

	//5) load model into engine
	engine.setDiagramModel(model);

	//6) render the diagram!
	return (
		<DemoWorkspaceWidget buttons={<button onClick={() => engine.zoomToFit()}>Zoom to fit</button>}>
			<DiagramWidget diagramEngine={engine} />
		</DemoWorkspaceWidget>
	);
};
