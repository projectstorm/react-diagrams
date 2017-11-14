import * as dagre from 'dagre';
import * as _ from 'lodash';

const size = {
	width: 60,
	height: 60
};

export function distributeElements(model) {
	let clonedModel = _.cloneDeep(model);
	let nodes = distributeGraph(clonedModel);
	nodes.forEach(node => {
		let modelNode = clonedModel.nodes.find(item => item.id === node.id);
		modelNode.x = node.x;
		modelNode.y = node.y;
	});
	return clonedModel;
}

function distributeGraph(model) {
	console.log(model);
	let nodes = mapElements(model);
	let edges = mapEdges(model);
	let graph = new dagre.graphlib.Graph();
	graph.setGraph({});
	graph.setDefaultEdgeLabel(function () {
		return {};
	});
	//add elements to dagre graph
	nodes.forEach(node => {
		console.log(node);
		graph.setNode(node.id, node.metadata);
	});
	edges.forEach(edge => {
		if (edge.from && edge.to) {
			console.log(edge.from, edge.to);
			graph.setEdge(edge.from, edge.to);
		}
	});
	//auto-distribute
	dagre.layout(graph);
	return graph.nodes().map(node => graph.node(node));
}

function mapElements(model) {
	// dagre compatible format
	return model.nodes.map(node => ({id: node.id, metadata: {...size, id: node.id}}));
}

function mapEdges(model) {
	//returns links which connects nodes
	return model.links.map(link => ({
		from: link.source,
		to: link.target
	}))
		.filter(item => model.nodes.find(node => node.id === item.from) && model.nodes.find(node => node.id === item.to));
}