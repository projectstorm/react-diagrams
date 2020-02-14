import { DiagramModel } from '../../models/DiagramModel';
import { PortModel } from '../port/PortModel';
import { LinkModel } from '../link/LinkModel';
import { Point, Rectangle } from '@projectstorm/geometry';
import { BaseEntityEvent, BaseModelListener, BasePositionModel, BasePositionModelGenerics, DeserializeEvent } from '@projectstorm/react-canvas-core';
export interface NodeModelListener extends BaseModelListener {
    positionChanged?(event: BaseEntityEvent<NodeModel>): void;
}
export interface NodeModelGenerics extends BasePositionModelGenerics {
    LISTENER: NodeModelListener;
    PARENT: DiagramModel;
}
export declare class NodeModel<G extends NodeModelGenerics = NodeModelGenerics> extends BasePositionModel<G> {
    protected ports: {
        [s: string]: PortModel;
    };
    width: number;
    height: number;
    constructor(options: G['OPTIONS']);
    getBoundingBox(): Rectangle;
    setPosition(point: Point): any;
    setPosition(x: number, y: number): any;
    deserialize(event: DeserializeEvent<this>): void;
    serialize(): {
        ports: {
            name: string;
            alignment: import("../port/PortModel").PortModelAlignment;
            parentNode: string;
            links: string[];
            x: number;
            y: number;
            type: string;
            selected: boolean;
            extras: any;
            id: string;
            locked: boolean;
        }[];
        x: number;
        y: number;
        type: string;
        selected: boolean;
        extras: any;
        id: string;
        locked: boolean;
    };
    doClone(lookupTable: {}, clone: any): void;
    remove(): void;
    getPortFromID(id: any): PortModel | null;
    getLink(id: string): LinkModel;
    getPort(name: string): PortModel | null;
    getPorts(): {
        [s: string]: PortModel;
    };
    removePort(port: PortModel): void;
    addPort(port: PortModel): PortModel;
    updateDimensions({ width, height }: {
        width: number;
        height: number;
    }): void;
}
