import {
	DiagramEngine,
	DefaultNodeFactory,
	DefaultLinkFactory,
	DiagramModel,
	DefaultNodeModel,
	LinkModel,
	DefaultPortModel,
	DiagramWidget,
	LinkWidget,
	LinkProps,
	DefaultLinkWidget
} from "../../src/main";
import { action } from "@storybook/addon-actions";
import * as React from "react";
import { LinkFactory } from "../../src/AbstractFactory";

export class AdvancedLinkModel extends LinkModel {
	size: number;
	color: string;

	constructor() {
		super("advanced");
		this.color = "green";
		this.size = 6;
	}
}

export class AdvancedPortModel extends DefaultPortModel {
	constructor(isInput: boolean, name: string, label: string = null, id?: string) {
		super(isInput, name, label, id);
	}

	createLinkModel(): LinkModel | null {
		var link = new AdvancedLinkModel();
		link.setSourcePort(this);
		return link;
	}
}

export class AdvancedLinkWidgetFactory extends LinkFactory<AdvancedLinkModel> {
	getNewInstance(initialConfig?: any): AdvancedLinkModel {
		return new AdvancedLinkModel();
	}

	constructor() {
		super("advanced");
	}

	generateReactWidget(diagramEngine: DiagramEngine, link: AdvancedLinkModel): JSX.Element {
		return React.createElement(DefaultLinkWidget, {
			color: link.color,
			width: link.size,
			link,
			diagramEngine
		});
	}
}
/**
 *
 * Simple link styling demo
 *
 * @Author kfrajtak
 */
export default () => {
	//1) setup the diagram engine
	var engine = new DiagramEngine();
	engine.installDefaultFactories();
	engine.registerLinkFactory(new AdvancedLinkWidgetFactory());

	var node1 = new DefaultNodeModel("Source", "rgb(0,192,255)");
	var port1 = node1.addPort(new AdvancedPortModel(false, "out-1", "Out thick"));
	var port2 = node1.addPort(new DefaultPortModel(false, "out-2", "Out default"));
	node1.x = 100;
	node1.y = 100;

	var node2 = new DefaultNodeModel("Target", "rgb(192,255,0)");
	var port3 = node2.addPort(new AdvancedPortModel(true, "in-1", "In thick"));
	var port4 = node2.addPort(new DefaultPortModel(true, "in-2", "In default"));
	node2.x = 300;
	node2.y = 100;

	var node3 = new DefaultNodeModel("Source", "rgb(0,192,255)");
	var port5 = node3.addPort(new AdvancedPortModel(false, "out-1", "Out thick"));
	var port6 = node3.addPort(new DefaultPortModel(false, "out-2", "Out default"));
	node3.x = 100;
	node3.y = 200;

	var node4 = new DefaultNodeModel("Target", "rgb(192,255,0)");
	var port7 = node4.addPort(new AdvancedPortModel(true, "in-1", "In thick"));
	var port8 = node4.addPort(new DefaultPortModel(true, "in-2", "In default"));
	node4.x = 300;
	node4.y = 200;
	var model = new DiagramModel();

	model.addNode(node1);
	model.addNode(node2);
	model.addNode(node3);
	model.addNode(node4);

	var link1 = node1.getOutPorts()[0].createLinkModel();
	if (link1) {
		link1.setTargetPort(port3);
		model.addLink(link1);
	}

	var link2 = node1.getOutPorts()[1].createLinkModel();
	if (link2) {
		link2.setTargetPort(port4);
		model.addLink(link2);
	}

	// load model into engine
	engine.setDiagramModel(model);

	// render the diagram!
	return <DiagramWidget diagramEngine={engine} />;
};
