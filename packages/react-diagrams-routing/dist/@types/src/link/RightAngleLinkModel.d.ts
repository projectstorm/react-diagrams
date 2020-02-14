import { DefaultLinkModel, DefaultLinkModelOptions } from '@projectstorm/react-diagrams-defaults';
import { PointModel } from '@projectstorm/react-diagrams-core';
import { DeserializeEvent } from '@projectstorm/react-canvas-core';
export declare class RightAngleLinkModel extends DefaultLinkModel {
    lastHoverIndexOfPath: number;
    private _lastPathXdirection;
    private _firstPathXdirection;
    constructor(options?: DefaultLinkModelOptions);
    setFirstAndLastPathsDirection(): void;
    addPoint<P extends PointModel>(pointModel: P, index?: number): P;
    deserialize(event: DeserializeEvent<this>): void;
    setManuallyFirstAndLastPathsDirection(first: any, last: any): void;
    getLastPathXdirection(): boolean;
    getFirstPathXdirection(): boolean;
    setWidth(width: number): void;
    setColor(color: string): void;
}
