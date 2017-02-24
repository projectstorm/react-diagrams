import { BaseEnity, BaseListener } from "./BaseEntity";
export interface BaseModelListener extends BaseListener {
    selectionChanged?(): any;
    entityRemoved?(): any;
}
/**
 * @author Dylan Vorster
 */
export declare class BaseModel extends BaseEnity<BaseModelListener> {
    selected: boolean;
    constructor();
    getID(): string;
    isSelected(): boolean;
    setSelected(selected: boolean): void;
    remove(): void;
}
export declare class PointModel extends BaseModel {
    x: number;
    y: number;
    link: LinkModel;
    constructor(link: LinkModel, points: {
        x: number;
        y: number;
    });
    remove(): void;
    updateLocation(points: {
        x: number;
        y: number;
    }): void;
    getX(): number;
    getY(): number;
    getLink(): LinkModel;
}
export declare class LinkModel extends BaseModel {
    linkType: string;
    sourcePort: PortModel | null;
    targetPort: PortModel | null;
    points: PointModel[];
    extras: {};
    constructor();
    remove(): void;
    isLastPoint(point: PointModel): boolean;
    getPointIndex(point: PointModel): number;
    getPointModel(id: string): PointModel | null;
    getFirstPoint(): PointModel;
    getLastPoint(): PointModel;
    setSourcePort(port: PortModel): void;
    getSourcePort(): PortModel;
    getTargetPort(): PortModel;
    setTargetPort(port: PortModel): void;
    getPoints(): PointModel[];
    setPoints(points: PointModel[]): void;
    removePoint(pointModel: PointModel): void;
    addPoint(pointModel: PointModel, index?: number): void;
    getType(): string;
}
export declare class PortModel extends BaseModel {
    name: string;
    parentNode: NodeModel;
    links: {
        [id: string]: LinkModel;
    };
    constructor(name: string);
    getName(): string;
    getParent(): NodeModel;
    setParentNode(node: NodeModel): void;
    removeLink(link: LinkModel): void;
    addLink(link: LinkModel): void;
    getLinks(): {
        [id: string]: LinkModel;
    };
}
export declare class NodeModel extends BaseModel {
    nodeType: string;
    x: number;
    y: number;
    extras: {};
    ports: {
        [s: string]: PortModel;
    };
    constructor(nodeType?: string);
    remove(): void;
    getPort(name: string): PortModel | null;
    getPorts(): {
        [s: string]: PortModel;
    };
    removePort(port: PortModel): void;
    addPort(port: PortModel): PortModel;
    getType(): string;
}
