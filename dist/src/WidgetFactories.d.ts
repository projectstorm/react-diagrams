/// <reference types="react" />
import { NodeModel, LinkModel } from "./Common";
import { DiagramEngine } from "./DiagramEngine";
/**
 * @author Dylan Vorster
 */
export declare abstract class WidgetFactory {
    type: string;
    constructor(name: string);
    getType(): string;
}
export declare abstract class NodeWidgetFactory extends WidgetFactory {
    abstract generateReactWidget(diagramEngine: DiagramEngine, node: NodeModel): JSX.Element;
}
export declare abstract class LinkWidgetFactory extends WidgetFactory {
    abstract generateReactWidget(diagramEngine: DiagramEngine, link: LinkModel): JSX.Element;
}
