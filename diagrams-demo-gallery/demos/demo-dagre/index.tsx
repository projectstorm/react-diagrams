import createEngine, {
	DiagramModel,
	DefaultNodeModel,
	DefaultPortModel,
	NodeModel,
	DagreEngine,
	DiagramEngine,
	PathFindingLinkFactory
} from '@projectstorm/react-diagrams';
import { useLayoutEffect, useRef } from 'react';
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
function genDagreEngine() {
	return new DagreEngine({
		graph: {
			rankdir: 'RL',
			ranker: 'longest-path',
			marginx: 25,
			marginy: 25
		},
		includeLinks: true,
		nodeMargin: 25
	});
}

function autoDistribute(engine: DiagramEngine) {
	const model = engine.getModel();

	const dagreEngine = genDagreEngine();
	dagreEngine.redistribute(model);

	reroute(engine);
	engine.repaintCanvas();
}

function autoRefreshLinks(engine: DiagramEngine) {
	const model = engine.getModel();

	const dagreEngine = genDagreEngine();
	dagreEngine.refreshLinks(model);

	// only happens if pathfing is enabled (check line 29)
	reroute(engine);
	engine.repaintCanvas();
}

function reroute(engine: DiagramEngine) {
		engine
			.getLinkFactories()
			.getFactory<PathFindingLinkFactory>(PathFindingLinkFactory.NAME)
			.calculateRoutingMatrix();
}

function DemoWidget(props) {
	const engine = props.engine;

	useLayoutEffect(() => {
		autoDistribute(engine);
	}, []);

	const redistribute = () => {
		autoDistribute(engine);
	}

	const refreshLinks = () => {
		autoRefreshLinks(engine);
	}

	return (
		<DemoWorkspaceWidget
			buttons={
				<div>
					<DemoButton onClick={redistribute}>Re-distribute</DemoButton>
					<DemoButton onClick={refreshLinks}>Refresh Links</DemoButton>
				</div>
			}
		>
			<DemoCanvasWidget>
				<CanvasWidget engine={engine} />
			</DemoCanvasWidget>
		</DemoWorkspaceWidget>
	);
}

export default () => {
	//1) setup the diagram engine
	const engineRef = useRef(createEngine());
	let engine = engineRef.current;

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
	links.push(connectNodes(nodesTo[0], nodesTo[1], engine));
	links.push(connectNodes(nodesTo[1], nodesTo[2], engine));
	links.push(connectNodes(nodesTo[0], nodesTo[2], engine));
	links.push(connectNodes(nodesFrom[0], nodesFrom[2], engine));
	links.push(connectNodes(nodesFrom[0], nodesTo[2], engine));

	// initial random position
	nodesFrom.forEach((node, index) => {
		node.setPosition(index * 70, index * 70);
		model.addNode(node);
	});

	nodesTo.forEach((node, index) => {
		node.setPosition(index * 70, 100);
		model.addNode(node);
	});

	links.forEach((link) => {
		model.addLink(link);
	});

	engine.setModel(model);

	return <DemoWidget model={model} engine={engine} />;
};
