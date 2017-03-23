/// <reference types="react" />
import { NodeWidgetFactory, LinkWidgetFactory } from "./WidgetFactories";
import { LinkModel, NodeModel, BaseModel, BaseModelListener, PortModel } from "./Common";
import { BaseEntity, BaseListener } from "./BaseEntity";
import { DiagramModel } from "./DiagramModel";
import { AbstractInstanceFactory } from "./AbstractInstanceFactory";
/**
 * @author Dylan Vorster
 */
export interface DiagramEngineListener extends BaseListener {
    nodeFactoriesUpdated?(): void;
    linkFactoriesUpdated?(): void;
    repaintCanvas?(): void;
}
/**
 * Passed as a parameter to the DiagramWidget
 */
export declare class DiagramEngine extends BaseEntity<DiagramEngineListener> {
    nodeFactories: {
        [s: string]: NodeWidgetFactory;
    };
    linkFactories: {
        [s: string]: LinkWidgetFactory;
    };
    instanceFactories: {
        [s: string]: AbstractInstanceFactory<BaseEntity<BaseListener>>;
    };
    diagramModel: DiagramModel;
    canvas: Element;
    paintableWidgets: {};
    constructor();
    repaintCanvas(): void;
    clearRepaintEntities(): void;
    enableRepaintEntities(entities: BaseModel<BaseModelListener>[]): void;
    /**
     * Checks to see if a model is locked by running through
     * its parents to see if they are locked first
     */
    isModelLocked(model: BaseEntity<BaseListener>): boolean;
    canEntityRepaint(baseModel: BaseModel<BaseModelListener>): boolean;
    setCanvas(canvas: Element | null): void;
    setDiagramModel(model: DiagramModel): void;
    getDiagramModel(): DiagramModel;
    getNodeFactories(): {
        [s: string]: NodeWidgetFactory;
    };
    getLinkFactories(): {
        [s: string]: LinkWidgetFactory;
    };
    getInstanceFactory(className: string): AbstractInstanceFactory<BaseEntity<BaseListener>>;
    registerInstanceFactory(factory: AbstractInstanceFactory<BaseEntity<BaseListener>>): void;
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
