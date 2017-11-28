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
	DefaultLinkWidget,
	CustomizableLinkProps
} from "../../src/main";
import { action } from "@storybook/addon-actions";
import * as React from "react";
import { LinkWidgetFactory } from "../../src/WidgetFactories";

export class AdvancedLinkModel extends LinkModel {
    constructor() {
        super();
        this.linkType = "advanced";
    }
}

export class AdvancedPortModel extends DefaultPortModel
{
    constructor(isInput: boolean, name: string, label: string = null, id?: string) {
        super(isInput, name, label, id);
    }

    createLinkModel(): LinkModel | null {
        return new AdvancedLinkModel();
	}
}

export class AdvancedLinkWidget extends DefaultLinkWidget {
	constructor(props: LinkProps) {
		super(props);
	}

	beforeLinkGenerated(props: CustomizableLinkProps): CustomizableLinkProps {
		return {
			color: 'green',
			width: 4,
			smooth: props.smooth
		};
	}
}

export class AdvancedLinkWidgetFactory extends LinkWidgetFactory {
	constructor() {
		super("advanced");
	}

	generateReactWidget(diagramEngine: DiagramEngine, link: LinkModel): JSX.Element {
		return React.createElement(AdvancedLinkWidget, {
			link: link,
			diagramEngine: diagramEngine
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
	engine.registerNodeFactory(new DefaultNodeFactory());
	engine.registerLinkFactory(new AdvancedLinkWidgetFactory());
	engine.registerLinkFactory(new DefaultLinkFactory());

	var node1 = new DefaultNodeModel("Source", "rgb(0,192,255)");
	var port1 = node1.addPort(new AdvancedPortModel(false, "out-1", "Out solid"));
	var port2 = node1.addPort(new AdvancedPortModel(false, "out-2", "Out dashed"));
	var port3 = node1.addPort(new DefaultPortModel(false, "out-3", "Out default"));
	node1.x = 100;
	node1.y = 100;

	var node2 = new DefaultNodeModel("Target", "rgb(192,255,0)");
	var port4 = node2.addPort(new AdvancedPortModel(true, "in-1", "In solid"));
	var port5 = node2.addPort(new AdvancedPortModel(true, "in-2", "In dashed"));
	var port6 = node2.addPort(new DefaultPortModel(true, "in-3", "In default"));
	node2.x = 300;
	node2.y = 100;

	[node1, node2].forEach((item) => {
		item.addListener({
			selectionChanged: action('selectionChanged')
		});
	});

	/*function generateNodes(model: DiagramModel, offsetX: number, offsetY: number) {
		//3-A) create a default node
		
		

		//3-B) create another default node
		

		//3-C) link the 2 nodes together
		var link1 = new LinkModel();
		link1.setSourcePort(port1);
		link1.setTargetPort(port2);

		//4) add the models to the root graph
		model.addNode(node1);
		model.addNode(node2);
		model.addLink(link1);
	}*/

	//2) setup the diagram model
	var model = new DiagramModel();

	model.addNode(node1);
	model.addNode(node2); 

	//5) load model into engine
	engine.setDiagramModel(model);

	//6) render the diagram!
	return (
		<div>
			<DiagramWidget diagramEngine={engine} />
		</div>
	);
};
