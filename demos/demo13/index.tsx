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
	DefaultNodeInstanceFactory,
	DefaultPortInstanceFactory,
	LinkInstanceFactory
} from "../../src/main";
import * as React from "react";

/**
 * Tests cloning
 */
class CloneSelected extends React.Component<any, any> {
	constructor(props) {
		super(props);
		this.cloneSelected = this.cloneSelected.bind(this);
	}
	cloneSelected() {
		const {engine} = this.props;
		const offset = {x: 100, y: 100};
		const model = engine.getDiagramModel();
		const originalItems = model.getSelectedItems();
		const selectedItems = originalItems.reduce((res, i) => {
			if (i instanceof NodeModel) {
				res.nodes.push(i);
			} else if (i instanceof LinkModel) {
				res.links.push(i);
			}
			return res;
		}, {nodes: [], links: []});
		let lookupTable = {};
		selectedItems.nodes.forEach( (i) => {

				let node = i.clone(lookupTable);
				model.addNode(node);
				node.setPosition(node.x + offset.x, node.y + offset.y);
		});
		selectedItems.links.forEach( (i) => {
				let link = i.clone(lookupTable);
				link.getPoints().forEach((p) => p.updateLocation({x: p.getX() + offset.x, y: p.getY() + offset.y}));
				model.addLink(link);
		});
		originalItems.forEach((i) => i.selected = false);
		this.forceUpdate();
	}

	render() {
		const { engine } = this.props;
		return (
			<div>
				<DiagramWidget diagramEngine={engine} />
				<button onClick={this.cloneSelected}>Clone Selected</button>
			</div>
		);
	}
}

export default () => {
	//1) setup the diagram engine
	var engine = new DiagramEngine();
	engine.registerNodeFactory(new DefaultNodeFactory());
	engine.registerLinkFactory(new DefaultLinkFactory());

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

	//we need this to help the system know what models to create form the JSON
	engine.registerInstanceFactory(new DefaultNodeInstanceFactory());
	engine.registerInstanceFactory(new DefaultPortInstanceFactory());
	engine.registerInstanceFactory(new LinkInstanceFactory());

	//6) render the diagram!
	return <CloneSelected engine={engine} model={model} />;
};
