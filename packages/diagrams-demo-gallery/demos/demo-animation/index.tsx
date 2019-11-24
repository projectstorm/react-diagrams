import createEngine, { DiagramModel, DefaultNodeModel } from '@projectstorm/react-diagrams';
import * as React from 'react';
import gsap from 'gsap';
import { DemoWorkspaceWidget } from '../helpers/DemoWorkspaceWidget';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';


/**
 * Tests the grid size
 */
class NodeDelayedPosition extends React.Component<any, any> {
	constructor(props) {
		super(props);
	}

	render() {
		const { engine } = this.props;
		return (
			<DemoWorkspaceWidget>
				<DemoCanvasWidget>
					<CanvasWidget engine={engine} />
				</DemoCanvasWidget>
			</DemoWorkspaceWidget>
		);
	}
}

export default () => {
	//1) setup the diagram engine
	var engine = createEngine({ repaintDebounce: true, repaintDebounceMs: 12 });

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

	//3-C) create another default node
	var node3 = new DefaultNodeModel('Node 3', 'rgb(192,255,0)');
	node2.setPosition(200, 300);

	//3-D) create another default node
	var node4 = new DefaultNodeModel('Node 4', 'rgb(192,255,0)');
	node2.setPosition(400, 400);

	//3-C) link the 2 nodes together
	var link1 = port1.link(port2);

	//4) add the models to the root graph
	model.addAll(node1, node2, link1, node3, node4);

	//5) load model into engine
	engine.setModel(model);

	var interval = setInterval(() => {
		[node1, node2, node3, node4].map(node => {
			var obj = { x: 0, y: 0 };
			gsap.fromTo(
				obj,
				{
					x: node.getPosition().x,
					y: node.getPosition().y
				},
				{
					x: Math.floor(Math.random() * 500),
					y: Math.floor(Math.random() * 500),
					duration: 0.8,
					onUpdate: () => {
						node.setPosition(obj.x, obj.y);
						engine.repaintCanvas();
					}
				}
			);
		});
	}, 2000);

	//6) render the diagram!
	return <NodeDelayedPosition engine={engine} model={model} />;
};
