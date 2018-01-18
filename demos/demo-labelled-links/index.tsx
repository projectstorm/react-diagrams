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

	// create two nodes
	const node1 = new DefaultNodeModel("Node A", "rgb(0,192,255)");
	const port1 = node1.addPort(new DefaultPortModel(false, "out-1", "Out"));
	node1.x = 100;
	node1.y = 100;
	const node2 = new DefaultNodeModel("Node B", "rgb(255,255,0)");
	const port2 = node2.addPort(new DefaultPortModel(true, "in-1", "IN"));
	node2.x = 400;
	node2.y = 50;
	const node3 = new DefaultNodeModel("Node C (no label)", "rgb(192,255,255)");
	const port3 = node3.addPort(new DefaultPortModel(true, "in-1", "IN"));
	node3.x = 450;
	node3.y = 180;
	const node4 = new DefaultNodeModel("Node D", "rgb(192,0,255)");
	const port4 = node4.addPort(new DefaultPortModel(true, "in-1", "IN"));
	node4.x = 300;
	node4.y = 250;

	// link node A and B together and give it a label
	const link1 = new LinkModel();
	link1.setSourcePort(port1);
	link1.setTargetPort(port2);
	link1.setLabel('Custom label');

	// no label for A and C
	const link2 = new LinkModel();
	link2.setSourcePort(port1);
	link2.setTargetPort(port3);

	// also a label for A and D
	const link3 = new LinkModel();
	link3.setSourcePort(port1);
	link3.setTargetPort(port4);
	link3.setLabel('Emoji label: 🎉');

	// add all to the main model
	model.addNode(node1);
	model.addNode(node2);
	model.addNode(node3);
	model.addNode(node4);
	model.addLink(link1);
	model.addLink(link2);
	model.addLink(link3);

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
			<DiagramWidget diagramEngine={engine} maxNumberPointsPerLink={0} />
		</DemoWorkspaceWidget>
	);
};
