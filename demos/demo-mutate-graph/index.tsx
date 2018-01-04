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

/**
 * Tests the grid size
 */
class NodeDelayedPosition extends React.Component<any, any> {
	constructor(props) {
		super(props);
		this.updatePosition = this.updatePosition.bind(this);
		this.updatePositionViaSerialize = this.updatePositionViaSerialize.bind(this);
	}

	updatePosition() {
		const { engine } = this.props;
		let model = engine.getDiagramModel();
		const nodes = model.getNodes();
		let node = nodes[Object.keys(nodes)[0]];
		node.setPosition(node.x + 30, node.y + 30);
		this.forceUpdate();
	}

	updatePositionViaSerialize() {
		let { engine } = this.props;
		let model = engine.getDiagramModel();
		let str = JSON.stringify(model.serializeDiagram());
		let model2 = new DiagramModel();
		let obj = JSON.parse(str);
		let node = obj.nodes[0];
		node.x += 30;
		node.y += 30;
		model2.deSerializeDiagram(obj, engine);
		engine.setDiagramModel(model2);
		this.forceUpdate();
	}

	render() {
		const { engine } = this.props;
		return (
			<div>
				<DiagramWidget diagramEngine={engine} />
				<button onClick={this.updatePosition}>Update position</button>
				<button onClick={this.updatePositionViaSerialize}>Update position via serialize</button>
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
	return <NodeDelayedPosition engine={engine} model={model} />;
};
