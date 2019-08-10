import createEngine, { DiagramModel, DefaultNodeModel, LinkModel, NodeModel } from '@projectstorm/react-diagrams';
import * as _ from 'lodash';
import * as React from 'react';
import { DemoButton, DemoWorkspaceWidget } from '../helpers/DemoWorkspaceWidget';
import { BaseModel, CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';

/**
 * Tests cloning
 */
class CloneSelected extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.cloneSelected = this.cloneSelected.bind(this);
	}

	cloneSelected() {
		let { engine } = this.props;
		let offset = { x: 100, y: 100 };
		let model = engine.getModel();

		let itemMap = {};
		_.forEach(model.getSelectedEntities(), (item: BaseModel<any>) => {
			let newItem = item.clone(itemMap);

			// offset the nodes slightly
			if (newItem instanceof NodeModel) {
				newItem.setPosition(newItem.getX() + offset.x, newItem.getY() + offset.y);
				model.addNode(newItem);
			} else if (newItem instanceof LinkModel) {
				// offset the link points
				newItem.getPoints().forEach(p => {
					p.setPosition(p.getX() + offset.x, p.getY() + offset.y);
				});
				model.addLink(newItem);
			}
			(newItem as BaseModel).setSelected(false);
		});

		this.forceUpdate();
	}

	render() {
		const { engine } = this.props;
		return (
			<DemoWorkspaceWidget buttons={<DemoButton onClick={this.cloneSelected}>Clone Selected</DemoButton>}>
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
	let port = node1.addOutPort('Out');
	node1.setPosition(100, 100);

	//3-B) create another default node
	var node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
	let port2 = node2.addInPort('In');
	node2.setPosition(400, 100);

	// link the ports
	let link1 = port.link(port2);

	//4) add the models to the root graph
	model.addAll(node1, node2, link1);

	//5) load model into engine
	engine.setModel(model);

	//6) render the diagram!
	return <CloneSelected engine={engine} model={model} />;
};
