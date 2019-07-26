import createEngine, {
	DiagramModel,
	DefaultNodeModel,
	DiagramWidget,
	DiagramEngine
} from '@projectstorm/react-diagrams';
import * as _ from 'lodash';
import * as React from 'react';
import { DemoWorkspaceWidget } from '../helpers/DemoWorkspaceWidget';

class CloneSelected extends React.Component<{ model: DiagramModel; engine: DiagramEngine }, any> {
	addPorts = () => {
		const nodes: DefaultNodeModel[] = _.values(this.props.model.getNodes()) as DefaultNodeModel[];
		for (let node of nodes) {
			if (node.getInPorts().length > 0) {
				node.addInPort(`in-${node.getInPorts().length + 1}`, false);
			} else {
				node.addOutPort(`out-${node.getOutPorts().length + 1}`, false);
			}
		}
		this.props.engine.repaintCanvas();
	};

	render() {
		const { engine } = this.props;
		return (
			<DemoWorkspaceWidget buttons={<button onClick={this.addPorts}>Add more ports</button>}>
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
