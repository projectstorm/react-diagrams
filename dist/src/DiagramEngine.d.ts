/// <reference types="react" />
import { NodeWidgetFactory, LinkWidgetFactory } from "./WidgetFactories";
import { LinkModel, NodeModel, BaseModel, PortModel } from "./Common";
import { BaseEnity, BaseListener } from "./BaseEntity";
import { DiagramModel } from "./DiagramModel";
/**
 * @author Dylan Vorster
 */
export interface DiagramEngineListener extends BaseListener {
    nodeFactoriesUpdated(): any;
    linkFactoriesUpdated(): any;
}
/**
 * Passed as a parameter to the DiagramWidget
 */
export declare class DiagramEngine extends BaseEnity<DiagramEngineListener> {
    nodeFactories: {
        [s: string]: NodeWidgetFactory;
    };
    linkFactories: {
        [s: string]: LinkWidgetFactory;
    };
    diagramModel: DiagramModel;
    canvas: Element;
    paintableWidgets: {};
    constructor();
    clearRepaintEntities(): void;
    enableRepaintEntities(entities: BaseModel[]): void;
    canEntityRepaint(baseModel: BaseModel): boolean;
    setCanvas(canvas: Element | null): void;
    setDiagramModel(model: DiagramModel): void;
    getDiagramModel(): DiagramModel;
    getNodeFactories(): {
        [s: string]: NodeWidgetFactory;
    };
    getLinkFactories(): {
        [s: string]: LinkWidgetFactory;
    };
    registerNodeFactory(factory: NodeWidgetFactory): void;
    registerLinkFactory(factory: LinkWidgetFactory): void;
    getFactoryForNode(node: NodeModel): NodeWidgetFactory | null;
    getFactoryForLink(link: LinkModel): LinkWidgetFactory | null;
    generateWidgetForLink(link: LinkModel): JSX.Element | null;
    generateWidgetForNode(node: NodeModel): JSX.Element | null;
    getRelativeMousePoint(event: any): {
        x: number;
        y: number;
    };
    getRelativePoint(x: any, y: any): {
        x: number;
        y: number;
    };
    getNodePortElement(port: PortModel): any;
    getPortCenter(port: PortModel): {
        x: number;
        y: number;
    };
}
