import { PathFindingLinkFactory } from '../link/PathFindingLinkFactory';
import { PointModel } from '@projectstorm/react-diagrams-core';
export default class PathFinding {
    instance: any;
    factory: PathFindingLinkFactory;
    constructor(factory: PathFindingLinkFactory);
    /**
     * Taking as argument a fully unblocked walking matrix, this method
     * finds a direct path from point A to B.
     */
    calculateDirectPath(from: PointModel, to: PointModel): number[][];
    /**
     * Using @link{#calculateDirectPath}'s result as input, we here
     * determine the first walkable point found in the matrix that includes
     * blocked paths.
     */
    calculateLinkStartEndCoords(matrix: number[][], path: number[][]): {
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
    };
    /**
     * Puts everything together: merges the paths from/to the centre of the ports,
     * with the path calculated around other elements.
     */
    calculateDynamicPath(routingMatrix: number[][], start: {
        x: number;
        y: number;
    }, end: {
        x: number;
        y: number;
    }, pathToStart: number[][], pathToEnd: number[][]): any;
}
