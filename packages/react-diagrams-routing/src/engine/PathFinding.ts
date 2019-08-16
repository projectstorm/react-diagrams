import * as PF from 'pathfinding';
import { PathFindingLinkFactory } from '../link/PathFindingLinkFactory';
import { PointModel } from '@projectstorm/react-diagrams-core';

/*
it can be very expensive to calculate routes when every single pixel on the canvas
is individually represented. Using the factor below, we combine values in order
to achieve the best trade-off between accuracy and performance.
*/

const pathFinderInstance = new PF.JumpPointFinder({
	heuristic: PF.Heuristic.manhattan,
	diagonalMovement: PF.DiagonalMovement.Never
});

export default class PathFinding {
	instance: any;
	factory: PathFindingLinkFactory;

	constructor(factory: PathFindingLinkFactory) {
		this.instance = pathFinderInstance;
		this.factory = factory;
	}

	/**
	 * Taking as argument a fully unblocked walking matrix, this method
	 * finds a direct path from point A to B.
	 */
	calculateDirectPath(from: PointModel, to: PointModel): number[][] {
		const matrix = this.factory.getCanvasMatrix();
		const grid = new PF.Grid(matrix);

		return pathFinderInstance.findPath(
			this.factory.translateRoutingX(Math.floor(from.getX() / this.factory.ROUTING_SCALING_FACTOR)),
			this.factory.translateRoutingY(Math.floor(from.getY() / this.factory.ROUTING_SCALING_FACTOR)),
			this.factory.translateRoutingX(Math.floor(to.getX() / this.factory.ROUTING_SCALING_FACTOR)),
			this.factory.translateRoutingY(Math.floor(to.getY() / this.factory.ROUTING_SCALING_FACTOR)),
			grid
		);
	}

	/**
	 * Using @link{#calculateDirectPath}'s result as input, we here
	 * determine the first walkable point found in the matrix that includes
	 * blocked paths.
	 */
	calculateLinkStartEndCoords(
		matrix: number[][],
		path: number[][]
	): {
		start: {
			x: number;
			y: number;
		};
		end: {
			x: number;
			y: number;
		};
		pathToStart: number[][];
		pathToEnd: number[][];
	} {
		const startIndex = path.findIndex(point => {
			if (matrix[point[1]]) return matrix[point[1]][point[0]] === 0;
			else return false;
		});
		const endIndex =
			path.length -
			1 -
			path
				.slice()
				.reverse()
				.findIndex(point => {
					if (matrix[point[1]]) return matrix[point[1]][point[0]] === 0;
					else return false;
				});

		// are we trying to create a path exclusively through blocked areas?
		// if so, let's fallback to the linear routing
		if (startIndex === -1 || endIndex === -1) {
			return undefined;
		}

		const pathToStart = path.slice(0, startIndex);
		const pathToEnd = path.slice(endIndex);

		return {
			start: {
				x: path[startIndex][0],
				y: path[startIndex][1]
			},
			end: {
				x: path[endIndex][0],
				y: path[endIndex][1]
			},
			pathToStart,
			pathToEnd
		};
	}

	/**
	 * Puts everything together: merges the paths from/to the centre of the ports,
	 * with the path calculated around other elements.
	 */
	calculateDynamicPath(
		routingMatrix: number[][],
		start: {
			x: number;
			y: number;
		},
		end: {
			x: number;
			y: number;
		},
		pathToStart: number[][],
		pathToEnd: number[][]
	) {
		// generate the path based on the matrix with obstacles
		const grid = new PF.Grid(routingMatrix);
		const dynamicPath = pathFinderInstance.findPath(start.x, start.y, end.x, end.y, grid);

		// aggregate everything to have the calculated path ready for rendering
		const pathCoords = pathToStart
			.concat(dynamicPath, pathToEnd)
			.map(coords => [
				this.factory.translateRoutingX(coords[0], true),
				this.factory.translateRoutingY(coords[1], true)
			]);
		return PF.Util.compressPath(pathCoords);
	}
}
