import { BaseEntity, BaseListener } from "./BaseEntity";
export interface BaseModelListener extends BaseListener {
    selectionChanged?(item: any, isSelected: boolean): any;
    entityRemoved?(item: any): any;
}
/**
 * @author Dylan Vorster
 */
export declare class BaseModel extends BaseEntity<BaseModelListener> {
    selected: boolean;
    constructor();
    deSerialize(ob: any): void;
    serialize(): {
        id: string;
    } & {
        _class: string;
        selected: boolean;
    };
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
    deSerialize(ob: any): void;
    serialize(): {
        id: string;
    } & {
        _class: string;
        selected: boolean;
    } & {
        x: number;
        y: number;
    };
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
    deSerialize(ob: any): void;
    serialize(): {
        id: string;
    } & {
        _class: string;
        selected: boolean;
    } & {
        type: string;
        source: string;
        sourcePort: string;
        target: string;
        targetPort: string;
        points: ({
            id: string;
        } & {
            _class: string;
            selected: boolean;
        } & {
            x: number;
            y: number;
        })[];
        extras: {};
    };
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
    deSerialize(ob: any): void;
    serialize(): {
        id: string;
    } & {
        _class: string;
        selected: boolean;
    } & {
        name: string;
        parentNode: string;
        links: string[];
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
    deSerialize(ob: any): void;
    serialize(): {
        id: string;
    } & {
        _class: string;
        selected: boolean;
    } & {
        type: string;
        x: number;
        y: number;
        extras: {};
        ports: ({
            id: string;
        } & {
            _class: string;
            selected: boolean;
        } & {
            name: string;
            parentNode: string;
            links: string[];
        })[];
    };
    remove(): void;
    getPortFromID(id: any): PortModel | null;
    getPort(name: string): PortModel | null;
    getPorts(): {
        [s: string]: PortModel;
    };
    removePort(port: PortModel): void;
    addPort(port: PortModel): PortModel;
    getType(): string;
}
