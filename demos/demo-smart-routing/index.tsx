import {
	DiagramEngine,
	DiagramModel,
	DefaultNodeModel,
	LinkModel,
	DefaultPortModel,
	DiagramWidget
} from "../../src/main";
import * as React from "react";
import { DemoWorkspaceWidget } from "../.helpers/DemoWorkspaceWidget";
import { action } from "@storybook/addon-actions";

export default () => {
	// setup the diagram engine
	const engine = new DiagramEngine();
	engine.installDefaultFactories();

	// setup the diagram model
	const model = new DiagramModel();

	// create four nodes in a way that straight links wouldn't work
	const node1 = new DefaultNodeModel("Node A", "rgb(0,192,255)");
	const port1 = node1.addPort(new DefaultPortModel(false, "out-1", "Out"));
	node1.x = 340;
	node1.y = 350;
	const node2 = new DefaultNodeModel("Node B", "rgb(255,255,0)");
	const port2 = node2.addPort(new DefaultPortModel(false, "out-1", "Out"));
	node2.x = 240;
	node2.y = 80;
	const node3 = new DefaultNodeModel("Node C", "rgb(192,255,255)");
	const port3 = node3.addPort(new DefaultPortModel(true, "in-1", "In"));
	node3.x = 540;
	node3.y = 180;
	const node4 = new DefaultNodeModel("Node D", "rgb(192,0,255)");
	const port4 = node4.addPort(new DefaultPortModel(true, "in-1", "In"));
	node4.x = 95;
	node4.y = 185;
	const node5 = new DefaultNodeModel("Node E", "rgb(192,255,0)");
	const port5 = node5.addPort(new DefaultPortModel(true, "in-1", "In"));
	node5.x = 250;
	node5.y = 180;

	// linking things together
	const link1 = new LinkModel();
	link1.setSourcePort(port1);
	link1.setTargetPort(port4);
	const link2 = new LinkModel();
	link2.setSourcePort(port2);
	link2.setTargetPort(port3);

	// add all to the main model
	model.addNode(node1);
	model.addNode(node2);
	model.addNode(node3);
	model.addNode(node4);
	model.addNode(node5);
	model.addLink(link1);
	model.addLink(link2);

	// load model into engine and render
	engine.setDiagramModel(model);

	return (
		<DemoWorkspaceWidget
			buttons={
				<button
					onClick={() => {
						action("Serialized Graph")(JSON.stringify(model.serializeDiagram(), null, 2));
					}}
				>
					Serialize Graph
				</button>
			}
		>
			<DiagramWidget diagramEngine={engine} smartRouting={true} maxNumberPointsPerLink={0} />
		</DemoWorkspaceWidget>
	);
};
