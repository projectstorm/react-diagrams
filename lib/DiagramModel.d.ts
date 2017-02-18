import { LinkModel, NodeModel, BaseModel } from "./Common";
import { BaseListener, BaseEnity } from "./BaseEntity";
/**
 * @author Dylan Vorster
 *
 */
export interface DiagramListener extends BaseListener {
    nodesUpdated(): any;
    linksUpdated(): any;
    controlsUpdated(): any;
}
/**
 *
 */
export declare class DiagramModel extends BaseEnity<DiagramListener> {
    links: {
        [s: string]: LinkModel;
    };
    nodes: {
        [s: string]: NodeModel;
    };
    offsetX: number;
    offsetY: number;
    zoom: number;
    constructor();
    clearSelection(ignore?: BaseModel | null): void;
    getSelectedItems(): BaseModel[];
    setZoomLevel(zoom: number): void;
    setOffset(offsetX: number, offsetY: number): void;
    setOffsetX(offsetX: number): void;
    setOffsetY(offsetY: number): void;
    getOffsetY(): number;
    getOffsetX(): number;
    getZoomLevel(): number;
    getNode(node: string | NodeModel): NodeModel | null;
    getLink(link: string | LinkModel): LinkModel | null;
    addLink(link: LinkModel): LinkModel;
    addNode(node: NodeModel): NodeModel;
    removeLink(link: LinkModel | string): void;
    removeNode(node: NodeModel | string): void;
    getLinks(): {
        [s: string]: LinkModel;
    };
    getNodes(): {
        [s: string]: NodeModel;
    };
}
