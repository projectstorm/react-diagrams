import { DiagramModel, PointModel } from '@projectstorm/react-diagrams-core';
import * as dagre from 'dagre';
import { GraphLabel } from 'dagre';
import _every from 'lodash/every';
import _findIndex from 'lodash/findIndex';
import _forEach from 'lodash/forEach';
import _map from 'lodash/map';
import _range from 'lodash/range';
import _sortBy from 'lodash/sortBy';
import { Point } from '@projectstorm/geometry';

export interface DagreEngineOptions {
	graph?: GraphLabel;
	/**
	 * Will also re-layout links
	 */
	includeLinks?: boolean;
	nodeMargin?: number;
}

export class DagreEngine {
	options: DagreEngineOptions;

	constructor(options: DagreEngineOptions = {}) {
		this.options = options;
	}

	redistribute(model: DiagramModel) {
		// Create a new directed graph
		var g = new dagre.graphlib.Graph({
			multigraph: true,
			compound: true
		});
		g.setGraph(this.options.graph || {});
		g.setDefaultEdgeLabel(function () {
			return {};
		});

		// set nodes
		_forEach(model.getNodes(), (node) => {
			g.setNode(node.getID(), { width: node.width, height: node.height });
		});

		_forEach(model.getLinks(), (link) => {
			// set edges
			if (link.getSourcePort() && link.getTargetPort()) {
				g.setEdge({
					v: link.getSourcePort().getNode().getID(),
					w: link.getTargetPort().getNode().getID(),
					name: link.getID()
				});
			}
		});

		// layout the graph
		dagre.layout(g);

		g.nodes().forEach((v) => {
			const node = g.node(v);
			model.getNode(v).setPosition(node.x - node.width / 2, node.y - node.height / 2);
		});

		// also include links?
		if (this.options.includeLinks) {
			g.edges().forEach((e) => {
				const edge = g.edge(e);
				const link = model.getLink(e.name);

				const points = [link.getFirstPoint()];
				for (let i = 1; i < edge.points.length - 1; i++) {
					points.push(new PointModel({ link: link, position: new Point(edge.points[i].x, edge.points[i].y) }));
				}
				link.setPoints(points.concat(link.getLastPoint()));
			});
		}
	}

	/**
	 * TODO cleanup this method into smaller methods
	 */
	public refreshLinks(diagram: DiagramModel) {
		const { nodeMargin } = this.options;
		const nodes = diagram.getNodes();
		const links = diagram.getLinks();
		let maxChunkRowIndex = -1;
		// build the chunk matrix
		const chunks: { [id: number]: { [id: number]: boolean } } = {}; // true: occupied, false: blank
		const NodeXColumnIndexDictionary: { [id: number]: number } = {};
		let verticalLines: number[] = [];
		_forEach(nodes, (node) => {
			// find vertical lines. vertical lines go through maximum number of nodes located under each other.
			const nodeColumnCenter = node.getX() + node.width / 2;
			if (
				_every(verticalLines, (vLine) => {
					return Math.abs(nodeColumnCenter - vLine) > nodeMargin;
				})
			) {
				verticalLines.push(nodeColumnCenter);
			}
		});

		// sort chunk columns
		verticalLines = verticalLines.sort((a, b) => a - b);
		_forEach(verticalLines, (line, index) => {
			chunks[index] = {};
			chunks[index + 0.5] = {};
		});

		// set occupied chunks
		_forEach(nodes, (node) => {
			const nodeColumnCenter = node.getX() + node.width / 2;
			const startChunkIndex = Math.floor(node.getY() / nodeMargin);
			const endChunkIndex = Math.floor((node.getY() + node.height) / nodeMargin);
			// find max ChunkRowIndex
			if (endChunkIndex > maxChunkRowIndex) maxChunkRowIndex = endChunkIndex;
			const nodeColumnIndex = _findIndex(verticalLines, (vLine) => {
				return Math.abs(nodeColumnCenter - vLine) <= nodeMargin;
			});
			_forEach(_range(startChunkIndex, endChunkIndex + 1), (chunkIndex) => {
				chunks[nodeColumnIndex][chunkIndex] = true;
			});
			NodeXColumnIndexDictionary[node.getX()] = nodeColumnIndex;
		});

		// sort links based on their distances
		const edges = _map(links, (link) => {
			if (link.getSourcePort() && link.getTargetPort()) {
				const source = link.getSourcePort().getNode();
				const target = link.getTargetPort().getNode();
				const sourceIndex = NodeXColumnIndexDictionary[source.getX()];
				const targetIndex = NodeXColumnIndexDictionary[target.getX()];

				return sourceIndex > targetIndex
					? {
							link,
							sourceIndex,
							sourceY: source.getY() + source.height / 2,
							source,
							targetIndex,
							targetY: target.getY() + source.height / 2,
							target
					  }
					: {
							link,
							sourceIndex: targetIndex,
							sourceY: target.getY() + target.height / 2,
							source: target,
							targetIndex: sourceIndex,
							targetY: source.getY() + source.height / 2,
							target: source
					  };
			}
		});
		const sortedEdges = _sortBy(edges, (link) => {
			return Math.abs(link.targetIndex - link.sourceIndex);
		});

		// set link points
		if (this.options.includeLinks) {
			_forEach(sortedEdges, (edge) => {
				const link = diagram.getLink(edge.link.getID());
				// re-draw
				if (Math.abs(edge.sourceIndex - edge.targetIndex) > 1) {
					// get the length of link in column
					const columns = _range(edge.sourceIndex - 1, edge.targetIndex);

					const chunkIndex = Math.floor(edge.sourceY / nodeMargin);
					const targetChunkIndex = Math.floor(edge.targetY / nodeMargin);

					// check upper paths
					let northCost = 1;
					let aboveRowIndex = chunkIndex;
					for (; aboveRowIndex >= 0; aboveRowIndex--, northCost++) {
						if (
							_every(columns, (columnIndex) => {
								return !(
									chunks[columnIndex][aboveRowIndex] ||
									chunks[columnIndex + 0.5][aboveRowIndex] ||
									chunks[columnIndex - 0.5][aboveRowIndex]
								);
							})
						) {
							break;
						}
					}

					// check lower paths
					let southCost = 0;
					let belowRowIndex = chunkIndex;
					for (; belowRowIndex <= maxChunkRowIndex; belowRowIndex++, southCost++) {
						if (
							_every(columns, (columnIndex) => {
								return !(
									chunks[columnIndex][belowRowIndex] ||
									chunks[columnIndex + 0.5][belowRowIndex] ||
									chunks[columnIndex - 0.5][belowRowIndex]
								);
							})
						) {
							break;
						}
					}
					// pick the cheapest path
					const pathRowIndex =
						southCost + (belowRowIndex - targetChunkIndex) < northCost + (targetChunkIndex - aboveRowIndex)
							? belowRowIndex + 1
							: aboveRowIndex - 1;

					// Finally update the link points
					const points = [link.getFirstPoint()];
					points.push(
						new PointModel({
							link: link,
							position: new Point(
								(verticalLines[columns[0]] + verticalLines[columns[0] + 1]) / 2,
								(pathRowIndex + 0.5) * nodeMargin
							)
						})
					);

					_forEach(columns, (column) => {
						points.push(
							new PointModel({
								link: link,
								position: new Point(verticalLines[column], (pathRowIndex + 0.5) * nodeMargin)
							})
						);
						points.push(
							new PointModel({
								link: link,
								position: new Point(
									(verticalLines[column] + verticalLines[column - 1]) / 2,
									(pathRowIndex + 0.5) * nodeMargin
								)
							})
						);
						chunks[column][pathRowIndex] = true;
						chunks[column][pathRowIndex + 1] = true;
						chunks[column + 0.5][pathRowIndex] = true;
						chunks[column + 0.5][pathRowIndex + 1] = true;
					});
					link.setPoints(points.concat(link.getLastPoint()));
				} else {
					// refresh
					link.setPoints([link.getFirstPoint(), link.getLastPoint()]);
					const columnIndex = (edge.sourceIndex + edge.targetIndex) / 2;
					if (!chunks[columnIndex]) {
						chunks[columnIndex] = {};
					}
					const rowIndex = Math.floor((edge.sourceY + edge.targetY) / 2 / nodeMargin);
					chunks[columnIndex][rowIndex] = true;
					chunks[columnIndex][rowIndex + 1] = true;
				}
			});
		}
	}
}
