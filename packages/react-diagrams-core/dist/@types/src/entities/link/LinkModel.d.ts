import { PortModel } from '../port/PortModel';
import { PointModel } from './PointModel';
import { LabelModel } from '../label/LabelModel';
import { DiagramModel } from '../../models/DiagramModel';
import { Rectangle } from '@projectstorm/geometry';
import { BaseEntityEvent, BaseModel, BaseModelGenerics, BaseModelListener, DeserializeEvent, ModelGeometryInterface } from '@projectstorm/react-canvas-core';
export interface LinkModelListener extends BaseModelListener {
    sourcePortChanged?(event: BaseEntityEvent<LinkModel> & {
        port: null | PortModel;
    }): void;
    targetPortChanged?(event: BaseEntityEvent<LinkModel> & {
        port: null | PortModel;
    }): void;
}
export interface LinkModelGenerics extends BaseModelGenerics {
    LISTENER: LinkModelListener;
    PARENT: DiagramModel;
}
export declare class LinkModel<G extends LinkModelGenerics = LinkModelGenerics> extends BaseModel<G> implements ModelGeometryInterface {
    protected sourcePort: PortModel | null;
    protected targetPort: PortModel | null;
    protected labels: LabelModel[];
    protected points: PointModel[];
    protected renderedPaths: SVGPathElement[];
    constructor(options: G['OPTIONS']);
    getBoundingBox(): Rectangle;
    getSelectionEntities(): Array<BaseModel>;
    deserialize(event: DeserializeEvent<this>): void;
    getRenderedPath(): SVGPathElement[];
    setRenderedPaths(paths: SVGPathElement[]): void;
    serialize(): {
        source: string;
        sourcePort: string;
        target: string;
        targetPort: string;
        points: {
            x: number;
            y: number;
            type: string;
            selected: boolean;
            extras: any;
            id: string;
            locked: boolean;
        }[];
        labels: {
            offsetX: number;
            offsetY: number;
            type: string;
            selected: boolean;
            extras: any;
            id: string;
            locked: boolean;
        }[];
        type: string;
        selected: boolean;
        extras: any;
        id: string;
        locked: boolean;
    };
    doClone(lookupTable: {}, clone: any): void;
    clearPort(port: PortModel): void;
    remove(): void;
    isLastPoint(point: PointModel): boolean;
    getPointIndex(point: PointModel): number;
    getPointModel(id: string): PointModel | null;
    getPortForPoint(point: PointModel): PortModel;
    getPointForPort(port: PortModel): PointModel;
    getFirstPoint(): PointModel;
    getLastPoint(): PointModel;
    setSourcePort(port: PortModel): void;
    getSourcePort(): PortModel;
    getTargetPort(): PortModel;
    setTargetPort(port: PortModel): void;
    point(x: number, y: number, index?: number): PointModel;
    addLabel(label: LabelModel): void;
    getPoints(): PointModel[];
    getLabels(): LabelModel<import("../label/LabelModel").LabelModelGenerics>[];
    setPoints(points: PointModel[]): void;
    removePoint(pointModel: PointModel): void;
    removePointsBefore(pointModel: PointModel): void;
    removePointsAfter(pointModel: PointModel): void;
    removeMiddlePoints(): void;
    addPoint<P extends PointModel>(pointModel: P, index?: number): P;
    generatePoint(x?: number, y?: number): PointModel;
}
