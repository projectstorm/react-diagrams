import createEngine, { DiagramModel, DefaultNodeModel } from '@projectstorm/react-diagrams';
import * as React from 'react';
import { DemoButton, DemoWorkspaceWidget } from '../helpers/DemoWorkspaceWidget';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';

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
			<DemoWorkspaceWidget
				buttons={[
					<DemoButton key={1} onClick={this.updatePosition}>
						Update position
					</DemoButton>,
					<DemoButton key={2} onClick={this.updatePositionViaSerialize}>
						Update position via serialize
					</DemoButton>
				]}>
				<DemoCanvasWidget>
					<CanvasWidget engine={engine} />
				</DemoCanvasWidget>
			</DemoWorkspaceWidget>
		);
	}
}

export default () => {
	//1) setup the diagram engine
	var engine = createEngine();

	//2) setup the diagram model
	var model = new DiagramModel();

	//3-A) create a default node
	var node1 = new DefaultNodeModel('Node 1', 'rgb(0,192,255)');
	var port1 = node1.addOutPort('Out');
	node1.setPosition(100, 100);

	//3-B) create another default node
	var node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
	var port2 = node2.addInPort('In');
	node2.setPosition(400, 100);

	//3-C) link the 2 nodes together
	var link1 = port1.link(port2);

	//4) add the models to the root graph
	model.addAll(node1, node2, link1);

	//5) load model into engine
	engine.setModel(model);

	//6) render the diagram!
	return <NodeDelayedPosition engine={engine} model={model} />;
};
