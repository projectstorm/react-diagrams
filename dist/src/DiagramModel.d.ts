import { LinkModel, NodeModel, BaseModel, BaseModelListener } from "./Common";
import { BaseListener, BaseEntity } from "./BaseEntity";
import { DiagramEngine } from "./DiagramEngine";
/**
 * @author Dylan Vorster
 *
 */
export interface DiagramListener extends BaseListener {
    nodesUpdated(node: any, isCreated: boolean): void;
    linksUpdated(link: any, isCreated: boolean): void;
    /**
     * @deprecated
     */
    controlsUpdated(): void;
    offsetUpdated(model: DiagramModel, offsetX: number, offsetY: number): void;
    zoomUpdated(model: DiagramModel, zoom: number): void;
}
/**
 *
 */
export declare class DiagramModel extends BaseEntity<DiagramListener> {
    links: {
        [s: string]: LinkModel;
    };
    nodes: {
        [s: string]: NodeModel;
    };
    offsetX: number;
    offsetY: number;
    zoom: number;
    rendered: boolean;
    constructor();
    deSerializeDiagram(object: any, diagramEngine: DiagramEngine): void;
    serializeDiagram(): {
        id: string;
    } & {
        offsetX: number;
        offsetY: number;
        zoom: number;
        links: ({
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
        })[];
        nodes: ({
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
        })[];
    };
    clearSelection(ignore?: BaseModel<BaseModelListener> | null): void;
    getSelectedItems(): BaseModel<BaseModelListener>[];
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
