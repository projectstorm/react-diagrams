import { NodeModel } from '../node/NodeModel';
import { LinkModel } from '../link/LinkModel';
import { Point, Rectangle } from '@projectstorm/geometry';
import { BaseEntityEvent, BaseModelOptions, BasePositionModel, BasePositionModelGenerics, BasePositionModelListener, DeserializeEvent } from '@projectstorm/react-canvas-core';
export declare enum PortModelAlignment {
    TOP = "top",
    LEFT = "left",
    BOTTOM = "bottom",
    RIGHT = "right"
}
export interface PortModelListener extends BasePositionModelListener {
    /**
     * fires when it first receives positional information
     */
    reportInitialPosition?: (event: BaseEntityEvent<PortModel>) => void;
}
export interface PortModelOptions extends BaseModelOptions {
    alignment?: PortModelAlignment;
    maximumLinks?: number;
    name: string;
}
export interface PortModelGenerics extends BasePositionModelGenerics {
    OPTIONS: PortModelOptions;
    PARENT: NodeModel;
    LISTENER: PortModelListener;
}
export declare class PortModel<G extends PortModelGenerics = PortModelGenerics> extends BasePositionModel<G> {
    links: {
        [id: string]: LinkModel;
    };
    width: number;
    height: number;
    reportedPosition: boolean;
    constructor(options: G['OPTIONS']);
    deserialize(event: DeserializeEvent<this>): void;
    serialize(): {
        name: string;
        alignment: PortModelAlignment;
        parentNode: string;
        links: string[];
        x: number;
        y: number;
        type: string;
        selected: boolean;
        extras: any;
        id: string;
        locked: boolean;
    };
    setPosition(point: Point): any;
    setPosition(x: number, y: number): any;
    doClone(lookupTable: {}, clone: any): void;
    getNode(): NodeModel;
    getName(): string;
    getMaximumLinks(): number;
    setMaximumLinks(maximumLinks: number): void;
    removeLink(link: LinkModel): void;
    addLink(link: LinkModel): void;
    getLinks(): {
        [id: string]: LinkModel;
    };
    createLinkModel(): LinkModel | null;
    reportPosition(): void;
    getCenter(): Point;
    updateCoords(coords: Rectangle): void;
    canLinkToPort(port: PortModel): boolean;
    isLocked(): boolean;
}
