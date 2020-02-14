import { DiagramModel } from '@projectstorm/react-diagrams-core';
import { GraphLabel } from 'dagre';
export interface DagreEngineOptions {
    graph?: GraphLabel;
    /**
     * Will also layout links
     */
    includeLinks?: boolean;
}
export declare class DagreEngine {
    options: DagreEngineOptions;
    constructor(options?: DagreEngineOptions);
    redistribute(model: DiagramModel): void;
}
