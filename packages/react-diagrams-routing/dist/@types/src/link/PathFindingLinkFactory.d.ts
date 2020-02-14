/// <reference types="react" />
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { PathFindingLinkModel } from './PathFindingLinkModel';
import { DefaultLinkFactory } from '@projectstorm/react-diagrams-defaults';
import { AbstractFactory, FactoryBank, ListenerHandle } from '@projectstorm/react-canvas-core';
export declare class PathFindingLinkFactory extends DefaultLinkFactory<PathFindingLinkModel> {
    ROUTING_SCALING_FACTOR: number;
    canvasMatrix: number[][];
    routingMatrix: number[][];
    hAdjustmentFactor: number;
    vAdjustmentFactor: number;
    static NAME: string;
    listener: ListenerHandle;
    constructor();
    setDiagramEngine(engine: DiagramEngine): void;
    setFactoryBank(bank: FactoryBank<AbstractFactory>): void;
    generateReactWidget(event: any): JSX.Element;
    generateModel(event: any): PathFindingLinkModel;
    /**
     * A representation of the canvas in the following format:
     *
     * +-----------------+
     * | 0 0 0 0 0 0 0 0 |
     * | 0 0 0 0 0 0 0 0 |
     * | 0 0 0 0 0 0 0 0 |
     * | 0 0 0 0 0 0 0 0 |
     * | 0 0 0 0 0 0 0 0 |
     * +-----------------+
     *
     * In which all walkable points are marked by zeros.
     * It uses @link{#ROUTING_SCALING_FACTOR} to reduce the matrix dimensions and improve performance.
     */
    getCanvasMatrix(): number[][];
    calculateCanvasMatrix(): void;
    /**
     * A representation of the canvas in the following format:
     *
     * +-----------------+
     * | 0 0 1 1 0 0 0 0 |
     * | 0 0 1 1 0 0 1 1 |
     * | 0 0 0 0 0 0 1 1 |
     * | 1 1 0 0 0 0 0 0 |
     * | 1 1 0 0 0 0 0 0 |
     * +-----------------+
     *
     * In which all points blocked by a node (and its ports) are
     * marked as 1; points were there is nothing (ie, free) receive 0.
     */
    getRoutingMatrix(): number[][];
    calculateRoutingMatrix(): void;
    /**
     * The routing matrix does not have negative indexes, but elements could be negatively positioned.
     * We use the functions below to translate back and forth between these coordinates, relying on the
     * calculated values of hAdjustmentFactor and vAdjustmentFactor.
     */
    translateRoutingX(x: number, reverse?: boolean): number;
    translateRoutingY(y: number, reverse?: boolean): number;
    /**
     * Despite being a long method, we simply iterate over all three collections (nodes, ports and points)
     * to find the highest X and Y dimensions, so we can build the matrix large enough to contain all elements.
     */
    calculateMatrixDimensions: () => {
        width: number;
        hAdjustmentFactor: number;
        height: number;
        vAdjustmentFactor: number;
    };
    /**
     * Updates (by reference) where nodes will be drawn on the matrix passed in.
     */
    markNodes: (matrix: number[][]) => void;
    /**
     * Updates (by reference) where ports will be drawn on the matrix passed in.
     */
    markPorts: (matrix: number[][]) => void;
    markMatrixPoint: (matrix: number[][], x: number, y: number) => void;
    generateDynamicPath(pathCoords: number[][]): any;
}
