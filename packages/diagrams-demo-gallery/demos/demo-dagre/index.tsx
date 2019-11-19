import createEngine, {
	DiagramModel,
	DefaultNodeModel,
	DefaultPortModel,
	NodeModel,
	DagreEngine,
	DiagramEngine,
	PathFindingLinkFactory
} from '@projectstorm/react-diagrams';
import * as React from 'react';
import { DemoButton, DemoWorkspaceWidget } from '../helpers/DemoWorkspaceWidget';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';

function createNode(name): any {
	return new DefaultNodeModel(name, 'rgb(0,192,255)');
}

let count = 0;

function connectNodes(nodeFrom, nodeTo, engine: DiagramEngine) {
	//just to get id-like structure
	count++;
	const portOut = nodeFrom.addPort(new DefaultPortModel(true, `${nodeFrom.name}-out-${count}`, 'Out'));
	const portTo = nodeTo.addPort(new DefaultPortModel(false, `${nodeFrom.name}-to-${count}`, 'IN'));
	return portOut.link(portTo);

	// ################# UNCOMMENT THIS LINE FOR PATH FINDING #############################
	// return portOut.link(portTo, engine.getLinkFactories().getFactory(PathFindingLinkFactory.NAME));
	// #####################################################################################
}

/**
 * Tests auto distribution
 */
class DemoWidget extends React.Component<{ model: DiagramModel; engine: DiagramEngine }, any> {
	engine: DagreEngine;

	constructor(props) {
		super(props);
		this.engine = new DagreEngine({
			graph: {
				rankdir: 'RL',
				ranker: 'longest-path',
				marginx: 25,
				marginy: 25
			},
			includeLinks: true
		});
	}

	autoDistribute = () => {
		this.engine.redistribute(this.props.model);

		// only happens if pathfing is enabled (check line 25)
		this.reroute();
		this.props.engine.repaintCanvas();
	};

	componentDidMount(): void {
		setTimeout(() => {
			this.autoDistribute();
		}, 500);
	}

	reroute() {
		this.props.engine
			.getLinkFactories()
			.getFactory<PathFindingLinkFactory>(PathFindingLinkFactory.NAME)
			.calculateRoutingMatrix();
	}

	render() {
		return (
			<DemoWorkspaceWidget buttons={<DemoButton onClick={this.autoDistribute}>Re-distribute</DemoButton>}>
				<DemoCanvasWidget>
					<CanvasWidget engine={this.props.engine} />
				</DemoCanvasWidget>
			</DemoWorkspaceWidget>
		);
	}
}

export default () => {
	//1) setup the diagram engine
	let engine = createEngine();

	//2) setup the diagram model
	let model = new DiagramModel();

	//3) create a default nodes
	let nodesFrom: NodeModel[] = [];
	let nodesTo: NodeModel[] = [];

	nodesFrom.push(createNode('from-1'));
	nodesFrom.push(createNode('from-2'));
	nodesFrom.push(createNode('from-3'));

	nodesTo.push(createNode('to-1'));
	nodesTo.push(createNode('to-2'));
	nodesTo.push(createNode('to-3'));

	//4) link nodes together
	let links = nodesFrom.map((node, index) => {
		return connectNodes(node, nodesTo[index], engine);
	});

	// more links for more complicated diagram
	links.push(connectNodes(nodesFrom[0], nodesTo[1], engine));
	links.push(connectNodes(nodesTo[0], nodesFrom[1], engine));
	links.push(connectNodes(nodesFrom[1], nodesTo[2], engine));

	// initial random position
	nodesFrom.forEach((node, index) => {
		node.setPosition(index * 70, index * 70);
		model.addNode(node);
	});

	nodesTo.forEach((node, index) => {
		node.setPosition(index * 70, 100);
		model.addNode(node);
	});

	links.forEach(link => {
		model.addLink(link);
	});

	engine.setModel(model);

	return <DemoWidget model={model} engine={engine} />;
};
