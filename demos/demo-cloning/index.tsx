import {
	DiagramEngine,
	DefaultNodeFactory,
	DefaultLinkFactory,
	DiagramModel,
	DefaultNodeModel,
	LinkModel,
	NodeModel,
	DefaultPortModel,
	DiagramWidget,
	BaseModel
} from "../../src/main";
import * as _ from "lodash";
import * as React from "react";
import { DemoWorkspaceWidget } from "../.helpers/DemoWorkspaceWidget";
import { DefaultPortFactory } from "../../src/defaults/DefaultPortFactory";

/**
 * Tests cloning
 */
class CloneSelected extends React.Component<any, any> {
	constructor(props) {
		super(props);
		this.cloneSelected = this.cloneSelected.bind(this);
	}

	cloneSelected() {
		let { engine } = this.props;
		let offset = { x: 100, y: 100 };
		let model = engine.getDiagramModel();
		let originalItems = model.getSelectedItems("link", "node");

		let itemMap = {};
		_.forEach(model.getSelectedItems(), (item: BaseModel<any>) => {
			let newItem = item.clone(itemMap);

			// offset the nodes slightly
			if (newItem instanceof NodeModel) {
				newItem.setPosition(newItem.x + offset.x, newItem.y + offset.y);
				model.addNode(newItem);
			} else if (newItem instanceof LinkModel) {
				// offset the link points
				newItem.getPoints().forEach(p => {
					p.updateLocation({ x: p.getX() + offset.x, y: p.getY() + offset.y });
				});
				model.addLink(newItem);
			}
			newItem.selected = false;
		});

		this.forceUpdate();
	}

	render() {
		const { engine } = this.props;
		return (
			<DemoWorkspaceWidget buttons={<button onClick={this.cloneSelected}>Clone Selected</button>}>
				<DiagramWidget diagramEngine={engine} />
			</DemoWorkspaceWidget>
		);
	}
}

export default () => {
	//1) setup the diagram engine
	var engine = new DiagramEngine();
	engine.installDefaultFactories();

	//2) setup the diagram model
	var model = new DiagramModel();

	//3-A) create a default node
	var node1 = new DefaultNodeModel("Node 1", "rgb(0,192,255)");
	var port1 = node1.addPort(new DefaultPortModel(false, "out-1", "Out"));
	node1.x = 100;
	node1.y = 100;

	//3-B) create another default node
	var node2 = new DefaultNodeModel("Node 2", "rgb(192,255,0)");
	var port2 = node2.addPort(new DefaultPortModel(true, "in-1", "IN"));
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
	return <CloneSelected engine={engine} model={model} />;
};
