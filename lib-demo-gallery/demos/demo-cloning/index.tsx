import createEngine, {
	DiagramModel,
	DefaultNodeModel,
	LinkModel,
	NodeModel,
	DiagramWidget,
	BaseModel
} from '@projectstorm/react-diagrams';
import * as _ from 'lodash';
import * as React from 'react';
import { DemoWorkspaceWidget } from '../helpers/DemoWorkspaceWidget';

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
		let model = engine.getDiagramModel();

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
				<DiagramWidget className="srd-demo-canvas" diagramEngine={engine} />
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
	engine.setDiagramModel(model);

	//6) render the diagram!
	return <CloneSelected engine={engine} model={model} />;
};
